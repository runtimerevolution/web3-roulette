import axios, {
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  AxiosError,
} from 'axios';

import { Giveaway, Location, Participant } from '../lib/types';
import Constants from '../utils/Constants';
import GeolocationService, { Coordinates } from './geolocation';

type ParticipantBody = {
  id: string;
  name: string;
  location?: Coordinates;
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
      if (
        error?.response?.status === 401 &&
        error?.request?.headers?.AUTHORIZATION
      ) {
        sessionStorage.removeItem('token');
        window.location.href = `/login?referrer=${encodeURIComponent(
          window.location.href
        )}`;
      }

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
      baseURL: Constants.API_URI,
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
    if (giveaways) {
      giveaways.forEach((g) => {
        g.startTime = new Date(g.startTime);
        g.endTime = new Date(g.endTime);
      });
    }
    return giveaways;
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
}

const API = new BackendService();
export default API;
