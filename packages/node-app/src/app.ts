import cors from 'cors';
import express from 'express';
import { join } from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { verifyToken } from './middlewares/auth.middleware';
import { router as AuthRoutes } from './routes/auth.route';
import { router as GiveawayRoutes } from './routes/giveaway.route';
import { router as LocationRoutes } from './routes/location.routes';

export const app = express();

const host = process.env.SERVER_HOST;
const port = Number(process.env.SERVER_PORT);
const swaggerOptions = {
  swaggerOptions: {
    oauth2RedirectUrl: `http://${host}:${port}/authentication/google?swagger=true`
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use(cors({ origin: [process.env.APP_ORIGIN] }));
app.use(express.json());
app.disable('x-powered-by');

app.use('/authentication', AuthRoutes);
app.use('/giveaways', verifyToken, GiveawayRoutes);
app.use('/locations', verifyToken, LocationRoutes);

app.use(express.static(join(__dirname, '../../react-app')));
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../../react-app', 'index.html'));
});
