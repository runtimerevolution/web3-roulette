import { QueryClient, useQuery } from 'react-query';

import API from '../services/backend';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

const GetGiveaways = () => useQuery('active', API.getGiveaways);

export default queryClient;
export { GetGiveaways };
