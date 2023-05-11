import axios, { AxiosInstance } from 'axios';
import Constants from '../utils/Constants';

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

const saveUser = (userObj: object) => {
  localStorage.setItem('user', JSON.stringify(userObj));
};

const getUser = () => {
  const userData: string | null = localStorage.getItem('user');
  if (userData) {
    return JSON.parse(userData);
  }
};

const GoogleAuthClient = { getUserInfo, saveUser, getUser };
export default GoogleAuthClient;
