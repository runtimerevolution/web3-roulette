import GoogleAuthClient from '../services/googleauth';

const useUserInfo = () => {
  return GoogleAuthClient.getUser();
};

export default useUserInfo;
