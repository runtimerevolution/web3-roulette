import axios, { AxiosRequestConfig, Method } from "axios";
import { Giveaway } from "../lib/types";

class BackendService {
  // setToken = (token: string) => sessionStorage.setItem('token', token);
  // getToken = () => sessionStorage.getItem('token');
  // authHeader = () => ({ 'AUTHORIZATION': `Bearer ${this.getToken()}` });

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

  // Dummy giveaways:
  getActiveGiveaways = () => //this.makeRequest<Giveaway[]>('/giveaways', 'GET', this.authHeader());
    // Response delay emulator to test skeletons. 
    new Promise(resolve => setTimeout(resolve, 2500)).then(() => [{
      id: 1,
      title: "Giveaway 1",
      description: "Small description, lorem ipsum dolor sit amet consectetur. Elementum facilisi diam amet turpis. Nisi pharetra aenean tristique at enim lacus",
      startTime: new Date(),
      endTime: new Date(2023,11,31),
      //participants?: string[]
      winners: [],
      numberOfWinners: 1,
      // requirements?: object;
      image: 'https://www.pixartprinting.es/blog/wp-content/uploads/2022/09/giveaway.jpg',
      prize: 'Giveaway prize 1',
    }, {
      id: 2,
      title: "Giveaway 2",
      description: "Small description, lorem ipsum dolor sit amet consectetur. Elementum facilisi diam amet turpis. Nisi pharetra aenean tristique at enim lacus",
      startTime: new Date(),
      endTime: new Date(2023,10,30),
      // participants?: string[]
      winners: [],
      numberOfWinners: 2,
      // requirements?: object;
      image: 'https://t3.ftcdn.net/jpg/04/79/85/96/360_F_479859640_VgIrNOAOFDbOAf239leq2GX1r8kbzSYt.jpg',
      prize: 'Giveaway prize 2',
    }, {
      id: 3,
      title: "Giveaway 3",
      description: "Small description, lorem ipsum dolor sit amet consectetur. Elementum facilisi diam amet turpis. Nisi pharetra aenean tristique at enim lacus",
      startTime: new Date(),
      endTime: new Date(2023,9,31),
      // participants?: string[]
      winners: [],
      numberOfWinners: 3,
      // requirements?: object;
      image: 'https://dalistrategies.com/wp-content/uploads/2020/11/male-hand-holding-megaphone-with-giveaway-speech-bubble-loudspeaker-vector-id1197835447.jpg',
      prize: 'Giveaway prize 3',
    }, {
      id: 4,
      title: "Giveaway 4",
      description: "Small description, lorem ipsum dolor sit amet consectetur. Elementum facilisi diam amet turpis. Nisi pharetra aenean tristique at enim lacus",
      startTime: new Date(),
      endTime: new Date(2023,8,30),
      // participants?: string[]
      winners: [],
      numberOfWinners: 4,
      // requirements?: object;
      image: 'https://img.freepik.com/premium-vector/giveaway-with-gift-box-label-vector_32996-2169.jpg',
      prize: 'Giveaway prize 4',
    }, {
      id: 4,
      title: "Giveaway 5",
      description: "Small description, lorem ipsum dolor sit amet consectetur. Elementum facilisi diam amet turpis. Nisi pharetra aenean tristique at enim lacus",
      startTime: new Date(),
      endTime: new Date(2023,2,31),
      // participants?: string[]
      winners: [],
      numberOfWinners: 5,
      // requirements?: object;
      image: 'https://media.istockphoto.com/id/1183256238/pt/vetorial/giveaway-banner-for-social-media-contests-and-special-offer-vector-stock-illustration.jpg?s=612x612&w=0&k=20&c=qjnhlR53dQiKbkhPRQuUwGkXfd12J2ZkR9US3A8Ynbo=',
      prize: 'Giveaway prize 5',
    }, {
      id: 4,
      title: "Giveaway 6",
      description: "Small description, lorem ipsum dolor sit amet consectetur. Elementum facilisi diam amet turpis. Nisi pharetra aenean tristique at enim lacus",
      startTime: new Date(),
      endTime: new Date(2023,3,30),
      // participants?: string[]
      winners: [],
      numberOfWinners: 6,
      // requirements?: object;
      image: 'https://png.pngtree.com/png-clipart/20210801/original/pngtree-giveaway-png-in-comic-style-transparent-background-png-image_6580797.jpg',
      prize: 'Giveaway prize 6',
    }]
    )
}

const API = new BackendService();
export default API;
