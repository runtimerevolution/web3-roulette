import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Skeleton,
} from '@mui/material';
import { Giveaway } from '../lib/types';

const GiveawayCard = (props: Giveaway) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ borderRadius: '1.2rem' }}>
      <CardMedia
        component="img"
        height="120"
        image={
          props.image ? props.image : '/static/images/placeholder-image.jpg'
        }
      />
      <CardContent>
        <Typography gutterBottom variant="h5">
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
            onClick={() => navigate(`/edit/${props.id}`)}
            sx={{
              textTransform: 'capitalize',
              color: '#6D6DF0',
              fontWeight: 600,
              width: '100%',
            }}
          >
            Manage
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
