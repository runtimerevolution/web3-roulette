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

const GetGiveaways = () => {
  return useQuery('active', API.getGiveaways, { refetchOnMount: 'always' });
};

const GetGiveawayDetails = (id?: string) => {
  return useQuery<Giveaway | undefined>(
    ['details', id],
    () => (id ? API.getGiveaway(id) : undefined),
    { refetchOnMount: 'always' }
  );
};

const GetLocations = () => {
  return useQuery<Location[] | undefined>('locations', API.getLocations, {
    refetchOnMount: 'always',
  });
};

const GetParticipants = (giveawayId: string) => {
  return useQuery(
    ['participants', giveawayId],
    () => API.getParticipants(giveawayId),
    { refetchOnMount: 'always' }
  );
};

export default queryClient;
export { GetGiveaways, GetGiveawayDetails, GetLocations, GetParticipants };
