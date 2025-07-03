/*
 * @Author: XDTEAM
 * @Date: 2025-07-02 23:39:15
 * @LastEditTime: 2025-07-02 23:39:31
 * @LastEditors: XDTEAM
 * @Description:
 */

/**
 * 跳转到IP归属地查询页面
 * @param {string} ip - 需要查询的IP地址
 */
export function openIpLocation(ip: string) {
  const url = `https://ip.cn/ip/${ip}.html`;
  window.open(url, "_blank");
}
