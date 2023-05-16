import { QueryClient, useQuery } from 'react-query';

import API from '../services/backend';
import { Giveaway } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

const GetGiveaways = () => useQuery('active', API.getGiveaways);
export const GetActiveGiveaways = () => useQuery<Giveaway[]>('active', API.getActiveGiveaways);
export const GetGiveawayDetails = (id?: string) => useQuery<Giveaway | undefined>(['details', id], () => API.getGiveawayDetails(id));
export const UpdateGiveaway = (data: FormData) => API.updateGiveaway(data);

export default queryClient;
export { GetGiveaways };
