import { useNavigate } from 'react-router-dom';

import ErrorIcon from '@mui/icons-material/Error';
import { Button } from '@mui/material';

import { Giveaway } from '../../../lib/types';

type PendingApprovalBannerProps = {
  giveaway: Giveaway;
  nrPending: number;
};

const PendingApprovalBanner = ({
  giveaway,
  nrPending,
}: PendingApprovalBannerProps) => {
  const navigate = useNavigate();

  const manageParticipants = () => {
    navigate(`/giveawaysFront/${giveaway._id}/participants`);
  };

  return (
    <Button
      className="pending-alert-button"
      variant="contained"
      startIcon={<ErrorIcon />}
      onClick={manageParticipants}
      disableElevation
    >{`${nrPending} waiting for approval`}</Button>
  );
};

export default PendingApprovalBanner;
