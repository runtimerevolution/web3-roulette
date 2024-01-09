import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';

import { Giveaway, Location, Participant } from '../lib/types';
import { get } from '../utils/constants.util';
import GeolocationService, { Coordinates } from './geolocation';

type ParticipantBody = {
  id: string;
  name: string;
  location?: Coordinates;
};

type GiveawaysRes = {
  totalGiveaways: number;
  giveaways: Giveaway[];
};

class BackendService {
  makeRequest<T>(
    route: string,
    method: Method,
    headers?: any,
    params?: any,
    successCallback?: () => void,
    errorCallback?: () => void
  ): Promise<T> {
    const instance = axios.create();

    const successResponseInterceptor = (response: AxiosResponse) => {
      successCallback?.();
      return response.data;
    };

    const errorResponseInterceptor = (error: AxiosError) => {
      errorCallback?.();
      return Promise.reject(error.response);
    };

    instance.interceptors.response.use(
      successResponseInterceptor,
      errorResponseInterceptor
    );

    const axiosRequestConfig: AxiosRequestConfig = {
      url: route,
      method,
      baseURL: String(get('API_URI')),
      timeout: 1000 * 30, // 30s
    };

    if (params && method === 'GET') {
      axiosRequestConfig.params = params;
    }
    if (params && method !== 'GET') {
      axiosRequestConfig.data = params;
    }

    const authToken = localStorage.getItem('authToken');
    axiosRequestConfig.headers = {
      ...headers,
      Authorization: `Bearer ${authToken}`,
      'Cache-Control': 'no-cache',
    };
    return instance.request(axiosRequestConfig);
  }

  getGiveaways = async (active: boolean) => {
    const res = await this.makeRequest<GiveawaysRes>(
      `/giveaways${active !== undefined ? `?active=${active}` : ''}`,
      'GET'
    );
    if (res) {
      res.giveaways.forEach((g) => {
        g.startTime = new Date(g.startTime);
        g.endTime = new Date(g.endTime);
      });
    }
    return res;
  };

  saveGiveaway = (data: FormData) => {
    const id = data.get('_id');
    const url = id ? `/giveaways/${id}` : '/giveaways/';
    const requestType = id ? 'PUT' : 'POST';
    return this.makeRequest(
      url,
      requestType,
      { 'Content-Type': 'multipart/form-data' },
      data
    );
  };

  getGiveaway = async (giveawayId: string) => {
    const giveaway = await this.makeRequest<Giveaway>(
      `/giveaways/${giveawayId}/`,
      'GET'
    );
    if (giveaway) {
      giveaway.startTime = new Date(giveaway.startTime);
      giveaway.endTime = new Date(giveaway.endTime);
      return giveaway;
    }else{
      window.location.replace("/");
    }
  };

  getLocations = async () => {
    return await this.makeRequest<Location[]>('/locations/', 'GET');
  };

  getLocation = async (locationId: string) => {
    const locations = await this.getLocations();
    return locations.find((l) => l._id === locationId);
  };

  postLocation = async (location: Location) =>
    this.makeRequest('/locations/', 'POST', undefined, location);

  getParticipants = async (giveawayId: string) => {
    return await this.makeRequest<Participant[]>(
      `/giveaways/${giveawayId}/participants/`,
      'GET'
    );
  };

  postParticipant = async (
    giveaway: Giveaway,
    participantId: string,
    participantName: string,
    successCallback?: () => void,
    errorCallback?: () => void
  ) => {
    const body: ParticipantBody = { id: participantId, name: participantName };

    if (giveaway.requirements?.location) {
      const location = await GeolocationService.getLocation();
      if (location) {
        body.location = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
      }
    }

    await this.makeRequest(
      `/giveaways/${giveaway._id}/participants/`,
      'PUT',
      undefined,
      body,
      successCallback,
      errorCallback
    );
  };

  manageParticipant = async (
    giveawayId: string,
    participantId: string,
    newState: string,
    successCallback?: () => void,
    errorCallback?: () => void
  ) => {
    const body = { state: newState };
    await this.makeRequest(
      `/giveaways/${giveawayId}/participants/${participantId}`,
      'PUT',
      undefined,
      body,
      successCallback,
      errorCallback
    );
  };

  setNotifiedParticipant = async (
    giveawayId: string,
    participantId: string
  ) => {
    const body = { notified: true };
    await this.makeRequest(
      `/giveaways/${giveawayId}/participants/${participantId}`,
      'PUT',
      undefined,
      body
    );
  };

  generateWinners = async (giveawayId: string) => {
    return await this.makeRequest(
      `/giveaways/${giveawayId}/generate-winners`,
      'GET'
    );
  };
}

const API = new BackendService();
export default API;
