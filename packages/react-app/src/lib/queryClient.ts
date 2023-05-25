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

export const GetGiveawayDetails = (id?: string) => useQuery<Giveaway | undefined>(['details', id], () => API.getGiveaway(id));
export const SaveGiveaway = (data: FormData) => API.saveGiveaway(data);

const GetGiveaways = () => useQuery('active', API.getGiveaways);

export default queryClient;
export { GetGiveaways };
