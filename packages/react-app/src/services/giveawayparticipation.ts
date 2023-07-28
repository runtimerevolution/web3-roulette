import {
  Giveaway,
  Participant,
  ParticipationState,
  User,
  UserRole,
} from '../lib/types';
import FrontendApiClient from './backend';
import GeolocationService from './geolocation';

const submitParticipation = (
  giveaway: Giveaway,
  user: User,
  successCallback?: () => void,
  errorCallback?: () => void
) => {
  FrontendApiClient.postParticipant(
    giveaway,
    user.email,
    user.name,
    successCallback,
    errorCallback
  ).catch((err) => console.log(`problems submitting participation`));
};

const wonGiveaway = (giveaway: Giveaway, user: User) => {
  return giveaway.winners.some((winner) => winner.id === user.email);
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
  user?: User
): Promise<ParticipationState> => {
  if (!user) return ParticipationState.NOT_ALLOWED;

  if (user.role === UserRole.ADMIN && hasPendingWinners(giveaway))
    return ParticipationState.PENDING_WINNERS;

  if (new Date() > giveaway.endTime) return ParticipationState.NOT_ALLOWED;
  if (user.role === UserRole.ADMIN) return ParticipationState.MANAGE;

  if (!participants)
    participants = await FrontendApiClient.getParticipants(giveaway._id);

  let registeredUser;

  if (user.role === UserRole.ADMIN) {
    registeredUser = participants.find((p) => p.id === user.email);
  } else {
    registeredUser = participants.pop();
  }

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

  const ableTo = await meetRequirements(giveaway, user);
  return ableTo ? ParticipationState.ALLOWED : ParticipationState.NOT_ALLOWED;
};

const meetRequirements = async (
  giveaway: Giveaway,
  user: User
): Promise<boolean> => {
  if (!giveaway.requirements) return true;

  const unit = giveaway.requirements.unit;
  const locationId = giveaway.requirements.location;

  if (unit && !user.units.includes(unit)) {
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
  user: User
): Promise<boolean> => {
  if (giveaway.winners.some((w) => w.id === user.email)) {
    const participants = await FrontendApiClient.getParticipants(giveaway._id);
    let userObj;

    if (user.role === UserRole.ADMIN) {
      userObj = participants.find((p) => p.id === user.email);
    } else {
      userObj = participants.pop();
    }

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
