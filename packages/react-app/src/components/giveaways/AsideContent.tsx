import { useContext, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';

import { Stack, Typography } from '@mui/material';

import { Giveaway } from '../../lib/types';
import { GiveawayContext } from '../../pages/details';
import Constants from '../../utils/Constants';
import SvgHelper from '../../utils/SvgHelper';
import { DownloadButton } from './PDFDocument';

const GiveawayAsideContent = () => {
  const giveaway = useContext(GiveawayContext) as Giveaway;
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const [qrDataURL, setQrDataURL] = useState<string>();

  useEffect(() => {
    const qrContainer = qrContainerRef.current;
    if (qrContainerRef) {
      const qrSvg = qrContainer?.children[0] as SVGElement;
      const svgRect = qrSvg.getBoundingClientRect();

      const svgBase64 = SvgHelper.svgToBase64(qrSvg);
      SvgHelper.svgToDataURL(svgBase64, svgRect.width, svgRect.height).then(
        (url) => setQrDataURL(url)
      );
    }
  }, [qrDataURL]);

  return (
    <div className="giveaway-aside-info">
      {qrDataURL && (
        <Stack alignItems="end">
          <DownloadButton giveaway={giveaway} qrDataURL={qrDataURL} />
        </Stack>
      )}
      <Stack mt="20px">
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
      </Stack>
      <Stack alignItems="center" mt="30px">
        <div ref={qrContainerRef}>
          <QRCode
            value={`${Constants.FRONTEND_URI}/giveaways/${giveaway._id}`}
          />
        </div>
        <Typography variant="h6">Share Giveaway</Typography>
      </Stack>
    </div>
  );
};

export default GiveawayAsideContent;
