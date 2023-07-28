import {
  Giveaway,
  Participant,
  ParticipationState,
  UserInfo,
  UserRole,
} from '../lib/types';
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
  ).catch((err) => console.log(`problems submitting participation`));
};

const wonGiveaway = (giveaway: Giveaway, userInfo: UserInfo) => {
  return giveaway.winners.some((winner) => winner.id === userInfo.email);
};

const hasPendingWinners = (giveaway: Giveaway) => {
  if (
    giveaway.manual &&
    new Date() > giveaway.endTime &&
    giveaway.winners.length === 0
  ) {
    return true;
  }
  return false;
};

const getParticipationState = async (
  giveaway: Giveaway,
  participants?: Participant[],
  userInfo?: UserInfo
): Promise<ParticipationState> => {
  if (!userInfo) return ParticipationState.NOT_ALLOWED;

  if (userInfo.role === UserRole.ADMIN && hasPendingWinners(giveaway))
    return ParticipationState.PENDING_WINNERS;

  if (new Date() > giveaway.endTime) return ParticipationState.NOT_ALLOWED;
  if (userInfo.role === UserRole.ADMIN) return ParticipationState.MANAGE;

  if (!participants)
    participants = await FrontendApiClient.getParticipants(giveaway._id);
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
  if (!ableTo) {
    return ParticipationState.NOT_ALLOWED;
  }
  return giveaway.requirements.location
    ? ParticipationState.ALLOWED
    : ParticipationState.NOT_ALLOWED;
};

const meetRequirements = async (
  giveaway: Giveaway,
  userInfo: UserInfo
): Promise<boolean> => {
  if (!giveaway.requirements) return true;

  const unit = giveaway.requirements.unit;
  const locationId = giveaway.requirements.location;

  if (unit && !userInfo.units.includes(unit)) {
    return false;
  }

  if (locationId) {
    const accepted = await GeolocationService.getLocationPermission();
    if (!accepted) return true;

    const location = await FrontendApiClient.getLocation(locationId);
    const userLocation = await GeolocationService.getLocation();


    if (!userLocation) return true;

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

const nextGiveaway = async (giveaways: Giveaway[]) => {
  const activeGiveaways = giveaways.filter(
    (g) => g.startTime < new Date() && new Date() < g.endTime
  );
  if (activeGiveaways.length === 0) return;

  return activeGiveaways.reduce((prev, curr) =>
    prev.endTime < curr.endTime ? prev : curr
  );
};

const shouldNotifyWinner = async (
  giveaway: Giveaway,
  userInfo: UserInfo
): Promise<boolean> => {
  if (giveaway.winners.some((w) => w.id === userInfo.email)) {
    const participants = await FrontendApiClient.getParticipants(giveaway._id);
    const userObj = participants.find((p) => p.id === userInfo.email);

    if (userObj && !userObj.notified) {
      return true;
    }
  }

  return false;
};

const ParticipationService = {
  getParticipationState,
  meetRequirements,
  submitParticipation,
  nextGiveaway,
  shouldNotifyWinner,
  wonGiveaway,
  hasPendingWinners,
};
export default ParticipationService;
