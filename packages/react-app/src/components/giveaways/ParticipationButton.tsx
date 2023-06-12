import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import useUserInfo from '../../hooks/useUserInfo';
import { Giveaway, ParticipationState } from '../../lib/types';
import ParticipationService from '../../services/giveawayparticipation';
import { ActionButtonComponents } from './ActionButtons';

const ParticipationButton = (giveaway: Giveaway) => {
  const userInfo = useUserInfo();
  const [participationState, setParticipationState] =
    useState<ParticipationState>(ParticipationState.CHECKING);
  const [error, setError] = useState(false);

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
          setError(true);
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

  const closeError = () => {
    setError(false);
  };

  return (
    <div>
      <Snackbar open={error} autoHideDuration={6000} onClose={closeError}>
        <MuiAlert severity="error" onClose={closeError}>
          Oops, something went wrong! Please try again later.
        </MuiAlert>
      </Snackbar>
      {ActionButton}
    </div>
  );
};

export default ParticipationButton;
