import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
} from '@mui/material';

import useUserInfo from '../hooks/useUserInfo';
import {
  Giveaway,
  ParticipationState,
  ButtonConfig,
  UserRole,
} from '../lib/types';
import ParticipationService from '../services/giveawayparticipation';

const ButtonsConfig: { [K in ParticipationState]: ButtonConfig } = {
  manage: {
    text: 'Manage',
    color: 'white',
    textColor: '#6D6DF0',
    onClick: (giveaway) => {
      ParticipationService.manage(giveaway);
    },
  },
  participating: {
    text: 'Registered',
    color: '#12BB6A',
    textColor: 'white',
    startIcon: <CheckCircleOutlineOutlinedIcon />,
  },
  pending: {
    text: 'Approval pending',
    color: '#E8AC0A',
    textColor: 'white',
    startIcon: <InfoOutlinedIcon />,
  },
  allowed: {
    text: 'Participate',
    color: '#6D6DF0',
    textColor: 'white',
    onClick: (giveaway, userInfo, errorCallback) => {
      if (userInfo) {
        ParticipationService.submitParticipation(
          giveaway,
          userInfo,
          errorCallback
        );
      }
    },
  },
  not_allowed: {
    text: 'Not eligible',
    color: '#9E9E9E',
    textColor: '#2B2929',
  },
  checking: {
    text: '',
    color: 'white',
    textColor: 'white',
  },
};

const ButtonBaseStyle = {
  width: '100%',
  height: '35px',
  textTransform: 'none',
  marginTop: '17px',
  borderRadius: '10px',
  fontSize: '16px',
  fontWeight: '500',
  borderWidth: '2px',
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

  const actionConfig: ButtonConfig = useMemo(() => {
    return ButtonsConfig[participationState];
  }, [participationState]);

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

  const handleActionClick = () => {
    if (!userInfo) return;

    if (participationState === ParticipationState.ALLOWED) {
      const errorCallback = () => {
        setParticipationState(ParticipationState.ALLOWED);
        giveaway.participants = giveaway.participants?.filter(
          (g) => g !== userInfo?.email
        );
        onParticipationError();
      };

      giveaway.participants?.push(userInfo?.email);
      setParticipationState(ParticipationState.PARTICIPATING);
      actionConfig.onClick?.(giveaway, userInfo, errorCallback);
      return;
    }

    actionConfig.onClick?.(giveaway, userInfo);
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
        {giveaway.endTime > new Date() && (
          <Button
            className="card-action-btn"
            variant={isAdmin ? 'outlined' : 'contained'}
            startIcon={actionConfig.startIcon}
            sx={{
              ...ButtonBaseStyle,
              backgroundColor: actionConfig.color,
              color: actionConfig.textColor,

              '&.Mui-disabled': {
                background: actionConfig.color,
                color: actionConfig.textColor,
              },
            }}
            onClick={handleActionClick}
            disabled={actionConfig.onClick === undefined}
            disableElevation
          >
            {actionConfig.text}
          </Button>
        )}
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
