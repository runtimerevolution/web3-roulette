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

const useGiveaways = () => useQuery('active', API.getGiveaways);

const useGiveawayDetails = (id?: string) =>
  useQuery<Giveaway | undefined>(['details', id], () =>
    id ? API.getGiveaway(id) : undefined
  );

const useLocations = () => {
  return useQuery<Location[] | undefined>('locations', API.getLocations);
};

const useParticipants = (giveawayId: string) => {
  return useQuery(['participants', giveawayId], () =>
    API.getParticipants(giveawayId)
  );
};

export default queryClient;
export { useGiveaways, useGiveawayDetails, useLocations, useParticipants };
