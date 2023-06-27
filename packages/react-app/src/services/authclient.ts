import axios, { AxiosInstance } from 'axios';

import { UserInfo } from '../lib/types';
import Constants from '../utils/Constants';

const APIClient: AxiosInstance = axios.create({
  baseURL: Constants.API_URI,
});

const login = async (tokenType: string, accessToken: string) => {
  try {
    const res = await APIClient.post('/login', { tokenType, accessToken });
    if (res.status === 201) {
      return res.data.token;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    console.log(`problems with login ${message}`);
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

const saveTokens = (apiToken: string) => {
  localStorage.setItem('apiToken', apiToken);
};

const readTokens = () => {
  const apiToken = localStorage.getItem('apiToken');
  if (!apiToken) return;
  return { apiToken };
};

const cleanupTokens = () => {
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
