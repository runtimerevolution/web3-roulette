import { useContext, useMemo } from 'react';

import { format } from 'date-fns';

import { Stack, Typography } from '@mui/material';

import { Giveaway, Participant, UserInfo, UserRole } from '../../../lib/types';
import { GiveawayContext } from '../../../pages/details';
import { UserContext } from '../../../routes/AuthRoute';
import PendingApprovalBanner from '../participation/PendingApprovalBanner';

type GiveawayMainContentProps = {
  participants: Participant[];
};

const GiveawayMainContent = ({ participants }: GiveawayMainContentProps) => {
  const userInfo = useContext(UserContext) as UserInfo;
  const giveaway = useContext(GiveawayContext) as Giveaway;
  const isAdmin = userInfo.role === UserRole.ADMIN;

  const nrParticipants = giveaway.stats.nrConfirmedParticipants;
  const nrPending = giveaway.stats.nrPendingParticipants;

  const winningChance = useMemo(() => {
    if (nrParticipants === 0) return 100;

    const isRegistered = participants.some(
      (p) => p.id === userInfo.email && p.state === 'confirmed'
    );
    const totalParticipants = isRegistered
      ? nrParticipants
      : nrParticipants + 1;
    const winningChance = Math.floor(
      (giveaway.numberOfWinners / totalParticipants) * 100
    );

    return Math.min(winningChance, 100);
  }, [giveaway, nrParticipants, participants, userInfo]);

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
              {`${nrParticipants} participants`}
            </Typography>
            {!isAdmin && participants && (
              <span className="winning-chance">{`You have a ${winningChance}% chance of winning`}</span>
            )}
          </div>
          {isAdmin && nrPending > 0 && (
            <PendingApprovalBanner giveaway={giveaway} nrPending={nrPending} />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default GiveawayMainContent;
