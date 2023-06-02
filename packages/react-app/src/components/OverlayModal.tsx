import { Button, Typography } from '@mui/material';
import { ReactNode } from 'react';

type OverlayModalProps = {
  img: string;
  title?: string;
  description: ReactNode;
};

const OverlayModal = ({ img, title, description }: OverlayModalProps) => {
  return (
    <div className="overlay">
      <div className="modal">
        <div style={{ textAlign: 'center' }}>
          <img className="img" src={img} alt="Location" />
          <Typography className="description">{description}</Typography>
          <Button className="ok" variant="contained" disableElevation>
            Ok
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OverlayModal;
