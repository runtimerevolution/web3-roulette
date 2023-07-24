import axios from 'axios';

import { Unit, User } from '../models/user.model';
import TAClient from './ta.utils';

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
      const dbUserRecord = await User.findOne({ email: userInfo.email });
      let taUser;

      if (dbUserRecord?.taId) {
        taUser = await TAClient.getPersonById(taSession, false, dbUserRecord.taId);;
      } else {
        const runtimePeople = await TAClient.getPeople(taSession, false);
  
        taUser = runtimePeople.find(
          (user) => user.email === userInfo.email
        );
      }

      if (!taUser) {
        throw Error('user is not active');
      }

      const unit = getUnits(taUser);
      if (unit) {
        userInfo.units = unit;
      }

      userInfo.taId = taUser.id;

      return userInfo;
    }
  } catch (err) {
    const message = err.message ? err.message : '';
    console.log(`could not get user information ${message}`);
  }
};

const getUnits = (user) => {
  return user.skills.reduce((units, skill) => {
    if (skill.startsWith('unit-')) {
      const unit = skill.replace('unit-', '');
      if (Object.values(Unit).includes(unit)) {
        return [unit as Unit, ...units];
      }
    }
    return units;
  }, []);
};

export { getUnits, getUserInfo };
