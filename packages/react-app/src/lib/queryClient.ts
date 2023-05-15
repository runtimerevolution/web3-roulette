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

export const GetActiveGiveaways = () => useQuery('active', API.getActiveGiveaways);

export default queryClient;
