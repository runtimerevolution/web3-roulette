import { getDistance } from 'geolib';

import { ParticipantState } from '../models/giveaway.model';
import { User } from '../models/user.model';

export const getParticipant = async (data) => {
  const email = data.id;
  if (!email) {
    throw Error('Invalid participant data: missing id');
  }

  let unit = [];
  const user = await User.findOne({ email: email });
  if (user) {
    unit = user.unit;
  }

  return {
    id: data.id,
    name: data.name,
    location: data.location,
    unit: unit,
  };
};

const isValidLocation = (currentLocation, requiredLocation) => {
  const distance = getDistance(
    {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    },
    {
      latitude: requiredLocation.latitude,
      longitude: requiredLocation.longitude,
    }
  );
  return distance < requiredLocation.radius;
};

const validateLocation = (participant, giveaway) => {
  const participantLocation = participant.location;
  const location = giveaway.requirements.location;

  if (location) {
    // location is required but no location was provided
    if (!participantLocation) {
      return ParticipantState.PENDING; // participant pending acceptance
    }
    // location is required and was provided
    else {
      return isValidLocation(participantLocation, location)
        ? ParticipantState.CONFIRMED
        : ParticipantState.REJECTED;
    }
  }
  // location not required
  else {
    return ParticipantState.CONFIRMED;
  }
};

const validateUnit = (participant, giveaway) => {
  const participantUnit = participant.unit;
  const requiredUnit = giveaway.requirements.unit;

  // unit required and valid or unit not required
  if (requiredUnit) {
    const found = participantUnit.some((unit) => unit === requiredUnit);
    return found ? ParticipantState.CONFIRMED : ParticipantState.REJECTED;
  }

  return ParticipantState.CONFIRMED;
};

export const validateParticipant = (participant, giveaway) => {
  const locationState = validateLocation(participant, giveaway);
  const unitState = validateUnit(participant, giveaway);

  if ([locationState, unitState].includes(ParticipantState.REJECTED))
    return ParticipantState.REJECTED;
  else if (locationState === ParticipantState.PENDING)
    return ParticipantState.PENDING;
  return ParticipantState.CONFIRMED;
};