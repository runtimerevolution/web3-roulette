import { format } from 'date-fns';

import { Button } from '@mui/material';
import {
  Document,
  Image,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import CalendarIcon from '../../assets/CalendarIcon.png';
import TrophyIcon from '../../assets/TrophyIcon.png';
import { Giveaway } from '../../lib/types';

const styles = StyleSheet.create({
  section: {
    margin: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '25px',
    color: '#303136',
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: '20px',
    color: '#303136',
    paddingBottom: 5,
  },
  image: {
    width: '350px',
    borderRadius: '16px',
    marginBottom: 10,
    objectFit: 'contain',
  },
  icon: {
    width: '15px',
    height: '15px',
    marginRight: '15px',
  },
  qr: {
    width: '150px',
    height: '150px',
  },
  description: {
    fontSize: '16px',
  },
  info: {
    fontSize: '16px',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
  },
});

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
        <View style={styles.section}>
          <Text style={styles.title}>{giveaway.title}</Text>
          <View style={styles.center}>
            <Image src={giveaway.image} style={styles.image} />
          </View>
          <Text style={styles.description}>{giveaway.description}</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.infoContainer}>
            <Image style={styles.icon} src={TrophyIcon} />
            <Text style={styles.info}>{giveaway.prize}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Image style={styles.icon} src={CalendarIcon} />
            <Text style={styles.info}>
              {format(giveaway.endTime, 'MMMM d, yyyy')}
            </Text>
          </View>
        </View>
        {giveaway.rules && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Rules</Text>
            <Text style={styles.description}>{giveaway.rules}</Text>
          </View>
        )}
        <View style={{ ...styles.section, ...styles.center }}>
          <Image style={styles.qr} src={qrDataURL} />
        </View>
      </Page>
    </Document>
  );
};

const DownloadButton = ({ giveaway, qrDataURL }: DownloadProps) => {
  const button = (
    <Button
      variant="contained"
      sx={{
        textTransform: 'none',
        marginTop: '20px',
        borderRadius: '10px',
        fontWeight: '500',
        fontSize: '16px',
        width: '235px',
      }}
      disableElevation
      disabled={qrDataURL === undefined}
    >
      Download giveaway PDF
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
