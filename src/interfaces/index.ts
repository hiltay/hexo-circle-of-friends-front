import Request from "@/axios/index";
import Cache from "@/utils/cache";
import useMainStore from "@/stores/main"

export const request_auth = new Request({
  interceptors: {
    requestInterceptors: (config: any) => {
      const token = Cache.getCache("fcircle-token");
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: "Bearer " + token,
        };
      }
      return config;
    },
    requestInterceptorsCatch: (err) => {
      return err;
    },
    responseInterceptors: (res) => {
      return res;
    },
    responseInterceptorsCatch: (err) => {
      return err;
    },
  },
});

export const request_default = new Request({
  interceptors: {
    requestInterceptors: (config: any) => {
      return config;
    },
    requestInterceptorsCatch: (err) => {
      return err;
    },
    responseInterceptors: (res) => {
      return res;
    },
    responseInterceptorsCatch: (err) => {
      return err;
    },
  },
});


