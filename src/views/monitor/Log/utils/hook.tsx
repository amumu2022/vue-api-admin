/*
 * @Author: XDTEAM
 * @Date: 2025-05-27 22:33:43
 * @LastEditTime: 2025-05-28 18:32:38
 * @LastEditors: XDTEAM
 * @Description:
 */

import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { getStreamLogs, DelLogs } from "@/api/system/monitor";
import AnsiToHtml from "ansi-to-html";

const converter = new AnsiToHtml();

const levelClassMap: Record<string, string> = {
  info: "log-info",
  error: "log-error",
  warning: "log-warning",
  debug: "log-debug",
  success: "log-success"
};

export function useLogStream() {
  const scrollbarRef = ref();
  const logs = ref<string[]>([]);
  const autoScroll = ref(true);
  let eventSource: EventSource | null = null;

  // 解析日志，提取时间戳、等级、内容
  const parsedLogs = computed(() =>
    logs.value.map(raw => {
      // 正则提取
      const match = raw.match(
        /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}) \| (\w+) - (.*)$/
      );
      if (match) {
        const [, timestamp, levelRaw, contentRaw] = match;
        let content = contentRaw;
        const level = levelRaw.toLowerCase();
        content = `| ${levelRaw} - ${content}`;
        // INFO 用白色，其他等级用各自颜色
        return {
          timestamp,
          levelClass: levelClassMap[level] || "log-info",
          htmlContent:
            level === "info"
              ? converter.toHtml(content)
              : converter.toHtml(content)
        };
      } else {
        // 不匹配的行，全部白色
        return {
          timestamp: "",
          levelClass: "log-info",
          htmlContent: converter.toHtml(raw)
        };
      }
    })
  );

  function handleScroll() {
    if (!scrollbarRef.value) return;
    const wrap = scrollbarRef.value.$el.querySelector(".el-scrollbar__wrap");
    if (!wrap) return;
    const { scrollHeight, scrollTop, clientHeight } = wrap;
    autoScroll.value = scrollHeight - scrollTop - clientHeight < 50;
  }

  async function scrollToBottom() {
    await nextTick();
    if (autoScroll.value && scrollbarRef.value) {
      const wrap = scrollbarRef.value.$el.querySelector(".el-scrollbar__wrap");
      if (wrap) {
        wrap.scrollTop = wrap.scrollHeight;
      }
    }
  }

  function startLogStream() {
    try {
      if (eventSource) {
        eventSource.close();
      }
      eventSource = getStreamLogs();
      eventSource.onmessage = async event => {
        logs.value.push(event.data);
        await scrollToBottom();
      };
      eventSource.onerror = error => {
        console.error("日志流错误:", error);
        eventSource?.close();
        setTimeout(startLogStream, 3000);
      };
    } catch (error) {
      console.error("创建日志流失败:", error);
    }
  }

  async function clearLogs() {
    logs.value = [];
    await DelLogs();
    autoScroll.value = true;
    scrollToBottom();
  }

  onMounted(() => {
    startLogStream();
  });

  onUnmounted(() => {
    eventSource?.close();
    eventSource = null;
  });

  return {
    scrollbarRef,
    parsedLogs,
    handleScroll,
    clearLogs
  };
}
