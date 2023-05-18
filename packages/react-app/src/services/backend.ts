import axios, { AxiosRequestConfig, Method } from 'axios';

import { Giveaway, Location } from '../lib/types';
import Constants from '../utils/Constants';

class BackendService {
  makeRequest<T>(
    route: string,
    method: Method,
    headers?: any,
    params?: any,
    errorCallback?: () => void
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
      errorCallback?.();
    };

    instance.interceptors.response.use(
      successResponseInterceptor,
      errorResponseInterceptor
    );

    const axiosRequestConfig: AxiosRequestConfig = {
      url: route,
      method,
      baseURL: Constants.FRONTEND_URI,
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
    const giveaways = await this.makeRequest<Giveaway[]>('/giveaways/', 'GET');
    giveaways.forEach((g) => {
      g.startTime = new Date(g.startTime);
      g.endTime = new Date(g.endTime);
    });
    return giveaways;
  };

  getGiveaway = async (giveawayId: string) => {
    const giveaway = await this.makeRequest<Giveaway>(
      `/giveaways/${giveawayId}/`,
      'GET'
    );
    giveaway.startTime = new Date(giveaway.startTime);
    giveaway.endTime = new Date(giveaway.endTime);
    return giveaway;
  };

  getLocations = async () => {
    return await this.makeRequest<Location[]>('/locations/', 'GET');
  };

  getLocation = async (locationId: string) => {
    const locations = await this.getLocations();
    return locations.find((l) => l._id === locationId);
  };

  postParticipant = async (
    giveawayId: string,
    participant: string,
    errorCallback?: () => void
  ) => {
    const body = { participant: participant };
    await this.makeRequest(
      `/giveaways/${giveawayId}/participants/`,
      'PUT',
      undefined,
      body,
      errorCallback
    );
  };
}

const API = new BackendService();
export default API;
