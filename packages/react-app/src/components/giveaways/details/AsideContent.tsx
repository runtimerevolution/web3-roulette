import { useContext, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import CheckIcon from '@mui/icons-material/Check';
import { Button, Stack, Typography } from '@mui/material';
import LinkIcon from '../../../assets/Link.png';
import { Giveaway, ParticipationState, UserRole } from '../../../lib/types';
import { GiveawayContext } from '../../../pages/details';
import Constants from '../../../utils/Constants';
import SvgHelper from '../../../utils/SvgHelper';
import ParticipationButton from '../participation/ParticipationButton';
import { DownloadButton } from './PDFDocument';
import { AuthenticationContext } from '../../login/AuthenticationProvider';

type GiveawayAsideContentProps = {
  onParticipationChange: (newState: ParticipationState) => void;
};

const GiveawayAsideContent = ({
  onParticipationChange,
}: GiveawayAsideContentProps) => {
  const { user } = useContext(AuthenticationContext);
  const giveaway = useContext(GiveawayContext) as Giveaway;
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const [qrDataURL, setQrDataURL] = useState<string>();
  const [copyClipboardCheck, setCopyClipboardCheck] = useState(false);
  const isAdmin = user.role === UserRole.ADMIN;

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
          <div className="participation-btn-aside">
            <ParticipationButton
              giveaway={giveaway}
              onStateChange={onParticipationChange}
            />
          </div>
        </Stack>
      )}
      <div
        className="giveaway-aside-info"
        style={{ paddingTop: isAdmin ? '70px' : '20px' }}
      >
        {giveaway.rules && (
          <Stack className="aside-rules-container">
            <Typography className="aside-title">Rules</Typography>
            <Typography className="aside-text">{giveaway.rules}</Typography>
          </Stack>
        )}
        {isAdmin && (
          <Stack alignItems="center" spacing={'27px'}>
            <div>
              <Typography className="aside-title">Share QR code</Typography>
              <Typography className="aside-text">
                Share the love and spread the excitement! Share the QR code
                below to disclose the giveaway and give your colleagues a chance
                to win.
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
