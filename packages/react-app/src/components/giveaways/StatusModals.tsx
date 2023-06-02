import Resources from '../../utils/Resources';
import OverlayModal from '../OverlayModal';

const PendingLocationModal = () => {
  return (
    <OverlayModal
      img={Resources.LocationImg}
      description={
        <p>
          Your participation is <strong>pending</strong> because we could not
          verify your location. Please wait for the admin to verify your
          participation.
        </p>
      }
    />
  );
};

export { PendingLocationModal };
