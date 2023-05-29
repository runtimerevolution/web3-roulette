import './manage.scss';

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
import useUserInfo from '../hooks/useUserInfo';
import { GetGiveaways } from '../lib/queryClient';
import { UserRole } from '../lib/types';

const Tabs = {
  Active: 0,
  Archived: 1,
};

const Manage = () => {
  const userInfo = useUserInfo();
  const [activeTab, setActiveTab] = useState(Tabs.Active);
  const [error, setError] = useState(false);
  const { isLoading, data } = GetGiveaways();

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
  }, [data, isLoading]);

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
      <div>Page will be available soon.</div> // todo: replace with user empty state
    );
  }

  return (
    <Container maxWidth={false}>
      <Snackbar open={error} autoHideDuration={6000} onClose={closeError}>
        <MuiAlert severity="error" onClose={closeError}>
          Oops, something went wrong! Please try again later.
        </MuiAlert>
      </Snackbar>
      <Box sx={{ px: '3.5rem', py: '1rem' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            py: '1rem',
          }}
        >
          <Typography
            noWrap
            sx={{
              fontSize: '28px',
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
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
