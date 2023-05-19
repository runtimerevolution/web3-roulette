import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Button } from '@mui/material';

import { Giveaway, UserInfo } from '../../lib/types';
import ParticipationService from '../../services/giveawayparticipation';

const ButtonBaseStyle = {
  width: '100%',
  height: '35px',
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

const ManageButton = ({ giveaway }: ManageProps) => {
  const manageGiveaway = () => {
    ParticipationService.manage(giveaway);
  };

  return (
    <Button
      className="card-action-btn"
      variant="outlined"
      sx={{
        ...ButtonBaseStyle,
        backgroundColor: 'white',
        color: '#6D6DF0',
      }}
      onClick={manageGiveaway}
      disableElevation
    >
      Manage
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
  const handleParticipation = () => {
    ParticipationService.submitParticipation(
      giveaway,
      userInfo,
      successCallback,
      errorCallback
    );
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
      onClick={handleParticipation}
      disableElevation
    >
      Participate
    </Button>
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
    <Button
      className="card-action-btn"
      variant="contained"
      sx={{
        ...ButtonBaseStyle,
        backgroundColor: 'white',
        color: 'white',

        '&.Mui-disabled': {
          background: 'white',
          color: 'white',
        },
      }}
      disabled
      disableElevation
    ></Button>
  );
};

export {
  ManageButton,
  ParticipatingButton,
  ApprovalPendingButton,
  ParticipateButton,
  NotAllowedButton,
  CheckingButton,
};
