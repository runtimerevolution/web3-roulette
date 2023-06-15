import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@mui/material';

import { Giveaway, ParticipationState, UserInfo } from '../../../lib/types';
import FrontendApiClient from '../../../services/backend';
import ParticipationService from '../../../services/giveawayparticipation';

const ButtonBaseStyle = {
  width: '100%',
  height: '40px',
  textTransform: 'none',
  marginTop: '17px',
  borderRadius: '10px',
  fontSize: '16px',
  fontWeight: '500',
  borderWidth: '2px',
};

type ManageProps = {
  giveaway: Giveaway;
};

type ParticipationProps = {
  giveaway: Giveaway;
  userInfo: UserInfo;
  successCallback: () => void;
  errorCallback: () => void;
};

type GenerateWinnersProps = {
  giveaway: Giveaway;
  successCallback: () => void;
  errorCallback: () => void;
};

const ManageButton = ({ giveaway }: ManageProps) => {
  const navigate = useNavigate();

  const manageGiveaway = () => {
    navigate(`giveaways/${giveaway._id}/edit`);
  };

  return (
    <Button
      className="card-action-btn"
      variant="contained"
      sx={{
        ...ButtonBaseStyle,
        backgroundColor: '#6D6DF0',
        color: 'white',
      }}
      onClick={manageGiveaway}
      disableElevation
    >
      Manage
    </Button>
  );
};

const GenerateWinnersButton = ({
  giveaway,
  successCallback,
  errorCallback,
}: GenerateWinnersProps) => {
  const generateWinners = () => {
    FrontendApiClient.generateWinners(giveaway._id)
      .then((_) => successCallback())
      .catch((err) => {
        console.log(`problems generating winners: ${err}`);
        errorCallback();
      });
  };

  return (
    <Button
      className="card-action-btn"
      variant="contained"
      sx={{
        ...ButtonBaseStyle,
        backgroundColor: '#DBDBFB',
        color: '#6D6DF0',
      }}
      onClick={generateWinners}
      disableElevation
    >
      Generate a winner
    </Button>
  );
};

const ParticipatingButton = () => {
  return (
    <Button
      className="card-action-btn"
      variant="contained"
      startIcon={<CheckCircleOutlineOutlinedIcon />}
      sx={{
        ...ButtonBaseStyle,
        backgroundColor: '#12BB6A',
        color: 'white',

        '&.Mui-disabled': {
          background: '#12BB6A',
          color: 'white',
        },
      }}
      disabled
      disableElevation
    >
      Registered
    </Button>
  );
};

const ApprovalPendingButton = () => {
  return (
    <Button
      className="card-action-btn"
      variant="contained"
      startIcon={<InfoOutlinedIcon />}
      sx={{
        ...ButtonBaseStyle,
        backgroundColor: '#E8AC0A',
        color: 'white',

        '&.Mui-disabled': {
          background: '#E8AC0A',
          color: 'white',
        },
      }}
      disabled
      disableElevation
    >
      Approval pending
    </Button>
  );
};

const ParticipateButton = ({
  giveaway,
  userInfo,
  successCallback,
  errorCallback,
}: ParticipationProps) => {
  const [loading, setLoading] = useState(false);

  const handleParticipation = () => {
    setLoading(true);

    ParticipationService.submitParticipation(
      giveaway,
      userInfo,
      () => {
        setLoading(false);
        successCallback();
      },
      () => {
        setLoading(false);
        errorCallback();
      }
    );
  };

  return (
    <LoadingButton
      loading={loading}
      className="card-action-btn"
      variant="contained"
      sx={{
        ...ButtonBaseStyle,
        backgroundColor: '#6D6DF0',
        color: 'white',

        '&.Mui-disabled': {
          background: '#6D6DF0',
          color: 'white',
        },
      }}
      onClick={handleParticipation}
      disableElevation
      disabled={loading}
    >
      {!loading && 'Participate'}
    </LoadingButton>
  );
};

const NotAllowedButton = () => {
  return (
    <Button
      className="card-action-btn"
      variant="contained"
      sx={{
        ...ButtonBaseStyle,
        backgroundColor: '#9E9E9E',
        color: '#2B2929',

        '&.Mui-disabled': {
          background: '#9E9E9E',
          color: '#2B2929',
        },
      }}
      disabled
      disableElevation
    >
      Not eligible
    </Button>
  );
};

const CheckingButton = () => {
  return (
    <LoadingButton
      loading
      className="card-action-btn"
      variant="contained"
      sx={{
        ...ButtonBaseStyle,
        backgroundColor: '#6D6DF0',
        color: 'white',

        '&.Mui-disabled': {
          background: '#6D6DF0',
          color: 'white',
        },
      }}
      disabled
      disableElevation
    ></LoadingButton>
  );
};

const ActionButtonComponents: { [K in ParticipationState]: React.FC<any> } = {
  manage: ManageButton,
  participating: ParticipatingButton,
  pending: ApprovalPendingButton,
  allowed: ParticipateButton,
  notAllowed: NotAllowedButton,
  checking: CheckingButton,
  rejected: NotAllowedButton,
  pendingWinners: GenerateWinnersButton,
};

export {
  ActionButtonComponents,
  ManageButton,
  ParticipatingButton,
  ApprovalPendingButton,
  ParticipateButton,
  NotAllowedButton,
  CheckingButton,
};
