import axios, { AxiosInstance } from 'axios';

import { UserInfo } from '../lib/types';
import Constants from '../utils/Constants';

const APIClient: AxiosInstance = axios.create({
  baseURL: Constants.API_URI,
});

const login = async (tokenType: string, accessToken: string) => {
  const res = await APIClient.post('/login', { tokenType, accessToken });
  if (res.status === 201) {
    return res.data.token;
  }
};

const getUserInfo = async () => {
  const tokens = readTokens();
  if (!tokens) return;

  const res = await APIClient.get('/me', {
    headers: {
      Authorization: `Bearer ${tokens.apiToken}`,
      Accept: 'application/json',
    },
  });

  if (res.status === 200) {
    return res.data as UserInfo;
  }

  console.log(`error fetching user info: ${res.status} ${res.data}`);
};

const saveTokens = (
  tokenType: string,
  accessToken: string,
  apiToken: string
) => {
  localStorage.setItem('tokenType', tokenType);
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('apiToken', apiToken);
};

const readTokens = () => {
  const tokenType = localStorage.getItem('tokenType');
  const accessToken = localStorage.getItem('accessToken');
  const apiToken = localStorage.getItem('apiToken');

  if (!tokenType || !accessToken || !apiToken) return;

  return {
    tokenType,
    accessToken,
    apiToken,
  };
};

const cleanupTokens = () => {
  localStorage.removeItem('tokenType');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('apiToken');
};

const AuthClient = {
  login,
  getUserInfo,
  saveTokens,
  readTokens,
  cleanupTokens,
};
export default AuthClient;
