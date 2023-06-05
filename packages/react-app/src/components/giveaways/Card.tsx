import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';

import Trophy from '../../assets/Trophy.png';
import useUserInfo from '../../hooks/useUserInfo';
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
import { GetParticipants } from '../../lib/queryClient';

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
  onRejection?: () => void;
};

const GiveawayCard = ({
  giveaway,
  onParticipationError,
  onRejection,
}: GiveawayCardProps) => {
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const isAdmin = userInfo?.role === UserRole.ADMIN;
  const [showPendingModal, setShowPendingModal] = useState(false);
  const isWinner = ParticipationService.wonGiveaway(giveaway, userInfo);
  const { data: participants } = GetParticipants(giveaway._id);

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
          if (!participants) return;
          ParticipationService.getParticipationState(
            giveaway,
            participants,
            userInfo
          ).then((state) => {
            setParticipationState(state);
            if (state === ParticipationState.PENDING) {
              setShowPendingModal(true);
            }
          });
        },
        errorCallback: () => {
          if (!participants) return;
          ParticipationService.getParticipationState(
            giveaway,
            participants,
            userInfo
          ).then((state) => setParticipationState(state));
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
  }, [
    participationState,
    giveaway,
    onParticipationError,
    userInfo,
    participants,
  ]);

  useEffect(() => {
    if (!isAdmin && participants) {
      ParticipationService.getParticipationState(
        giveaway,
        participants,
        userInfo
      ).then((state) => {
        if (state === ParticipationState.REJECTED) {
          onRejection?.();
        }
        setParticipationState(state);
      });
    } else {
      setParticipationState(ParticipationState.MANAGE);
    }
  }, [giveaway, onRejection, userInfo, isAdmin, participants]);

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
      <CardContent>
        <Typography
          className="clickable"
          gutterBottom
          variant="h5"
          onClick={navigateDetails}
          mt="13px"
        >
          {giveaway.title}
        </Typography>
        <Typography gutterBottom mt="6px">
          {giveaway.description}
        </Typography>
        <Typography gutterBottom mt="14px">
          <>🏆 {giveaway.prize}</>
        </Typography>
        <Typography gutterBottom mt="12px">
          <>🗓️ {format(giveaway.endTime, 'MMMM d, yyyy')}</>
        </Typography>
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
