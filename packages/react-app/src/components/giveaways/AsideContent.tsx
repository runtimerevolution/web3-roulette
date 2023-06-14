import { useContext, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';

import CheckIcon from '@mui/icons-material/Check';
import { Button, Stack, Typography } from '@mui/material';

import LinkIcon from '../../assets/Link.png';
import useUserInfo from '../../hooks/useUserInfo';
import { Giveaway, UserRole } from '../../lib/types';
import { GiveawayContext } from '../../pages/details';
import Constants from '../../utils/Constants';
import SvgHelper from '../../utils/SvgHelper';
import ParticipationButton from './ParticipationButton';
import { DownloadButton } from './PDFDocument';

const GiveawayAsideContent = () => {
  const userInfo = useUserInfo();
  const giveaway = useContext(GiveawayContext) as Giveaway;
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const [qrDataURL, setQrDataURL] = useState<string>();
  const [copyClipboardCheck, setCopyClipboardCheck] = useState(false);
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

  const copyToClipboard = async () => {
    const giveawayLink = `${Constants.FRONTEND_URI}/giveaways/${giveaway._id}`;
    await navigator.clipboard.writeText(giveawayLink);

    setCopyClipboardCheck(true);
    setTimeout(() => {
      setCopyClipboardCheck(false);
    }, 1000);
  };

  return (
    <div>
      {!isAdmin && (
        <Stack className="participation-btn-container">
          <div style={{ width: '290px' }}>
            <ParticipationButton giveaway={giveaway} />
          </div>
        </Stack>
      )}
      <div
        className="giveaway-aside-info"
        style={{ paddingTop: isAdmin ? '70px' : '20px' }}
      >
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
                facilisi diam amet turpis. Nisi pharetra aenean tristique at
                Lorem ipsum.
              </Typography>
            </div>
            <div className="qr-container" ref={qrContainerRef}>
              <QRCode
                value={`${Constants.FRONTEND_URI}/giveaways/${giveaway._id}`}
              />
            </div>
            <Stack className="qr-share-container">
              <Button
                className="share-giveaway-btn"
                variant="contained"
                onClick={copyToClipboard}
                startIcon={
                  copyClipboardCheck ? (
                    <CheckIcon />
                  ) : (
                    <img className="qr-share-icon" src={LinkIcon} alt="Link" />
                  )
                }
                disableElevation
              >
                {!copyClipboardCheck && 'Copy link'}
              </Button>
              <DownloadButton giveaway={giveaway} qrDataURL={qrDataURL} />
            </Stack>
          </Stack>
        )}
      </div>
    </div>
  );
};

export default GiveawayAsideContent;
