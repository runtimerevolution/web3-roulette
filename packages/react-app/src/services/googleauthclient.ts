import axios, { AxiosInstance } from 'axios';
import { UserInfo } from '../lib/types';
import Constants from '../utils/Constants';
import { AES, enc } from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const googleAuthInstance: AxiosInstance = axios.create({
  baseURL: Constants.GOOGLE_OAUTH_URI,
});

const getUserInfo = async (tokenType: string, accessToken: string) => {
  const res = await googleAuthInstance.get('/userinfo', {
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (res.status === 200) {
    return res.data;
  }

  console.log(`error fetching user info: ${res.status} ${res.data}`);
};

const saveUser = (userObj: UserInfo) => {
  const userStr = JSON.stringify(userObj);
  const encryptedUser = AES.encrypt(userStr, ENCRYPTION_KEY).toString();

  if (encryptedUser) {
    localStorage.setItem('user', encryptedUser);
  }
};

const getUser = (): UserInfo | undefined => {
  const userData: string | null = localStorage.getItem('user');
  if (!userData) return;

  try {
    const decryptedUser = AES.decrypt(userData, ENCRYPTION_KEY).toString(
      enc.Utf8
    );
    if (decryptedUser) {
      return JSON.parse(decryptedUser) as UserInfo;
    }
  } catch {
    console.log('problems getting the user');
    removeUser();
  }
};

const removeUser = () => {
  localStorage.removeItem('user');
};

const GoogleAuthClient = { getUserInfo, saveUser, getUser, removeUser };
export default GoogleAuthClient;
