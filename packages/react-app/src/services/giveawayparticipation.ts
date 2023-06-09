import { Giveaway, ParticipationState, UserInfo } from '../lib/types';
import FrontendApiClient from './backend';
import GeolocationService from './geolocation';

const submitParticipation = (
  giveaway: Giveaway,
  userInfo: UserInfo,
  successCallback?: () => void,
  errorCallback?: () => void
) => {
  FrontendApiClient.postParticipant(
    giveaway,
    userInfo.email,
    userInfo.name,
    successCallback,
    errorCallback
  );
};

const getParticipationState = async (
  giveaway: Giveaway,
  userInfo?: UserInfo
): Promise<ParticipationState> => {
  if (!userInfo) return ParticipationState.NOT_ALLOWED;

  const participants = await FrontendApiClient.getParticipants(giveaway._id);
  const registeredUser = participants.find((p) => p.id === userInfo.email);

  if (registeredUser) {
    switch (registeredUser.state) {
      case 'pending':
        return ParticipationState.PENDING;
      case 'confirmed':
        return ParticipationState.PARTICIPATING;
      case 'rejected':
        return registeredUser.notified
          ? ParticipationState.NOT_ALLOWED
          : ParticipationState.REJECTED;
    }
  }

  const ableTo = await meetRequirements(giveaway, userInfo);
  return ableTo ? ParticipationState.ALLOWED : ParticipationState.NOT_ALLOWED;
};

const meetRequirements = async (
  giveaway: Giveaway,
  userInfo?: UserInfo
): Promise<boolean> => {
  if (!userInfo) return false;
  if (!giveaway.requirements) return true;

  const unit = giveaway.requirements.unit;
  const locationId = giveaway.requirements.location;

  if (unit && userInfo?.unit !== unit) {
    return false;
  }

  if (locationId) {
    const accepted = await GeolocationService.getLocationPermission();
    if (!accepted) return true;

    const location = await FrontendApiClient.getLocation(locationId);
    if (
      !location ||
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

const getWinnerNotifications = async (
  giveaways: Giveaway[],
  userInfo: UserInfo
): Promise<Giveaway[]> => {
  const wonGiveaways = giveaways.filter((g) =>
    g.winners.find((w) => w.id === userInfo.email)
  );

  const giveawaysToNotify = [];
  for (const giveaway of wonGiveaways) {
    const participants = await FrontendApiClient.getParticipants(giveaway._id);
    const userObj = participants.find((p) => p.id === userInfo.email);

    if (userObj && !userObj.notified) {
      giveawaysToNotify.push(giveaway);
    }
  }

  return giveawaysToNotify;
};

const ParticipationService = {
  getParticipationState,
  meetRequirements,
  submitParticipation,
  getWinnerNotifications,
};
export default ParticipationService;
