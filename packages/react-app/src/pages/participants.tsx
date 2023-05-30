import { Navigate, useLoaderData } from 'react-router-dom';

import useUserInfo from '../hooks/useUserInfo';
import { Giveaway, UserRole } from '../lib/types';

const ParticipantsManagerPage = () => {
  const userInfo = useUserInfo();
  const giveaway = useLoaderData() as Giveaway;

  if (userInfo?.role !== UserRole.ADMIN) {
    return <Navigate to={`/giveaways/${giveaway._id}`} />;
  }

  return <div>Page to manage giveaway participants</div>;
};

export default ParticipantsManagerPage;
