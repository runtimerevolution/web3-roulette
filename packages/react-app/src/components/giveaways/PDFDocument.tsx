import { format } from 'date-fns';

import { Button } from '@mui/material';
import {
  Document,
  Image,
  Page,
  PDFDownloadLink,
  Text,
  View,
} from '@react-pdf/renderer';

import CalendarIcon from '../../assets/CalendarIcon.png';
import DownloadIcon from '../../assets/Download.png';
import TrophyIcon from '../../assets/TrophyIcon.png';
import { Giveaway } from '../../lib/types';
import PDFStyles from '../../styles/PDFStyle';

type GiveawayPDFDocumentProps = {
  giveaway: Giveaway;
  qrDataURL: string;
};

type DownloadProps = {
  giveaway: Giveaway;
  qrDataURL?: string;
};

const GiveawayPDFDocument = ({
  giveaway,
  qrDataURL,
}: GiveawayPDFDocumentProps) => {
  return (
    <Document>
      <Page size="A4">
        <View style={PDFStyles.section}>
          <View style={PDFStyles.center}>
            <Text style={PDFStyles.title}>{giveaway.title}</Text>
            <Image src={giveaway.image} style={PDFStyles.image} />
          </View>
          <Text style={PDFStyles.description}>{giveaway.description}</Text>
          {giveaway.rules && (
            <View>
              <Text style={PDFStyles.subtitle}>Rules</Text>
              <Text style={PDFStyles.description}>{giveaway.rules}</Text>
            </View>
          )}
        </View>
        <View style={(PDFStyles.section, PDFStyles.center)}>
          <View>
            <View style={PDFStyles.infoContainer}>
              <Image style={PDFStyles.icon} src={TrophyIcon} />
              <Text style={PDFStyles.info}>{giveaway.prize}</Text>
            </View>
            <View style={PDFStyles.infoContainer}>
              <Image style={PDFStyles.icon} src={CalendarIcon} />
              <Text style={PDFStyles.info}>
                {format(giveaway.endTime, 'MMMM d, yyyy')}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ ...PDFStyles.section, ...PDFStyles.center }}>
          <Image style={PDFStyles.qr} src={qrDataURL} />
        </View>
      </Page>
    </Document>
  );
};

const DownloadButton = ({ giveaway, qrDataURL }: DownloadProps) => {
  const button = (
    <Button
      className="share-giveaway-btn"
      variant="contained"
      startIcon={
        <img className="qr-share-icon" src={DownloadIcon} alt="Link" />
      }
      disableElevation
      disabled={qrDataURL === undefined}
    >
      Export pdf
    </Button>
  );

  return qrDataURL ? (
    <PDFDownloadLink
      document={
        <GiveawayPDFDocument giveaway={giveaway} qrDataURL={qrDataURL} />
      }
      fileName={`giveaway-${giveaway._id}.pdf`}
    >
      {button}
    </PDFDownloadLink>
  ) : (
    <div>{button}</div>
  );
};

export default GiveawayPDFDocument;
export { DownloadButton };
