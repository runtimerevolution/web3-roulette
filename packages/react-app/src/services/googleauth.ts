import axios, { AxiosInstance } from 'axios';
import Constants from '../utils/Constants';

const googleAuthInstance: AxiosInstance = axios.create({
  baseURL: Constants.GOOGLE_OAUTH_URI,
});

const getUserInfo = (tokenType: string, accessToken: string) => {
  return googleAuthInstance
    .get('/userinfo', {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
        Accept: 'application/json',
      },
    })
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      }
      throw res;
    })
    .catch((error) => console.log(`error getting user info: ${error.message}`));
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
