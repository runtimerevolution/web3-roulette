import { QueryClient, useQuery } from 'react-query';

import API from '../services/backend';
import { Giveaway, Location } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

const GetGiveaways = () => useQuery('active', API.getGiveaways);
const GetGiveawayDetails = (id?: string) =>
  useQuery<Giveaway | undefined>(['details', id], () =>
    id ? API.getGiveaway(id) : undefined
  );

const GetLocations = () =>
  useQuery<Location[] | undefined>('locations', API.getLocations);

export default queryClient;
export { GetGiveaways, GetGiveawayDetails, GetLocations };
