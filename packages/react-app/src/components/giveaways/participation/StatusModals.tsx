import { useContext } from 'react';

import {
  Giveaway,
  UserInfo,
} from '../../../lib/types';
import { UserContext } from '../../../routes/AuthRoute';
import Resources from '../../../utils/Resources';
import OverlayModal from '../../OverlayModal';

type PendingLocationModalProps = {
  darkBackground?: boolean;
  onClose?: () => void;
};

type GiveawayModalProps = {
  giveaway: Giveaway;
  darkBackground?: boolean;
  onClose?: () => void;
};

const PendingLocationModal = ({
  onClose,
  darkBackground = true,
}: PendingLocationModalProps) => {
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
        darkBackground={darkBackground}
        onClose={onClose}
      />
    </div>
  );
};

const WinnerModal = ({
  giveaway,
  onClose,
  darkBackground = true,
}: GiveawayModalProps) => {
  const userInfo = useContext(UserContext) as UserInfo;

  return (
    <div>
      <OverlayModal
        img={Resources.TrophyImg}
        title={`Congratulations ${userInfo.name} !`}
        description={
          <p>
            {`For winning ${giveaway.title} giveaway contest, you won a 
            ${giveaway.prize}. Please check your inbox to claim your prize!`}
          </p>
        }
        darkBackground={darkBackground}
        onClose={onClose}
      />
    </div>
  );
};

const RejectionModal = ({
  giveaway,
  onClose,
  darkBackground = true,
}: GiveawayModalProps) => {
  return (
    <div>
      <OverlayModal
        img={Resources.SadEmoji}
        title={'Sorry!'}
        description={
          <p>
            {`Unfortunately you cannot participate in ${giveaway.title} 
            contest because you do not meet all the requirements`}
          </p>
        }
        darkBackground={darkBackground}
        onClose={onClose}
      />
    </div>
  );
};

export { PendingLocationModal, RejectionModal, WinnerModal };
