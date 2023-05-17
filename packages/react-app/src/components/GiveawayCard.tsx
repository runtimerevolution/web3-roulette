import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

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
import { Giveaway, UserRole } from '../lib/types';
import GeolocationService from '../services/geolocation';

const GiveawayCard = (giveaway: Giveaway) => {
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const isAdmin = userInfo.role === UserRole.ADMIN;
  const action = isAdmin ? 'Manage' : 'Participate';

  const navigateDetails = () => {
    navigate(`/giveaways/${giveaway._id}`);
  };

  const isParticipant = (): boolean => {
    if (giveaway.participants) {
      return (
        giveaway.participants.find((g) => g === userInfo.email) !== undefined
      );
    }
    return false;
  };

  const meetRequirements = async (): Promise<boolean> => {
    if (!giveaway.requirements) return true;

    const unit = giveaway.requirements.unit;
    const location = giveaway.requirements.location;

    if (unit && userInfo.unit !== unit) {
      return false;
    }

    if (location) {
      const accepted = await GeolocationService.getLocationPermission();
      if (!accepted) return false;

      if (
        !(await GeolocationService.isWithinRadius(
          location.latitude,
          location.longitude,
          location.radius
        ))
      )
        return false;
    }

    return true;
  };

  return (
    <Card sx={{ borderRadius: '1.2rem' }}>
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
        <Button
          className="card-action-btn"
          variant={isAdmin ? 'outlined' : 'contained'}
          sx={{
            textTransform: 'capitalize',
            marginTop: '17px',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '500',
            border: '2px solid #6d6df0',
          }}
          onClick={() => navigate(`/edit/${giveaway._id}`)}
          disableElevation
        >
          {action}
        </Button>
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
