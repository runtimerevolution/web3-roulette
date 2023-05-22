import { useContext, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';

import { Stack, Typography } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';

import { Giveaway } from '../../lib/types';
import { GiveawayContext } from '../../pages/details';
import Constants from '../../utils/Constants';
import SvgHelper from '../../utils/svghelper';
import GiveawayPDFDocument from './PDFDocument';

const GiveawayAsideContent = () => {
  const giveaway = useContext(GiveawayContext) as Giveaway;
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const [qrDataURL, setQrDataURL] = useState<string>();

  useEffect(() => {
    const qrContainer = qrContainerRef.current;
    if (qrContainerRef) {
      const qrSvg = qrContainer?.children[0] as SVGElement;
      const svgBase64 = SvgHelper.svgToBase64(qrSvg);
      SvgHelper.svgToDataURL(svgBase64).then((url) => setQrDataURL(url));
    }
  }, [qrDataURL]);

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

      <Stack alignItems="center" mt="30px" sx={{ width: '100%' }}>
        <div ref={qrContainerRef}>
          <QRCode
            value={`${Constants.FRONTEND_URI}/giveaways/${giveaway._id}`}
          />
        </div>
        <Typography variant="h6">Share Giveaway</Typography>
      </Stack>
      {qrDataURL && (
        <PDFDownloadLink
          document={
            <GiveawayPDFDocument giveaway={giveaway} qrDataURL={qrDataURL} />
          }
          fileName={`giveaway-${giveaway._id}.pdf`}
        >
          Download!
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default GiveawayAsideContent;
