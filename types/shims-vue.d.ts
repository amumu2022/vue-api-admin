/*
 * @Author: XDTEAM
 * @Date: 2025-05-01 12:31:39
 * @LastEditTime: 2025-05-01 12:48:50
 * @LastEditors: XDTEAM
 * @Description: 
 */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.scss" {
  const scss: Record<string, string>;
  export default scss;
}
