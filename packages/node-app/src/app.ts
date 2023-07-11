import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

import { verifyToken } from './middlewares/auth.middleware';
import { router as AuthRoutes } from './routes/auth.route';
import { router as GiveawayRoutes } from './routes/giveaway.route';
import { router as LocationRoutes } from './routes/location.routes';

export const app = express();

/*
 * The option to try out the API via Swagger won't be available
 * until the authentication is independent from the frontend
 * TODO: https://runtime-revolution.atlassian.net/browse/WEB3-61
 */
const DisableTryItOutPlugin = function() {
  return {
    statePlugins: {
      spec: {
        wrapSelectors: {
          allowTryItOutFor: () => () => false
        }
      }
    }
  }
}

const swaggerOptions = {
  swaggerOptions: {
    plugins: [
      DisableTryItOutPlugin
    ]
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use(cors({ origin: [process.env.APP_ORIGIN] }));
app.use(express.json());
app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.status(200).json({ alive: 'True' });
});

app.use('/', AuthRoutes);
app.use('/giveaways', verifyToken, GiveawayRoutes);
app.use('/locations', verifyToken, LocationRoutes);
