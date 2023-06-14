import { isAfter, isBefore } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import { Box, Container, Grid, Snackbar, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import CreateNewButton from '../components/CreateNewButton';
import AdminEmptyState from '../components/giveaways/empty/AdminEmptyState';
import GiveawayCard, {
  GiveawayCardSkeleton,
} from '../components/giveaways/cards/Card';
import GiveawayCountdownCard from '../components/giveaways/cards/CountdownCard';
import UserEmptyState from '../components/giveaways/empty/UserEmptyState';
import { splitTimeLeft } from '../hooks/useTimer';
import useUserInfo from '../hooks/useUserInfo';
import { GetGiveaways } from '../lib/queryClient';
import { Giveaway, UserRole } from '../lib/types';
import ParticipationService from '../services/giveawayparticipation';

const Tabs = {
  Active: 0,
  Archived: 1,
};

const Manage = () => {
  const userInfo = useUserInfo();
  const { isLoading, data } = GetGiveaways();
  const [activeTab, setActiveTab] = useState(Tabs.Active);
  const [countdownGiveaway, setCountdownGiveaway] = useState<Giveaway | null>();
  const [error, setError] = useState(false);

  const giveaways = useMemo(() => {
    return data?.filter((g) => {
      const now = new Date();
      const giveawayStartDate = new Date(g.startTime);
      const giveawayEndDate = new Date(g.endTime);

      if (userInfo?.role !== UserRole.ADMIN && giveawayStartDate > new Date()) {
        return false;
      }

      if (g._id === countdownGiveaway?._id) {
        return false;
      }

      return activeTab === Tabs.Active
        ? isAfter(giveawayEndDate, now)
        : isBefore(giveawayEndDate, now);
    });
  }, [activeTab, data, countdownGiveaway]);

  useEffect(() => {
    if (data === undefined && !isLoading) {
      setError(true);
    }

    if (data && userInfo) {
      if (userInfo.role !== UserRole.ADMIN && countdownGiveaway === undefined) {
        ParticipationService.nextGiveaway(data).then((nextGiveaway) => {
          if (nextGiveaway) {
            const giveawayTime = nextGiveaway.endTime.getTime();
            const timeLeft = splitTimeLeft(giveawayTime - new Date().getTime());
            setCountdownGiveaway(timeLeft[0] >= 100 ? null : nextGiveaway);
          } else {
            setCountdownGiveaway(null);
          }
        });
      } else if (userInfo.role === UserRole.ADMIN) {
        setCountdownGiveaway(null);
      }
    }
  }, [data, isLoading]);

  const closeError = () => {
    setError(false);
  };

  if (
    userInfo?.role === UserRole.USER &&
    giveaways?.length === 0 &&
    !countdownGiveaway &&
    activeTab === Tabs.Active
  ) {
    return <UserEmptyState />;
  }

  if (userInfo?.role === UserRole.ADMIN && data?.length === 0) {
    return <AdminEmptyState />;
  }

  return (
    <Container maxWidth={false}>
      <Snackbar open={error} autoHideDuration={6000} onClose={closeError}>
        <MuiAlert severity="error" onClose={closeError}>
          Oops, something went wrong! Please try again later.
        </MuiAlert>
      </Snackbar>
      <Box sx={{ px: '2rem', py: '1rem' }}>
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
          disableElevation
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
          disableElevation
        >
          Archived
        </Button>
        <div>
          {countdownGiveaway && activeTab === Tabs.Active && (
            <GiveawayCountdownCard {...countdownGiveaway} />
          )}
          <Grid container spacing={3} sx={{ mt: '0rem', mb: '2rem' }}>
            {isLoading || countdownGiveaway === undefined ? (
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
            ) : giveaways === undefined ||
              (giveaways?.length === 0 &&
                ((!countdownGiveaway && activeTab === Tabs.Active) ||
                  activeTab === Tabs.Archived)) ? (
              <Typography
                variant="subtitle1"
                margin="30px"
                sx={{ color: '#45507C' }}
              >
                There are no giveaways to present.
              </Typography>
            ) : (
              giveaways?.map((g) => (
                <Grid
                  item
                  xs={3}
                  sx={{ minWidth: { xs: '100%', sm: '300px' } }}
                  key={g._id}
                >
                  <GiveawayCard {...g} />
                </Grid>
              ))
            )}
          </Grid>
        </div>
      </Box>
    </Container>
  );
};

export default Manage;
