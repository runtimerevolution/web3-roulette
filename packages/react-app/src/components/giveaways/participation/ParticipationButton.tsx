import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Giveaway, ParticipationState } from '../../../lib/types';
import FrontendApiClient from '../../../services/backend';
import ParticipationService from '../../../services/giveawayparticipation';
import {
  ApprovalPendingButton,
  CheckingButton,
  GenerateWinnersButton,
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
import { AuthenticationContext } from '../../login/AuthenticationProvider';

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
  const { user } = useContext(AuthenticationContext);
  const [error, setError] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const notifyRejection = useCallback(async () => {
    await FrontendApiClient.setNotifiedParticipant(giveaway._id, user.email);
    setShowRejectedModal(true);
  }, [giveaway, user]);

  const notifyWinner = useCallback(async () => {
    await FrontendApiClient.setNotifiedParticipant(giveaway._id, user.email);
    setShowWinnerModal(true);
  }, [giveaway, user]);

  const updateParticipationState = useCallback(
    (fromEvent = false) => {
      ParticipationService.getParticipationState(
        giveaway,
        undefined,
        user
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

        ParticipationService.shouldNotifyWinner(giveaway, user).then(
          (notify) => {
            if (notify) {
              notifyWinner();
            }
          }
        );
      });
    },
    [giveaway, user, notifyRejection, notifyWinner, onStateChange]
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
            userInfo={user}
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
  }, [participationState, giveaway, user, updateParticipationState]);

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
        <PendingLocationModal onClose={() => setShowPendingModal(false)} />
      )}
      {showRejectedModal && (
        <RejectionModal
          giveaway={giveaway}
          onClose={() => setShowRejectedModal(false)}
        />
      )}
      {showWinnerModal && (
        <WinnerModal
          giveaway={giveaway}
          onClose={() => setShowWinnerModal(false)}
        />
      )}
      {ActionButton}
    </div>
  );
};

export default ParticipationButton;
