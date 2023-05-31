import { format } from 'date-fns';
import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Stack, Typography } from '@mui/material';

import useUserInfo from '../../hooks/useUserInfo';
import { GiveawayContext, GiveawayDetailData } from '../../pages/details';
import { UserRole } from '../../lib/types';

const GiveawayMainContent = () => {
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const isAdmin = userInfo?.role === UserRole.ADMIN;

  const { giveaway, participants } = useContext(
    GiveawayContext
  ) as GiveawayDetailData;

  const nrParticipants = useMemo(() => {
    return participants.filter((p) => p.state === 'confirmed').length;
  }, [participants]);

  const nrPending = useMemo(() => {
    return participants.filter((p) => p.state === 'pending').length;
  }, [participants]);

  const manageParticipants = () => {
    navigate(`/giveaways/${giveaway._id}/participants`);
  };

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
          <>
            <span className="giveaway-info-icon" role="img" aria-label="trophy">
              🏆
            </span>{' '}
            {giveaway.prize}
          </>
        </Typography>
        <Typography sx={{ fontSize: '18px', color: '#303136' }}>
          <>
            <span
              className="giveaway-info-icon"
              role="img"
              aria-label="calendar"
            >
              🗓️
            </span>{' '}
            {format(giveaway.endTime, 'MMMM d, yyyy')}
          </>
        </Typography>
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ fontSize: '18px', color: '#303136' }}>
            <>
              <span
                className="giveaway-info-icon"
                role="img"
                aria-label="calendar"
              >
                👥
              </span>{' '}
              {`${nrParticipants} participants`}
            </>
          </Typography>
          {isAdmin && nrPending > 0 && (
            <Button
              className="pending-alert-button"
              variant="contained"
              startIcon={<ErrorIcon />}
              onClick={manageParticipants}
              disableElevation
            >{`${nrPending} waiting for approval`}</Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default GiveawayMainContent;
