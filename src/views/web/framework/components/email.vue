<script setup lang="ts">
import { InfoFilled } from "@element-plus/icons-vue";
import { emailConfigRules, emailSendRules } from "../utils/rule";
import { EmailSet, EmailSend } from "../utils/types";
import { message } from "@/utils/message";
import { ref, onBeforeMount } from "vue";
import { getDockData, UpdateDock } from "@/api/system/dock";
import { ApiSendEmail } from "@/api/system/api";
import orange from "@iconify-icons/ep/orange";
import Save from "@iconify-icons/ri/save-3-fill";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
const activeName = ref("1");
const EmailOptions = [
  {
    value: "smtp.qq.com",
    label: "smtp.qq.com"
  },
  {
    value: "smtp.126.com",
    label: "smtp.126.com"
  },
  {
    value: "smtp.163.com",
    label: "smtp.163.com"
  },
  {
    value: "smtp.mail.yahoo.com.cn",
    label: "smtp.mail.yahoo.com.cn"
  },
  {
    value: "smtp.sohu.com",
    label: "smtp.sohu.com"
  },
  {
    value: "smtp.gmail.com",
    label: "smtp.gmail.com"
  },
  {
    value: "smtp.sina.com.cn",
    label: "smtp.sina.com.cn"
  }
];

const SendOptions = [
  {
    value: 0,
    label: "HTML文本"
  },
  {
    value: 1,
    label: "纯文本"
  }
];

const formRef = ref();

const emailSetProps = ref({
  email: "",
  code: "",
  observer: ""
});

const emailSendProps = ref({
  plain: 1,
  mailto_list: "",
  title: "",
  text: ""
});

async function reloadEmail() {
  const post_data = { name: "email" };
  const { data } = await getDockData(post_data);
  if (data.length != 0) {
    const back = data[0].data;
    emailSetProps.value = {
      code: back?.code,
      email: back?.email,
      observer: back?.observer
    };
  }
}

async function reloadSendEmail() {
  const post_data = { name: "emailSend" };
  const { data } = await getDockData(post_data);
  if (data.length != 0) {
    const back = data[0].data;
    emailSendProps.value = {
      plain: back?.plain,
      mailto_list: back?.mailto_list,
      text: back?.text,
      title: back?.title
    };
  }
}

async function saveEmail() {
  const post_data = { name: "email", data: emailSetProps };
  const data = await UpdateDock("email", post_data);
  if (data.success) {
    message(data.message, { type: "success" });
    reloadEmail();
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

async function sendEmail() {
  const send_data = emailSendProps;

  const post_data = { name: "emailSend", data: send_data };
  const data = await UpdateDock("emailSend", post_data);
  if (data.success) {
    const req = await ApiSendEmail(send_data);
    if (req.success) {
      message(req.message, { type: "success" });
    } else {
      message(req.message, { type: "warning" });
    }
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

onBeforeMount(() => {
  reloadEmail();
  reloadSendEmail();
});
</script>

<template>
  <el-card>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="1">
        <template #title>
          邮箱配置
          <el-icon class="header-icon">
            <info-filled />
          </el-icon>
        </template>
        <el-form
          ref="formRef"
          :model="emailSetProps"
          :rules="emailConfigRules"
          label-position="left"
          label-width="80px"
          size="default"
          @submit.prevent
        >
          <el-row>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="邮箱账号" prop="email">
                <el-input
                  v-model="emailSetProps.email"
                  type="text"
                  clearable
                  placeholder="请输入邮箱账号"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                label="授权码"
                prop="code"
              >
                <el-input
                  v-model="emailSetProps.code"
                  type="password"
                  clearable
                  placeholder="请输入授权码"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="服务地址" prop="observer">
                <el-select v-model="emailSetProps.observer" clearable>
                  <el-option
                    v-for="(item, index) in EmailOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-button
              type="success"
              :icon="useRenderIcon(Save)"
              @click="saveEmail"
              >保存设置</el-button
            >

            <el-button
              type="danger"
              :icon="useRenderIcon(orange)"
              @click="reloadEmail"
              >重载</el-button
            >
          </el-row>
        </el-form>
      </el-collapse-item>

      <el-collapse-item title="邮箱发信" name="2">
        <el-form
          ref="formRef"
          :model="emailSendProps"
          :rules="emailSendRules"
          label-position="left"
          label-width="80px"
          size="default"
          @submit.prevent
        >
          <el-row>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="发信类型" prop="plain">
                <el-select v-model="emailSendProps.plain" clearable>
                  <el-option
                    v-for="(item, index) in SendOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="收信账户" prop="mailto_list">
                <el-input
                  v-model="emailSendProps.mailto_list"
                  type="text"
                  clearable
                  placeholder="请输入收信账户"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="邮件主题" prop="title">
                <el-input
                  v-model="emailSendProps.title"
                  type="text"
                  clearable
                  placeholder="请输入邮件主题"
                />
              </el-form-item>
            </el-col>

            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="邮件内容" prop="text">
                <el-input
                  v-model="emailSendProps.text"
                  :rows="10"
                  resize="none"
                  clearable
                  type="textarea"
                  placeholder="请输入邮件内容"
                />
              </el-form-item>
            </el-col>

            <el-button
              type="success"
              :icon="useRenderIcon(Save)"
              @click="sendEmail"
              >测试一下</el-button
            >
            <el-button
              type="danger"
              :icon="useRenderIcon(orange)"
              @click="reloadSendEmail"
              >重载</el-button
            >
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>
