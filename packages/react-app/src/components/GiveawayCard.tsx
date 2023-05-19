import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
} from '@mui/material';

import useUserInfo from '../hooks/useUserInfo';
import { Giveaway, ParticipationState, UserRole } from '../lib/types';
import ParticipationService from '../services/giveawayparticipation';
import {
  ApprovalPendingButton,
  CheckingButton,
  ManageButton,
  NotAllowedButton,
  ParticipateButton,
  ParticipatingButton,
} from './GiveawayActionButtons';

const ActionButtonComponents: { [K in ParticipationState]: React.FC<any> } = {
  manage: ManageButton,
  participating: ParticipatingButton,
  pending: ApprovalPendingButton,
  allowed: ParticipateButton,
  not_allowed: NotAllowedButton,
  checking: CheckingButton,
};

type GiveawayCardProps = {
  giveaway: Giveaway;
  onParticipationError: () => void;
};

const GiveawayCard = ({
  giveaway,
  onParticipationError,
}: GiveawayCardProps) => {
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const isAdmin = userInfo?.role === UserRole.ADMIN;

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
          if (!userInfo) return;
          giveaway.participants?.push(userInfo?.email);
          setParticipationState(ParticipationState.PARTICIPATING);
        },
        errorCallback: () => {
          setParticipationState(ParticipationState.ALLOWED);
          giveaway.participants = giveaway.participants?.filter(
            (g) => g !== userInfo?.email
          );
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
  }, [participationState, giveaway, onParticipationError, userInfo]);

  useEffect(() => {
    if (!isAdmin) {
      ParticipationService.getParticipationState(giveaway, userInfo).then(
        (state) => setParticipationState(state)
      );
    } else {
      setParticipationState(ParticipationState.MANAGE);
    }
  }, [giveaway, userInfo, isAdmin]);

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
      <CardMedia
        className="clickable"
        component="img"
        height="120"
        image={
          giveaway.image
            ? giveaway.image
            : '/static/images/placeholder-image.jpg'
        }
        onClick={navigateDetails}
      />
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
