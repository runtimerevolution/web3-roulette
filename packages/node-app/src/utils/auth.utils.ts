import { Unit, User } from '../models/user.model';
import TAClient from './ta.utils';

export const getTAInfo = async (userEmail) => {
  try {
    let taUser;
    const user = await User.findOne({ email: userEmail });
    const taSession = await TAClient.signIn();

    if (user && user.taId)
      taUser = await TAClient.getPersonById(taSession, false, user.taId);
    else {
      const taPeople = await TAClient.getPeople(taSession, false);
      taUser = taPeople.find((person) => person.email === userEmail);
    }

    if (!taUser) throw Error('User is not active');

    const units = taUser.skills.reduce((units, skill) => {
      if (skill.startsWith('unit-')) {
        const unit = skill.replace('unit-', '') as Unit;
        if (Object.values(Unit).includes(unit)) units.push(unit);
      }
      return units;
    }, []);

    return { units, taId: taUser.id };
  } catch (error) {
    console.log("Could not get user units:", error.message);
  }
};
