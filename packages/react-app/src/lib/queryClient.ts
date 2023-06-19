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

const useGiveaways = () =>
  useQuery('active', API.getGiveaways, { refetchOnMount: 'always' });

const useGiveawayDetails = (id?: string) =>
  useQuery<Giveaway | undefined>(
    ['details', id],
    () => (id ? API.getGiveaway(id) : undefined),
    { refetchOnMount: 'always' }
  );

const useLocations = () => {
  return useQuery<Location[] | undefined>('locations', API.getLocations, {
    refetchOnMount: 'always',
  });
};

const useParticipants = (giveawayId: string) => {
  return useQuery(
    ['participants', giveawayId],
    () => API.getParticipants(giveawayId),
    { refetchOnMount: 'always' }
  );
};

export default queryClient;
export { useGiveaways, useGiveawayDetails, useLocations, useParticipants };
