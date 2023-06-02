import { isAfter, isBefore } from 'date-fns';
import { useEffect, useState } from 'react';

import { Box, Container, Grid, Snackbar, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import CreateNewButton from '../components/CreateNewButton';
import AdminEmptyState from '../components/giveaways/AdminEmptyState';
import GiveawayCard, {
  GiveawayCardSkeleton,
} from '../components/giveaways/Card';
import { WinnerModal } from '../components/giveaways/StatusModals';
import UserEmptyState from '../components/giveaways/UserEmptyState';
import useUserInfo from '../hooks/useUserInfo';
import { GetGiveaways } from '../lib/queryClient';
import { Giveaway, UserRole } from '../lib/types';
import FrontendApiClient from '../services/backend';
import ParticipationService from '../services/giveawayparticipation';

const Tabs = {
  Active: 0,
  Archived: 1,
};

const Manage = () => {
  const userInfo = useUserInfo();
  const { isLoading, data } = GetGiveaways();
  const [activeTab, setActiveTab] = useState(Tabs.Active);
  const [winnerGiveaway, setWinnerGiveaway] = useState<Giveaway>();
  const [error, setError] = useState(false);

  const giveaways = data?.filter((g) => {
    const now = new Date();
    const giveawayEndDate = new Date(g.endTime);

    return activeTab === Tabs.Active
      ? isAfter(giveawayEndDate, now)
      : isBefore(giveawayEndDate, now);
  });

  useEffect(() => {
    if (data === undefined && !isLoading) {
      setError(true);
    }

    if (data && userInfo) {
      ParticipationService.getWinnerNotification(data, userInfo).then(
        (giveaway) => {
          if (giveaway) {
            setWinnerGiveaway(giveaway);
            FrontendApiClient.setNotifiedParticipant(
              giveaway._id,
              userInfo.email
            );
          }
        }
      );
    }
  }, [data, isLoading, userInfo]);

  const promptError = () => {
    setError(true);
  };

  const closeError = () => {
    setError(false);
  };

  if (data?.length === 0) {
    return userInfo?.role === UserRole.ADMIN ? (
      <AdminEmptyState />
    ) : (
      <UserEmptyState />
    );
  }

  return (
    <Container maxWidth={false}>
      <div>
        <WinnerModal
          giveaway={winnerGiveaway}
          open={winnerGiveaway !== undefined}
          onClose={() => setWinnerGiveaway(undefined)}
        />
      </div>
      <Snackbar open={error} autoHideDuration={6000} onClose={closeError}>
        <MuiAlert severity="error" onClose={closeError}>
          Oops, something went wrong! Please try again later.
        </MuiAlert>
      </Snackbar>
      <Box sx={{ px: '3.5rem', py: '1rem' }}>
        <Box className="giveaways-subheader-box">
          <Typography className="giveaways-title" noWrap>
            GIVEAWAYS
          </Typography>
          {userInfo?.role === UserRole.ADMIN && <CreateNewButton />}
        </Box>

        <Button
          sx={{
            textTransform: 'capitalize',
            backgroundColor:
              activeTab === Tabs.Active ? '#45507C' : 'transparent',
            color: activeTab === Tabs.Active ? 'white' : '#45507C',
            ':hover': {
              bgcolor: activeTab === Tabs.Active ? '#45507C' : 'transparent',
              color: activeTab === Tabs.Active ? 'white' : '#45507C',
            },
          }}
          variant={activeTab === Tabs.Active ? 'contained' : 'text'}
          onClick={() => {
            setActiveTab(Tabs.Active);
          }}
        >
          Active
        </Button>
        <Button
          sx={{
            textTransform: 'capitalize',
            ml: '1rem',
            backgroundColor:
              activeTab === Tabs.Archived ? '#45507C' : 'transparent',
            color: activeTab === Tabs.Archived ? 'white' : '#45507C',
            ':hover': {
              bgcolor: activeTab === Tabs.Archived ? '#45507C' : 'transparent',
              color: activeTab === Tabs.Archived ? 'white' : '#45507C',
            },
          }}
          variant={activeTab === Tabs.Archived ? 'contained' : 'text'}
          onClick={() => {
            setActiveTab(Tabs.Archived);
          }}
        >
          Archived
        </Button>
        <Grid container spacing={3} sx={{ mt: '0rem', mb: '2rem' }}>
          {isLoading ? (
            <>
              <Grid item xs={3} sx={{ minWidth: '300px' }}>
                <GiveawayCardSkeleton />
              </Grid>
              <Grid item xs={3} sx={{ minWidth: '300px' }}>
                <GiveawayCardSkeleton />
              </Grid>
              <Grid item xs={3} sx={{ minWidth: '300px' }}>
                <GiveawayCardSkeleton />
              </Grid>
              <Grid item xs={3} sx={{ minWidth: '300px' }}>
                <GiveawayCardSkeleton />
              </Grid>
            </>
          ) : giveaways === undefined || giveaways?.length === 0 ? (
            <Typography
              variant="subtitle1"
              margin="30px"
              sx={{ color: '#45507C' }}
            >
              There are no giveaways to present.
            </Typography>
          ) : (
            giveaways?.map((item) => (
              <Grid item xs={3} sx={{ minWidth: '300px' }} key={item._id}>
                <GiveawayCard
                  giveaway={item}
                  onParticipationError={promptError}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Manage;
