import Resources from '../../utils/Resources';
import OverlayModal from '../OverlayModal';

type PendingLocationModalProps = {
  open: boolean;
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

export { PendingLocationModal };
