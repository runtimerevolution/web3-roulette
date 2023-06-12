import { useContext, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';

import { Button, Stack, Typography } from '@mui/material';

import useUserInfo from '../../hooks/useUserInfo';
import { Giveaway, UserRole } from '../../lib/types';
import { GiveawayContext } from '../../pages/details';
import Constants from '../../utils/Constants';
import SvgHelper from '../../utils/SvgHelper';
import { DownloadButton } from './PDFDocument';

const GiveawayAsideContent = () => {
  const userInfo = useUserInfo();
  const giveaway = useContext(GiveawayContext) as Giveaway;
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
      {giveaway.rules && (
        <Stack sx={{ marginBottom: '41px' }}>
          <Typography className="aside-title">Rules</Typography>
          <Typography className="aside-text">{giveaway.rules}</Typography>
        </Stack>
      )}
      {isAdmin && (
        <Stack alignItems="center" spacing={'27px'}>
          <div>
            <Typography className="aside-title">Share QR code</Typography>
            <Typography className="aside-text">
              Description Lorem ipsum dolor sit amet consectetur. Elementum
              facilisi diam amet turpis. Nisi pharetra aenean tristique at Lorem
              ipsum.
            </Typography>
          </div>
          <div className="qr-container" ref={qrContainerRef}>
            <QRCode
              value={`${Constants.FRONTEND_URI}/giveaways/${giveaway._id}`}
            />
          </div>
          <Stack
            sx={{ width: '100%' }}
            direction={'row'}
            justifyContent={'space-between'}
          >
            <Button
              className="share-giveaway-btn"
              variant="contained"
              disableElevation
            >
              Copy link
            </Button>
            <DownloadButton giveaway={giveaway} qrDataURL={qrDataURL} />
          </Stack>
        </Stack>
      )}
    </div>
  );
};

export default GiveawayAsideContent;
