import React, { useCallback, useEffect, useMemo, useState } from 'react';

import useUserInfo from '../../hooks/useUserInfo';
import { Giveaway, ParticipationState } from '../../lib/types';
import ParticipationService from '../../services/giveawayparticipation';
import { ActionButtonComponents } from './ActionButtons';

const ParticipationButton = (giveaway: Giveaway) => {
  const userInfo = useUserInfo();
  const [participationState, setParticipationState] =
    useState<ParticipationState>(ParticipationState.CHECKING);

  const updateParticipationState = useCallback(() => {
    ParticipationService.getParticipationState(
      giveaway,
      undefined,
      userInfo
    ).then((state) => {
      setParticipationState(state);
    });
  }, [giveaway, userInfo]);

  const ActionButton: React.ReactNode = useMemo(() => {
    let props = {};

    if (participationState === ParticipationState.ALLOWED) {
      props = {
        giveaway: giveaway,
        userInfo: userInfo,
        successCallback: () => {
          updateParticipationState();
        },
        errorCallback: () => {
          updateParticipationState();
        },
      };
    } else if (participationState === ParticipationState.MANAGE) {
      props = { giveaway: giveaway };
    }

    return React.createElement(
      ActionButtonComponents[participationState],
      props
    );
  }, [participationState, giveaway, userInfo, updateParticipationState]);

  useEffect(() => {
    updateParticipationState();
  }, [updateParticipationState]);

  return ActionButton;
};

export default ParticipationButton;
