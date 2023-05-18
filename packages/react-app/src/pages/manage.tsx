import { isAfter, isBefore } from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import { Box, Container, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';

import GiveawayCard, { GiveawayCardSkeleton } from '../components/GiveawayCard';
import useUserInfo from '../hooks/useUserInfo';
import { GetGiveaways } from '../lib/queryClient';
import { UserRole } from '../lib/types';

const Tabs = {
  Active: 0,
  Archived: 1,
};

const Manage = () => {
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const [activeTab, setActiveTab] = useState(Tabs.Active);
  const { isLoading, data } = GetGiveaways();

  const giveaways = data?.filter((g) => {
    const now = new Date();
    const giveawayEndDate = new Date(g.endTime);

    return activeTab === Tabs.Active
      ? isAfter(giveawayEndDate, now)
      : isBefore(giveawayEndDate, now);
  });

  return (
    <Container maxWidth={false}>
      <Box sx={{ px: '3.5rem', py: '1rem' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
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
          {userInfo?.role === UserRole.ADMIN && (
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                width: '150px',
                height: '35px',
                borderRadius: '10px',
                fontSize: '16px',
              }}
              startIcon={<AddIcon />}
              onClick={() => {
                navigate('/edit');
              }}
              disableElevation
            >
              Create new
            </Button>
          )}
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
          ) : (
            giveaways?.map((item, index) => (
              <Grid item xs={3} sx={{ minWidth: '300px' }} key={item._id}>
                <GiveawayCard {...item} />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Manage;
