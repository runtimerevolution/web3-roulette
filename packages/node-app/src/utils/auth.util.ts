import axios from 'axios';

import { Unit } from '../models/user.model';
import TAClient from './ta.util';

const googleAuthInstance = axios.create({
  baseURL: process.env.GOOGLE_OAUTH_URI,
});

const getUserInfo = async (tokenType, accessToken) => {
  try {
    const res = await googleAuthInstance.get('/userinfo', {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (res.status === 200) {
      const userInfo = res.data;
      const taSession = await TAClient.signIn();
      const runtimePeople = await TAClient.getPeople(taSession, false);

      const taUser = runtimePeople.find(
        (user) => user.email === userInfo.email
      );
      if (!taUser) {
        throw Error('user is not active');
      }

      const unit = getUnit(taUser);
      if (unit) {
        userInfo.unit = unit;
      }

      return userInfo;
    }
  } catch (err) {
    const message = err.message ? err.message : '';
    console.log(`could not get user information ${message}`);
  }
};

const getUnit = (user) => {
  const skills = user.skills;
  const unitSkill = skills.find((skill) => skill.startsWith('unit-'));

  if (unitSkill) {
    const unit = unitSkill.replace('unit-', '');
    if (Object.values(Unit).includes(unit)) {
      return unit;
    }
  }
};

export { getUserInfo, getUnit };
