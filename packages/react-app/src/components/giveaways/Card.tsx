import { format } from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';

import Trophy from '../../assets/Trophy.png';
import useUserInfo from '../../hooks/useUserInfo';
import { useParticipants } from '../../lib/queryClient';
import { Giveaway, ParticipationState } from '../../lib/types';
import ParticipationService from '../../services/giveawayparticipation';
import ParticipationButton from './ParticipationButton';

const GiveawayCard = (giveaway: Giveaway) => {
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const { data: participants } = useParticipants(giveaway._id);
  const isWinner = ParticipationService.wonGiveaway(giveaway, userInfo);
  const [isAllowed, setIsAllowed] = useState(true);

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

  const navigateDetails = () => {
    navigate(`/giveaways/${giveaway._id}`);
  };

  const onStateChange = (newState: ParticipationState) => {
    setIsAllowed(newState !== ParticipationState.NOT_ALLOWED);
  };

  return (
    <Card
      sx={{
        borderRadius: '1.2rem',
        boxShadow: 0,
        backgroundColor:
          !isAllowed && giveaway.endTime > new Date() ? '#D9D9D9' : 'white',
      }}
    >
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
        {giveaway.endTime > new Date() && (
          <ParticipationButton
            giveaway={giveaway}
            onStateChange={onStateChange}
          />
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
