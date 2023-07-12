import { Button, Typography } from '@mui/material';
import { ReactNode } from 'react';

type OverlayModalProps = {
  img: string;
  description: ReactNode;
  title?: string;
  darkBackground?: boolean;
  onClose?: () => void;
};

const OverlayModal = ({
  img,
  title,
  description,
  onClose,
  darkBackground = true,
}: OverlayModalProps) => {
  return (
    <div
      className={darkBackground ? 'overlay' : 'overlay nobackground'}
      onClick={onClose}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="center-text">
          <img className="img" src={img} alt="Location" />
          <Typography className="modal-title">{title}</Typography>
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
