import DuckdartClient from '../services/backend';
import { Giveaway } from '../lib/types';

const loader = async ({ params }: any) => {
  const giveaway = (await DuckdartClient.getActiveGiveaways()).find(
    (giveaway: Giveaway) => giveaway.id === params.giveawayId
  );
  if (!giveaway) {
    throw new Response('', { status: 404, statusText: 'Giveaway not found.' });
  }
  return { giveaway };
};

const GiveawayDetailsPage = () => {
  return <div>Details of the giveaway</div>;
};

export default GiveawayDetailsPage;
export { loader };
