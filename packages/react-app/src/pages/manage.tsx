import { useContext, useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Box, Container, Grid, Snackbar, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CreateNewButton from '../components/CreateNewButton';
import GiveawayCard, {
  GiveawayCardSkeleton,
} from '../components/giveaways/cards/Card';
import GiveawayCountdownCard from '../components/giveaways/cards/CountdownCard';
import AdminEmptyState from '../components/giveaways/empty/AdminEmptyState';
import UserEmptyState from '../components/giveaways/empty/UserEmptyState';
import { splitTimeLeft } from '../hooks/useTimer';
import { useGiveaways } from '../lib/queryClient';
import { Giveaway, UserRole } from '../lib/types';
import ParticipationService from '../services/giveawayparticipation';
import { AuthenticationContext } from '../components/login/AuthenticationProvider';

const Tabs = {
  Active: 0,
  Archived: 1,
};

const isTabActive = (tab: number) => tab === Tabs.Active;

const Manage = () => {
  const { user } = useContext(AuthenticationContext);
  const [activeTab, setActiveTab] = useState(Tabs.Active);
  const { data, isLoading, refetch, isFetching } = useGiveaways(isTabActive(activeTab));
  const [countdownGiveaway, setCountdownGiveaway] = useState<Giveaway | null>();
  const [showConfettis, setShowConfettis] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    refetch();
  }, [activeTab]);

  useEffect(() => {
    if (data?.giveaways === undefined && !isLoading) {
      setError(true);
    }

    if (data?.giveaways) {
      if (user?.role !== UserRole.ADMIN && countdownGiveaway === undefined) {
        ParticipationService.nextGiveaway(data.giveaways).then(
          (nextGiveaway) => {
            if (nextGiveaway) {
              const giveawayTime = nextGiveaway.endTime.getTime();
              const timeLeft = splitTimeLeft(
                giveawayTime - new Date().getTime()
              );
              setCountdownGiveaway(timeLeft[0] >= 100 ? null : nextGiveaway);
            } else {
              setCountdownGiveaway(null);
            }
          }
        );
      } else if (user?.role === UserRole.ADMIN) {
        setCountdownGiveaway(null);
      }
    }
  }, [data?.giveaways, isLoading]);

  const handleWinners = () => {
    animateConfettis();
    refetch().then(() => {
      setActiveTab(Tabs.Archived);
    });
  };

  const animateConfettis = () => {
    setShowConfettis(true);
    setTimeout(() => {
      setShowConfettis(false);
    }, 4000);
  };

  const closeError = () => {
    setError(false);
  };

  if (
    !isFetching &&
    data?.totalGiveaways === 0 &&
    user?.role === UserRole.USER
  ) {
    return <UserEmptyState />;
  }

  if (
    !isFetching &&
    data?.totalGiveaways === 0 &&
    user?.role === UserRole.ADMIN
  ) {
    return <AdminEmptyState />;
  }
  console.log(isFetching);

  return (
    <Container maxWidth={false}>
      {showConfettis && <Confetti />}
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
          {user?.role === UserRole.ADMIN && <CreateNewButton />}
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
            {isFetching || countdownGiveaway === undefined ? (
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
            ) : data?.giveaways === undefined ||
              (data.giveaways?.length === 0 &&
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
              data.giveaways
                ?.filter((g) => g._id !== countdownGiveaway?._id)
                .map((g) => (
                  <Grid
                    item
                    xs={3}
                    sx={{ minWidth: { xs: '100%', sm: '300px' } }}
                    key={g._id}
                  >
                    <GiveawayCard
                      giveaway={g}
                      archived={activeTab === Tabs.Archived}
                      onWinnersGeneration={handleWinners}
                    />
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
