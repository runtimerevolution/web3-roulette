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

import { Giveaway } from '../../lib/types';

type GiveawayPDFDocumentProps = {
  giveaway: Giveaway;
  qrDataURL: string;
};

type DownloadProps = {
  giveaway: Giveaway;
  qrDataURL: string;
};

const GiveawayPDFDocument = ({
  giveaway,
  qrDataURL,
}: GiveawayPDFDocumentProps) => {
  return (
    <Document>
      <Page size="A4">
        <View>
          <Text>{giveaway.title}</Text>
          <Image src={giveaway.image} />
          <Text>{giveaway.description}</Text>
        </View>
        <View>
          <Text>{giveaway.prize}</Text>
          <Text>{format(giveaway.endTime, 'MMMM d, yyyy')}</Text>
        </View>
        {giveaway.rules && (
          <View>
            <Text>Rules</Text>
            <Text>{giveaway.rules}</Text>
          </View>
        )}
        <View>
          <Image src={qrDataURL} />
        </View>
      </Page>
    </Document>
  );
};

const DownloadButton = ({ giveaway, qrDataURL }: DownloadProps) => {
  return (
    <PDFDownloadLink
      document={
        <GiveawayPDFDocument giveaway={giveaway} qrDataURL={qrDataURL} />
      }
      fileName={`giveaway-${giveaway._id}.pdf`}
    >
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
      >
        Download giveaway PDF
      </Button>
    </PDFDownloadLink>
  );
};

export default GiveawayPDFDocument;
export { DownloadButton };
