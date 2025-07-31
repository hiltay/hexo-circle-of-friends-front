/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

// 全局类型声明
declare global {
  // 用户配置接口
  interface UserConfigInterface {
    private_api_url?: string;
    page_init_number?: number;
    page_turning_number?: number;
    error_img?: string;
    sort_rule?: string;
    expire_days?: number;
  }

  // 全局变量声明
  const UserConfig: UserConfigInterface | undefined;
}

export {}
