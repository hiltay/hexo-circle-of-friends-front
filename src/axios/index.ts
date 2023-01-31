import axios from 'axios'
import { RequestInterceptors, RequestConfig } from './type'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class Request {
    instance: AxiosInstance
    interceptorsObj?: RequestInterceptors
    constructor(config: RequestConfig) {
        this.instance = axios.create(config)
        this.interceptorsObj = config.interceptors

        this.instance.interceptors.request.use(
            (res: AxiosRequestConfig) => {
                return res
            },
            (err: any) => err,
        )

        // 使用实例拦截器
        this.instance.interceptors.request.use(
            this.interceptorsObj?.requestInterceptors,
            this.interceptorsObj?.requestInterceptorsCatch,
        )
        this.instance.interceptors.response.use(
            this.interceptorsObj?.responseInterceptors,
            this.interceptorsObj?.responseInterceptorsCatch,
        )

        this.instance.interceptors.response.use(
            (res: AxiosResponse) => {
                return res.data
            },
            (err: any) => err,
        )
    }
    request<T>(config: RequestConfig): Promise<T> {
        return new Promise((resolve, reject) => {
            if (config.interceptors?.requestInterceptors) {
                config = config.interceptors.requestInterceptors(config)
            }
            this.instance
                .request<any, T>(config)
                .then(res => {
                    if (config.interceptors?.responseInterceptors) {
                        res = config.interceptors.responseInterceptors<T>(res)
                    }

                    resolve(res)
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    }
    get<T = any>(config: RequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: "GET" });
    }

    post<T = any>(config: RequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: "POST" });
    }

    delete<T = any>(config: RequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: "DELETE" });
    }

    patch<T = any>(config: RequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: "PATCH" });
    }

    put<T = any>(config: RequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: "PUT" });
    }

}

export default Request