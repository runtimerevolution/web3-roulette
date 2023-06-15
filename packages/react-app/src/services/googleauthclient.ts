import axios, { AxiosInstance } from 'axios';

import { Unit, UserInfo, UserRole } from '../lib/types';
import Constants from '../utils/Constants';

const googleAuthInstance: AxiosInstance = axios.create({
  baseURL: Constants.GOOGLE_OAUTH_URI,
});

const getUserInfo = async () => {
  const tokens = readTokens();
  if (!tokens) return;

  const res = await googleAuthInstance.get('/userinfo', {
    headers: {
      Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
      Accept: 'application/json',
    },
  });

  if (res.status === 200) {
    const user = res.data as UserInfo;

    // todo: information from own api
    user.unit = Unit.NODE;
    user.role = UserRole.ADMIN;

    return user;
  }

  console.log(`error fetching user info: ${res.status} ${res.data}`);
};

const saveTokens = (tokenType: string, accessToken: string) => {
  localStorage.setItem('tokenType', tokenType);
  localStorage.setItem('accessToken', accessToken);
};

const readTokens = () => {
  const tokenType = localStorage.getItem('tokenType');
  const accessToken = localStorage.getItem('accessToken');

  if (!tokenType || !accessToken) return;

  return {
    tokenType,
    accessToken,
  };
};

const cleanupTokens = () => {
  localStorage.removeItem('tokenType');
  localStorage.removeItem('accessToken');
};

const AuthClient = { getUserInfo, saveTokens, readTokens, cleanupTokens };
export default AuthClient;
