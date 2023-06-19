import axios from 'axios';

import { Unit, UserRole } from '../models/user.model';

const googleAuthInstance = axios.create({
  baseURL: process.env.GOOGLE_OAUTH_URI,
});

export const getUserInfo = async (tokenType, accessToken) => {
  try {
    const res = await googleAuthInstance.get('/userinfo', {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (res.status === 200) {
      const userInfo = res.data;

      // todo: connect to inside
      userInfo.unit = Unit.NODE;

      // todo: manage admin accounts
      userInfo.role = UserRole.USER;

      return userInfo;
    }
  } catch {
    console.log('Invalid google auth tokens');
  }
};
