import { format } from 'date-fns';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';

import Trophy from '../../assets/Trophy.png';
import useUserInfo from '../../hooks/useUserInfo';
import { GetParticipants } from '../../lib/queryClient';
import { Giveaway, ParticipationState, UserRole } from '../../lib/types';
import ParticipationService from '../../services/giveawayparticipation';
import {
  ApprovalPendingButton,
  CheckingButton,
  ManageButton,
  NotAllowedButton,
  ParticipateButton,
  ParticipatingButton,
} from './ActionButtons';
import { PendingLocationModal } from './StatusModals';

const ActionButtonComponents: { [K in ParticipationState]: React.FC<any> } = {
  manage: ManageButton,
  participating: ParticipatingButton,
  pending: ApprovalPendingButton,
  allowed: ParticipateButton,
  notAllowed: NotAllowedButton,
  checking: CheckingButton,
  rejected: NotAllowedButton,
};

type GiveawayCardProps = {
  giveaway: Giveaway;
  onParticipationError: () => void;
  onRejection?: () => Promise<void>;
};

const GiveawayCard = ({
  giveaway,
  onParticipationError,
  onRejection,
}: GiveawayCardProps) => {
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const { data: participants, refetch } = GetParticipants(giveaway._id);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const participationAction = useRef(false);
  const isAdmin = userInfo?.role === UserRole.ADMIN;
  const isWinner = ParticipationService.wonGiveaway(giveaway, userInfo);

  const [participationState, setParticipationState] =
    useState<ParticipationState>(
      isAdmin ? ParticipationState.MANAGE : ParticipationState.CHECKING
    );

  const ActionButton: React.ReactNode = useMemo(() => {
    let props = {};

    if (participationState === ParticipationState.ALLOWED) {
      props = {
        giveaway: giveaway,
        userInfo: userInfo,
        successCallback: () => {
          refetch();
          participationAction.current = true;
        },
        errorCallback: () => {
          refetch();
          onParticipationError();
        },
      };
    } else if (participationState === ParticipationState.MANAGE) {
      props = { giveaway: giveaway };
    }

    return React.createElement(
      ActionButtonComponents[participationState],
      props
    );
  }, [participationState, giveaway, onParticipationError, userInfo, refetch]);

  const getWinnerStr = () => {
    const winners = giveaway.winners;
    if (winners.length === 0) return;

    const winnerId = winners[0].id;
    const winnerParticipant = participants?.find((p) => p.id === winnerId);

    if (winnerParticipant) {
      if (winners.length === 1) {
        return `${winnerParticipant.name}`;
      } else {
        return `${winnerParticipant.name} +${winners.length - 1} more`;
      }
    }
  };

  useEffect(() => {
    if (!isAdmin && participants) {
      ParticipationService.getParticipationState(
        giveaway,
        participants,
        userInfo
      ).then((state) => {
        if (state === ParticipationState.REJECTED) {
          onRejection?.().then(() => {
            refetch();
          });
        } else if (
          participationAction.current &&
          state === ParticipationState.PENDING
        ) {
          participationAction.current = false;
          setShowPendingModal(true);
        }
        setParticipationState(state);
      });
    } else {
      setParticipationState(ParticipationState.MANAGE);
    }
  }, [giveaway, onRejection, userInfo, isAdmin, participants, refetch]);

  const navigateDetails = () => {
    navigate(`/giveaways/${giveaway._id}`);
  };

  return (
    <Card
      sx={{
        borderRadius: '1.2rem',
        boxShadow: 0,
        backgroundColor:
          participationState === ParticipationState.NOT_ALLOWED
            ? '#D9D9D9'
            : 'white',
      }}
    >
      <div>
        <PendingLocationModal
          open={showPendingModal}
          onClose={() => setShowPendingModal(false)}
        />
      </div>
      <div className="card-media clickable" onClick={navigateDetails}>
        <img className="img" src={giveaway.image} alt="Giveaway thumb" />
        {isWinner && (
          <div className="winner">
            <div style={{ textAlign: 'center' }}>
              <img className="icon" src={Trophy} alt="Trophy" />
              <Typography className="message">You won this contest!</Typography>
            </div>
          </div>
        )}
      </div>
      <CardContent className="giveaway-card">
        <Typography
          className="giveaway-title text-overflow clickable"
          gutterBottom
          variant="h5"
          onClick={navigateDetails}
        >
          {giveaway.title}
        </Typography>
        <Typography className="description text-overflow" gutterBottom>
          {giveaway.description}
        </Typography>
        <Typography className="prize text-overflow" gutterBottom>
          <span role="img" aria-label="trophy">
            🏆
          </span>{' '}
          {giveaway.prize}
        </Typography>
        <Typography className="date" gutterBottom>
          <span role="img" aria-label="calendar">
            🗓️
          </span>{' '}
          {format(giveaway.endTime, 'MMMM d, yyyy')}
        </Typography>
        {giveaway.winners.length > 0 && (
          <Typography className="winners" gutterBottom>
            <span role="img" aria-label="party emoji">
              🥳
            </span>{' '}
            {getWinnerStr()}
          </Typography>
        )}
        {giveaway.endTime < new Date() && (
          <Typography className="participants" gutterBottom>
            <span role="img" aria-label="people">
              👥
            </span>{' '}
            {`${
              participants?.filter((p) => p.state === 'confirmed').length
            } participants`}
          </Typography>
        )}
        {giveaway.endTime > new Date() && ActionButton}
      </CardContent>
    </Card>
  );
};

export const GiveawayCardSkeleton = () => (
  <Box>
    <Skeleton
      variant="rectangular"
      height={120}
      sx={{ borderTopLeftRadius: '1.2rem', borderTopRightRadius: '1.2rem' }}
    />
    <Skeleton />
    <Skeleton />
    <Skeleton width={'60%'} />
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Skeleton variant="circular" width={20} height={20} />
      <Skeleton width={'80%'} />
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Skeleton variant="circular" width={20} height={20} />
      <Skeleton width={'40%'} />
    </Box>
  </Box>
);

export default GiveawayCard;
