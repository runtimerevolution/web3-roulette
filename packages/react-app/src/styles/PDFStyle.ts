import { StyleSheet } from '@react-pdf/renderer';

const PDFStyles = StyleSheet.create({
  section: {
    marginTop: 30,
    marginBottom: 30,
    paddingLeft: 30,
    paddingRight: 30,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '35px',
    color: '#303136',
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: '20px',
    color: '#303136',
    paddingBottom: 5,
  },
  image: {
    width: '350px',
    borderRadius: '16px',
    marginBottom: 30,
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
    marginBottom: 20,
  },
  info: {
    fontSize: '16px',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
});

export default PDFStyles;
