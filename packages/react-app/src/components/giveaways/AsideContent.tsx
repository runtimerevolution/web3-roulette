import { useContext } from 'react';
import QRCode from 'react-qr-code';

import { Stack, Typography } from '@mui/material';
import ReactPDF, { PDFDownloadLink } from '@react-pdf/renderer';

import { Giveaway } from '../../lib/types';
import { GiveawayContext } from '../../pages/details';
import Constants from '../../utils/Constants';
import GiveawayPDFDocument from './PDFDocument';

const GiveawayAsideContent = () => {
  const giveaway = useContext(GiveawayContext) as Giveaway;

  return (
    <div className="giveaway-aside-info">
      <div>
        <Typography
          sx={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#282655',
          }}
        >
          Rules
        </Typography>
        <Typography sx={{ fontSize: '16px', marginTop: '5px' }}>
          {giveaway.rules}
        </Typography>
      </div>
      <PDFDownloadLink
        document={<GiveawayPDFDocument {...giveaway} />}
        fileName={`giveaway-${giveaway._id}.pdf`}
        style={{ textDecoration: 'none' }}
      >
        <Stack alignItems="center" mt="30px" sx={{ width: '100%' }}>
          <div>
            <QRCode
              value={`${Constants.FRONTEND_URI}/giveaways/${giveaway._id}`}
            />
          </div>
          <Typography variant="h6" sx={{ color: 'black' }}>
            Share Giveaway
          </Typography>
        </Stack>
      </PDFDownloadLink>
    </div>
  );
};

export default GiveawayAsideContent;
