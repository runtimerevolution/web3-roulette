import { useContext, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';

import { Stack, Typography } from '@mui/material';

import useUserInfo from '../../hooks/useUserInfo';
import { UserRole } from '../../lib/types';
import { GiveawayContext, GiveawayDetailData } from '../../pages/details';
import Constants from '../../utils/Constants';
import SvgHelper from '../../utils/SvgHelper';
import { DownloadButton } from './PDFDocument';

const GiveawayAsideContent = () => {
  const userInfo = useUserInfo();
  const { giveaway } = useContext(GiveawayContext) as GiveawayDetailData;
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const [qrDataURL, setQrDataURL] = useState<string>();
  const isAdmin = userInfo?.role === UserRole.ADMIN;

  useEffect(() => {
    if (!isAdmin) return;

    const qrContainer = qrContainerRef.current;
    if (qrContainerRef) {
      const qrSvg = qrContainer?.children[0] as SVGElement;
      const svgRect = qrSvg.getBoundingClientRect();

      const svgBase64 = SvgHelper.svgToBase64(qrSvg);
      SvgHelper.svgToDataURL(svgBase64, svgRect.width, svgRect.height).then(
        (url) => setQrDataURL(url)
      );
    }
  }, [isAdmin, qrDataURL]);

  return (
    <div className="giveaway-aside-info">
      {isAdmin && (
        <Stack sx={{ alignItems: { xs: 'center', lg: 'end' } }}>
          <DownloadButton giveaway={giveaway} qrDataURL={qrDataURL} />
        </Stack>
      )}
      {giveaway.rules && (
        <Stack mt={isAdmin ? '20px' : '80px'}>
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
      )}
      {isAdmin && (
        <Stack alignItems="center" mt="50px">
          <div ref={qrContainerRef}>
            <QRCode
              value={`${Constants.FRONTEND_URI}/giveaways/${giveaway._id}`}
            />
          </div>
          <Typography variant="h6">Share Giveaway</Typography>
        </Stack>
      )}
    </div>
  );
};

export default GiveawayAsideContent;
