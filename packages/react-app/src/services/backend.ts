import axios, { AxiosRequestConfig, Method } from 'axios';

import { Giveaway } from '../lib/types';
import Constants from '../utils/Constants';

class BackendService {
  makeRequest<T>(
    route: string,
    method: Method,
    headers?: any,
    params?: any
  ): Promise<T> {
    const instance = axios.create();

    const successResponseInterceptor = (response: any) => response.data;
    const errorResponseInterceptor = (error: any) => {
      if (
        error?.response?.status === 401 &&
        error?.request?.headers?.AUTHORIZATION
      ) {
        sessionStorage.removeItem('token');
        window.location.href = `/login?referrer=${encodeURIComponent(
          window.location.href
        )}`;
      }
      console.error(error);
    };

    instance.interceptors.response.use(
      successResponseInterceptor,
      errorResponseInterceptor
    );

    const axiosRequestConfig: AxiosRequestConfig = {
      url: route,
      method,
      baseURL: Constants.LUCKDART_URI,
      timeout: 1000 * 30, // 30s
    };

    if (params && method === 'GET') {
      axiosRequestConfig.params = params;
    }
    if (params && method !== 'GET') {
      axiosRequestConfig.data = params;
    }
    if (headers) {
      axiosRequestConfig.headers = headers;
    }

    return instance.request(axiosRequestConfig);
  }

  getGiveaways = async () => {
    return await this.makeRequest<Giveaway[]>('/giveaways/', 'GET');
  };

  getGiveaway = async (giveawayId: string) => {
    return await this.makeRequest<Giveaway>(`/giveaways/${giveawayId}/`, 'GET');
  };
}

const API = new BackendService();
export default API;
