import { envs, IEnvs } from "@/constants/envs";
import { handleApiError } from "@/utils/handleApiError";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface AxiosAdapter {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  setToken(token?: string): void;
}

class AxiosAdapterImpl implements AxiosAdapter {
  private axios: AxiosInstance;

  constructor(envs: IEnvs) {
    this.axios = axios.create({
      baseURL: envs.API_URL,
    });

    console.log("[AxiosAdapter] Base URL:", envs.API_URL);

    this.axios.interceptors.request.use((config) => {
      console.log("[HTTP Request]", {
        method: config.method,
        baseURL: config.baseURL,
        url: config.url,
        data: config.data,
      });
      return config;
    });

    this.axios.interceptors.response.use(...this.interceptorsResponse());
  }

  async get<T = any>(url: string, config?: any) {
    return this.axios.get<T>(url, config).then((res) => res.data);
  }

  async post<T = any>(url: string, data?: any, config?: any) {
    return this.axios.post<T>(url, data, config).then((res) => res.data);
  }

  async put<T = any>(url: string, data?: any, config?: any) {
    return this.axios.put<T>(url, data, config).then((res) => res.data);
  }

  async delete<T = any>(url: string, config?: any) {
    return this.axios.delete<T>(url, config).then((res) => res.data);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.axios.patch<T>(url, data, config).then((res) => res.data);
  }

  setToken(token?: string) {
    if (token) {
      this.axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      return;
    }
    delete this.axios.defaults.headers.common.Authorization;
  }

  private interceptorsResponse() {
    return [
      (response: AxiosResponse) => response,
      (error: any) => {
        if (typeof __DEV__ !== "undefined" ? __DEV__ : process.env.NODE_ENV !== "production") {
          console.error("[HTTP Error]", {
            method: error?.config?.method,
            baseURL: error?.config?.baseURL,
            url: error?.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            dataJson: JSON.stringify(error.response?.data ?? null),
            message: error.message,
          });
        }

        try {
          handleApiError(error, { variant: "destructive" });
        } catch (e) {
          console.warn("[handleApiError] failed", e);
        }

        return Promise.reject(error);
      },
    ] as const;
  }
}

export const axiosAdapter: AxiosAdapter = new AxiosAdapterImpl(envs);
