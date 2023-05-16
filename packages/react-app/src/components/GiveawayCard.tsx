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

const GiveawayCard = (props: Giveaway) => {
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const action = userInfo.role === UserRole.ADMIN ? 'Manage' : 'Participate';

  const navigateDetails = () => {
    navigate(`/giveaways/${props._id}`);
  };

  return (
    <Card sx={{ borderRadius: '1.2rem' }}>
      <CardMedia
        className="clickable"
        component="img"
        height="120"
        image={
          props.image ? props.image : '/static/images/placeholder-image.jpg'
        }
        onClick={navigateDetails}
      />
      <CardContent>
        <Typography
          className="clickable"
          gutterBottom
          variant="h5"
          onClick={navigateDetails}
        >
          {props.title}
        </Typography>
        <Typography gutterBottom>{props.description}</Typography>
        <Typography gutterBottom>
          <>🏆 {props.prize}</>
        </Typography>
        <Typography gutterBottom>
          <>🗓️ {format(props.endTime, 'MMMM d, yyyy')}</>
        </Typography>
        <Box
          sx={{
            mt: '1.5rem',
            borderRadius: '0.6rem',
            borderColor: '#6D6DF0',
            borderWidth: '3px',
            borderStyle: 'solid',
          }}
        >
          <Button
            onClick={() => navigate(`/edit/${props._id}`)}
            sx={{
              textTransform: 'capitalize',
              color: '#6D6DF0',
              fontWeight: 600,
              width: '100%',
            }}
          >
            {action}
          </Button>
        </Box>
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
