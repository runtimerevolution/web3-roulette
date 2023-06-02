import useUserInfo from '../../hooks/useUserInfo';
import { Giveaway } from '../../lib/types';
import Resources from '../../utils/Resources';
import OverlayModal from '../OverlayModal';

type PendingLocationModalProps = {
  open: boolean;
  onClose?: () => void;
};

type WinnerModalProps = {
  open: boolean;
  giveaway?: Giveaway;
  onClose?: () => void;
};

const PendingLocationModal = ({ open, onClose }: PendingLocationModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div>
      <OverlayModal
        img={Resources.LocationImg}
        description={
          <p>
            Your participation is <strong>pending</strong> because we could not
            verify your location. Please wait for the admin to verify your
            participation.
          </p>
        }
        onClose={onClose}
      />
    </div>
  );
};

const WinnerModal = ({ giveaway, open, onClose }: WinnerModalProps) => {
  const userInfo = useUserInfo();

  if (!open || !giveaway) {
    return null;
  }

  return (
    <div>
      <OverlayModal
        img={Resources.TrophyImg}
        title={`Congratulations ${userInfo?.name} !`}
        description={
          <p>
            {`For winning ${giveaway.title} giveaway contest, you won a 
            ${giveaway.prize}. Please check your inbox to claim your prize!`}
          </p>
        }
        onClose={onClose}
      />
    </div>
  );
};

export { PendingLocationModal, WinnerModal };
