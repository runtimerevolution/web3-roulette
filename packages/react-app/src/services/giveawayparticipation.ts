import { Giveaway, ParticipationState, UserInfo } from '../lib/types';
import GeolocationService from '../services/geolocation';

const getParticipationState = async (
  giveaway: Giveaway,
  userInfo?: UserInfo
): Promise<ParticipationState> => {
  if (!userInfo) return ParticipationState.NOT_ALLOWED;
  if (giveaway.participants?.includes(userInfo.email)) {
    return ParticipationState.PARTICIPATING;
  }
  const ableTo = await meetRequirements(giveaway, userInfo);
  return ableTo ? ParticipationState.ALLOWED : ParticipationState.NOT_ALLOWED;
};

const isParticipant = (giveaway: Giveaway, userInfo?: UserInfo): boolean => {
  if (!userInfo) return false;
  if (giveaway.participants) {
    return (
      giveaway.participants.find((g) => g === userInfo.email) !== undefined
    );
  }
  return false;
};

const meetRequirements = async (
  giveaway: Giveaway,
  userInfo?: UserInfo
): Promise<boolean> => {
  if (!userInfo) return false;
  if (!giveaway.requirements) return true;

  const unit = giveaway.requirements.unit;
  const location = giveaway.requirements.location;

  if (unit && userInfo?.unit !== unit) {
    return false;
  }

  if (location) {
    const accepted = await GeolocationService.getLocationPermission();
    if (!accepted) return false;

    if (
      !(await GeolocationService.isWithinRadius(
        location.latitude,
        location.longitude,
        location.radius
      ))
    )
      return false;
  }

  return true;
};

const ParticipationService = {
  getParticipationState,
  isParticipant,
  meetRequirements,
};
export default ParticipationService;
