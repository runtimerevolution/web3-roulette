import { UserInfo } from '../lib/types';
import GoogleAuthClient from '../services/googleauthclient';

const useUserInfo = (): UserInfo | undefined => {
  return GoogleAuthClient.getUser();
};

export default useUserInfo;
