import { Button, Typography } from '@mui/material';
import { ReactNode } from 'react';

type OverlayModalProps = {
  img: string;
  description: ReactNode;
  title?: string;
  onClose?: () => void;
};

const OverlayModal = ({
  img,
  title,
  description,
  onClose,
}: OverlayModalProps) => {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: 'center' }}>
          <img className="img" src={img} alt="Location" />
          <div className="description">{description}</div>
          <Button
            className="ok"
            variant="contained"
            onClick={onClose}
            disableElevation
          >
            Ok
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OverlayModal;
