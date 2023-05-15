import GoogleAuthClient from '../services/googleauthclient';

const useUserInfo = () => {
  return GoogleAuthClient.getUser();
};

export default useUserInfo;
