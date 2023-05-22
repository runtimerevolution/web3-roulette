import { format } from 'date-fns';

import { Document, Image, Page, Text, View } from '@react-pdf/renderer';

import { Giveaway } from '../../lib/types';

type GiveawayPDFDocumentProps = {
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

export default GiveawayPDFDocument;
