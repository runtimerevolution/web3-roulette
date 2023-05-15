import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography } from '@mui/material';
import { GetActiveGiveaways } from '../lib/queryClient';
import GiveawayCard from '../components/GiveawayCard';

const Manage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('active');

  const { isLoading, data } = GetActiveGiveaways();

  return (
    <Container maxWidth={false} sx={{ backgroundColor: '#F5F5F5' }}>
      <Box sx={{ px: '5rem', py: '1rem' }}>
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
            variant="h6"
            noWrap
            sx={{
              fontFamily: 'Mulish',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            GIVEAWAYS
          </Typography>
          <Button
            sx={{
              textTransform: 'capitalize',
              backgroundColor: '#6D6DF0',
            }}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              navigate('/edit');
            }}
          >
            Create new
          </Button>
        </Box>

        <Button
          sx={{
            textTransform: 'capitalize',
            backgroundColor: activeTab === 'active' ? '#45507C' : 'transparent',
            color: activeTab === 'active' ? 'white' : '#45507C',
            ':hover': {
              bgcolor: activeTab === 'active' ? '#45507C' : 'transparent',
              color: activeTab === 'active' ? 'white' : '#45507C',
            },
          }}
          variant={activeTab === 'active' ? 'contained' : 'text'}
          onClick={() => {
            setActiveTab('active');
          }}
        >
          Active
        </Button>
        <Button
          sx={{
            textTransform: 'capitalize',
            ml: '1rem',
            backgroundColor:
              activeTab === 'archived' ? '#45507C' : 'transparent',
            color: activeTab === 'archived' ? 'white' : '#45507C',
            ':hover': {
              bgcolor: activeTab === 'archived' ? '#45507C' : 'transparent',
              color: activeTab === 'archived' ? 'white' : '#45507C',
            },
          }}
          variant={activeTab === 'archived' ? 'contained' : 'text'}
          onClick={() => {
            setActiveTab('archived');
          }}
        >
          Archived
        </Button>
        <Grid container spacing={2} sx={{ mt: '1rem' }}>
          <Grid item xs={3}>
            {data?.map((item, index) => (
              <GiveawayCard {...item} key={index} />
            ))}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Manage;
