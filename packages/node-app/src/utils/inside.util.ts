import { getDistance } from 'geolib';

import { ParticipantState, Unit } from '../models/giveaway.model';

// TODO: connect to inside database and get participant data
export const getParticipant = (data) => {
  return {
    id: data.id,
    name: data.name,
    location: data.location,
    unit: Unit.NODE,
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
  if ((requiredUnit && requiredUnit === participantUnit) || !requiredUnit)
    return ParticipantState.CONFIRMED;
  return ParticipantState.REJECTED;
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
