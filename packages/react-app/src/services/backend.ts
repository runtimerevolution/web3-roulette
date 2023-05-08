import axios, { AxiosRequestConfig, Method } from "axios";
import { Giveaway } from "../lib/types";

class BackendService {
  setToken = (token: string) => sessionStorage.setItem('token', token);
  getToken = () => sessionStorage.getItem('token');
  authHeader = () => ({ 'AUTHORIZATION': `Bearer ${this.getToken()}` });

  makeRequest<T>(route: string, method: Method, headers?: any, params?: any): Promise<T> {
    const instance = axios.create();

    const successResponseInterceptor = (response: any) => response.data;
    const errorResponseInterceptor = (error: any) => {
      if (error?.response?.status === 401 && error?.request?.headers?.AUTHORIZATION) {
        sessionStorage.removeItem('token');
        window.location.href = `/login?referrer=${encodeURIComponent(window.location.href)}`;
      }
      console.error(error);
    }

    instance.interceptors.response.use(successResponseInterceptor, errorResponseInterceptor);

    const axiosRequestConfig: AxiosRequestConfig = {
      url: route,
      method,
      baseURL: 'config.API',
      timeout: 1000 * 30, // 30s
    };

    if (params && method === 'GET') {
      axiosRequestConfig.params = params;
    }
    if (params && method !== 'GET') {
      axiosRequestConfig.data = params;
    }
    if (headers) {
      axiosRequestConfig.headers = headers
    }

    return instance.request(axiosRequestConfig);
  };

  getActiveGiveaways = () => //this.makeRequest<Giveaway[]>('/giveaways', 'GET', this.authHeader());
    [{
      title: "Giveaway 1",
      description: "Description for Giveaway 1",
      startTime: new Date(),
      endTime: new Date(),
      //participants?: string[]
      winners: [],
      numberOfWinners: 1,
      // requirements?: object;
    }, {
      title: "Giveaway 2",
      description: "Description for Giveaway 2",
      startTime: new Date(),
      endTime: new Date(),
      // participants?: string[]
      winners: [],
      numberOfWinners: 2,
      // requirements?: object;
    }, {
      title: "Giveaway 3",
      description: "Description for Giveaway 3",
      startTime: new Date(),
      endTime: new Date(),
      // participants?: string[]
      winners: [],
      numberOfWinners: 3,
      // requirements?: object;
    }]
}

const API = new BackendService();
export default API;
