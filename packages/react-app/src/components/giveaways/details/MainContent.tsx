import { useContext, useMemo } from 'react';

import { format } from 'date-fns';

import { Stack, Typography } from '@mui/material';

import { Giveaway, Participant, UserInfo, UserRole } from '../../../lib/types';
import { GiveawayContext } from '../../../pages/details';
import { UserContext } from '../../../routes/AuthRoute';
import PendingApprovalBanner from '../participation/PendingApprovalBanner';

type GiveawayMainContentProps = {};

const GiveawayMainContent = () => {
  const userInfo = useContext(UserContext) as UserInfo;
  const giveaway = useContext(GiveawayContext) as Giveaway;
  const isAdmin = userInfo.role === UserRole.ADMIN;
  const {
    stats: {
      nrConfirmedParticipants,
      nrPendingParticipants,
    },
    winningChance,
  } = giveaway;

  return (
    <Stack sx={{ paddingLeft: { sm: '80px', lg: '0px' } }}>
      <Typography
        sx={{
          fontSize: '35px',
          fontWeight: 'bold',
          color: '#303136',
          marginTop: '5px',
          marginLeft: { xs: '10px', md: '0px' },
        }}
      >
        {giveaway.title}
      </Typography>
      <img className="giveaway-img" src={giveaway.image} alt={giveaway.title} />
      <Typography
        sx={{
          fontSize: '16px',
          color: '#303136',
          width: '580px',
          marginTop: '20px',
          maxWidth: '95%',
          marginLeft: { xs: '10px', md: '0px' },
        }}
      >
        {giveaway.description}
      </Typography>
      <Stack mt="14px" spacing="12px">
        <Typography sx={{ fontSize: '18px', color: '#303136' }}>
          <span className="giveaway-info-icon" role="img" aria-label="trophy">
            🏆
          </span>{' '}
          {giveaway.prize}
        </Typography>
        <Typography sx={{ fontSize: '18px', color: '#303136' }}>
          <span className="giveaway-info-icon" role="img" aria-label="calendar">
            🗓️
          </span>{' '}
          {format(giveaway.endTime, 'MMMM d, yyyy')}
        </Typography>
        {giveaway.winners && giveaway.winners.length > 0 && (
          <Typography sx={{ fontSize: '18px', color: '#303136' }}>
            <span
              className="giveaway-info-icon"
              role="img"
              aria-label="Party emoji"
            >
              🥳
            </span>{' '}
            {giveaway.winners.map((winner) => winner.name).join(', ')}
          </Typography>
        )}
        <Stack
          justifyContent="space-between"
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: { xs: 'start', lg: 'space-between' },
          }}
        >
          <div>
            <Typography sx={{ fontSize: '18px', color: '#303136' }}>
              <span
                className="giveaway-info-icon"
                role="img"
                aria-label="calendar"
              >
                👥
              </span>{' '}
              {`${nrConfirmedParticipants} participants`}
            </Typography>
            {!isAdmin && nrConfirmedParticipants && (
              <span className="winning-chance">{`You have a ${winningChance}% chance of winning`}</span>
            )}
          </div>
          {isAdmin && nrPendingParticipants > 0 && (
            <PendingApprovalBanner giveaway={giveaway} nrPending={nrPendingParticipants} />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default GiveawayMainContent;
