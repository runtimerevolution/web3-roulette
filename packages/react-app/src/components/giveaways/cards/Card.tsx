import {
  useContext,
  useState,
} from 'react';

import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';

import Trophy from '../../../assets/Trophy.png';
import SadEmoji from '../../../assets/SadEmoji.png';
import { useParticipants } from '../../../lib/queryClient';
import {
  Giveaway,
  GiveawayStatus,
  ParticipationState,
  UserInfo,
  UserRole,
} from '../../../lib/types';
import { UserContext } from '../../../routes/AuthRoute';
import ParticipationService from '../../../services/giveawayparticipation';
import ParticipationButton from '../participation/ParticipationButton';
import PendingApprovalBanner from '../participation/PendingApprovalBanner';

type GiveawayCardProps = {
  giveaway: Giveaway;
  archived: boolean;
  onWinnersGeneration: () => void;
};

const GiveawayCard = ({
  giveaway,
  archived,
  onWinnersGeneration,
}: GiveawayCardProps) => {
  const navigate = useNavigate();
  const userInfo = useContext(UserContext) as UserInfo;
  const { data: participants } = useParticipants(giveaway._id);
  const [participation, setParticipation] = useState<ParticipationState>();
  const isWinner = ParticipationService.wonGiveaway(giveaway, userInfo);
  const nrConfirmedParticipants = giveaway.stats.nrConfirmedParticipants;
  const nrPendingParticipants = giveaway.stats.nrPendingParticipants;

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
    if (
      participation === ParticipationState.PENDING_WINNERS &&
      newState === ParticipationState.MANAGE
    ) {
      onWinnersGeneration();
    }
    setParticipation(newState);
  };

  return (
    <Card
      className="card-container"
      sx={{
        backgroundColor:
          participation === ParticipationState.NOT_ALLOWED &&
          giveaway.endTime > new Date()
            ? '#D9D9D9'
            : 'white',
      }}
      elevation={0}
    >
      {userInfo.role === UserRole.ADMIN && nrPendingParticipants > 0 && !giveaway.isInvalid &&(
        <div className="card-pending-approvals">
          <PendingApprovalBanner
            giveaway={giveaway}
            nrPending={nrPendingParticipants}
          />
        </div>
      )}
      <div className="card-media clickable" onClick={navigateDetails}>
        <img
          className="thumbnail-img"
          src={giveaway.image}
          alt="Giveaway thumb"
        />
        {isWinner && (
          <div className="winner-container">
            <div className="center-text">
              <img className="winner-icon" src={Trophy} alt="Trophy" />
              <Typography className="winner-message">
                You won this contest!
              </Typography>
            </div>
          </div>
        )}
        {giveaway.status === GiveawayStatus.INVALID && (
          <div className="invalid-giveaway">
            <div className="center-text">
              <img className="invalid-icon" src={SadEmoji} alt="SadEmoji" />
              <Typography className="invalid-message">
                Not enough participants
              </Typography>
            </div>
          </div>
        )}
        {giveaway.isInvalid && (
          <div className="invalid">
            <div style={{ textAlign: 'center' }}>
              <img className="icon" src={SadEmoji} alt="SadEmoji" />
              <Typography className="message">Not enough participants</Typography>
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
        {archived && (
          <Typography className="winners" gutterBottom>
            <span role="img" aria-label="party emoji">
              🥳
            </span>{' '}
            {giveaway.winners.length > 0 ? getWinnerStr() : giveaway.isInvalid ? 'No Winners' : 'pending'}
          </Typography>
        )}
        {archived && giveaway.winners.length == 0 && (
          <Typography className="winners" gutterBottom>
            <span role="img" aria-label="party emoji">
              🥳
            </span>{' '}
            {'No winners'}
          </Typography>
        )}
        {archived && (
          <Typography className="participants" gutterBottom>
            <span role="img" aria-label="people">
              👥
            </span>{' '}
            {`${nrConfirmedParticipants} participants`}
          </Typography>
        )}
        {!archived && (
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
