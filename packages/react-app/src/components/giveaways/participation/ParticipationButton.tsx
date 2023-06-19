import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import { Giveaway, ParticipationState, UserInfo } from '../../../lib/types';
import { UserContext } from '../../../routes/AuthRoute';
import FrontendApiClient from '../../../services/backend';
import ParticipationService from '../../../services/giveawayparticipation';
import {
  ApprovalPendingButton,
  CheckingButton,
  ManageButton,
  NotAllowedButton,
  ParticipateButton,
  ParticipatingButton,
  GenerateWinnersButton,
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

  const userInfo = useContext(UserContext) as UserInfo;
  const [error, setError] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const notifyRejection = useCallback(async () => {
    await FrontendApiClient.setNotifiedParticipant(
      giveaway._id,
      userInfo.email
    );
    setShowRejectedModal(true);
  }, [giveaway, userInfo]);

  const notifyWinner = useCallback(async () => {
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
      case ParticipationState.PENDING_WINNERS:
        return (
          <GenerateWinnersButton
            giveaway={giveaway}
            successCallback={() => {
              onStateChange?.(ParticipationState.MANAGE);
            }}
            errorCallback={() => {
              setError(true);
            }}
          />
        );
    }
  }, [participationState, giveaway, userInfo, updateParticipationState]);

  useEffect(() => {
    updateParticipationState();
  }, [updateParticipationState]);

  return (
    <div>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => {
          setError(false);
        }}
      >
        <MuiAlert
          severity="error"
          onClose={() => {
            setError(false);
          }}
        >
          Oops, something went wrong! Please try again later.
        </MuiAlert>
      </Snackbar>
      {showPendingModal && (
        <PendingLocationModal
          open={true}
          onClose={() => setShowPendingModal(false)}
        />
      )}
      {showRejectedModal && (
        <RejectionModal
          giveaway={giveaway}
          open={true}
          onClose={() => setShowRejectedModal(false)}
        />
      )}
      {showWinnerModal && (
        <WinnerModal
          giveaway={giveaway}
          open={showWinnerModal}
          onClose={() => setShowWinnerModal(false)}
        />
      )}
      {ActionButton}
    </div>
  );
};

export default ParticipationButton;
