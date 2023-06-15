import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import useUserInfo from '../../hooks/useUserInfo';
import { Giveaway, ParticipationState } from '../../lib/types';
import FrontendApiClient from '../../services/backend';
import ParticipationService from '../../services/giveawayparticipation';
import {
  ApprovalPendingButton,
  CheckingButton,
  ManageButton,
  NotAllowedButton,
  ParticipateButton,
  ParticipatingButton,
} from './ActionButtons';
import {
  PendingLocationModal,
  RejectionModal,
  WinnerModal,
} from './StatusModals';

type ParticipationButtonProps = {
  giveaway: Giveaway;
  onStateChange?: (newState: ParticipationState) => void;
};

const ParticipationButton = ({
  giveaway,
  onStateChange,
}: ParticipationButtonProps) => {
  const [participationState, setParticipationState] =
    useState<ParticipationState>(ParticipationState.CHECKING);

  const userInfo = useUserInfo();
  const [error, setError] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const notifyRejection = useCallback(async () => {
    if (!userInfo) return;
    await FrontendApiClient.setNotifiedParticipant(
      giveaway._id,
      userInfo.email
    );
    setShowRejectedModal(true);
  }, [giveaway, userInfo]);

  const notifyWinner = useCallback(async () => {
    if (!userInfo) return;
    await FrontendApiClient.setNotifiedParticipant(
      giveaway._id,
      userInfo.email
    );
    setShowWinnerModal(true);
  }, [giveaway, userInfo]);

  const updateParticipationState = useCallback(
    (fromEvent = false) => {
      ParticipationService.getParticipationState(
        giveaway,
        undefined,
        userInfo
      ).then((state) => {
        setParticipationState(state);
        onStateChange?.(state);

        if (fromEvent) {
          if (state === ParticipationState.PENDING) {
            setShowPendingModal(true);
          }
        }

        if (state === ParticipationState.REJECTED) {
          notifyRejection();
        }

        ParticipationService.shouldNotifyWinner(giveaway, userInfo).then(
          (notify) => {
            if (notify) {
              notifyWinner();
            }
          }
        );
      });
    },
    [giveaway, userInfo, notifyRejection, notifyWinner, onStateChange]
  );

  const ActionButton: React.ReactNode = useMemo(() => {
    if (!userInfo) return;
    switch (participationState) {
      case ParticipationState.MANAGE:
        return <ManageButton giveaway={giveaway} />;
      case ParticipationState.PARTICIPATING:
        return <ParticipatingButton />;
      case ParticipationState.PENDING:
        return <ApprovalPendingButton />;
      case ParticipationState.ALLOWED:
        return (
          <ParticipateButton
            giveaway={giveaway}
            userInfo={userInfo}
            successCallback={() => {
              updateParticipationState(true);
            }}
            errorCallback={() => {
              setError(true);
              updateParticipationState(true);
            }}
          />
        );
      case ParticipationState.NOT_ALLOWED:
        return <NotAllowedButton />;
      case ParticipationState.CHECKING:
        return <CheckingButton />;
      case ParticipationState.REJECTED:
        return <NotAllowedButton />;
    }
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
      <PendingLocationModal
        open={showPendingModal}
        onClose={() => setShowPendingModal(false)}
      />
      <RejectionModal
        giveaway={giveaway}
        open={showRejectedModal}
        onClose={() => setShowRejectedModal(false)}
      />
      <WinnerModal
        giveaway={giveaway}
        open={showWinnerModal}
        onClose={() => setShowWinnerModal(false)}
      />
      {ActionButton}
    </div>
  );
};

export default ParticipationButton;
