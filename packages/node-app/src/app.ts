import cors from 'cors';
import express from 'express';

import { verifyToken } from './middlewares/auth.middleware';
import { router as AuthRoutes } from './routes/auth.route';
import { router as GiveawayRoutes } from './routes/giveaway.route';
import { router as LocationRoutes } from './routes/location.routes';

export const app = express();

app.use(cors({ origin: [process.env.APP_ORIGIN] }));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ alive: 'True' });
});

app.use('/', AuthRoutes);
app.use('/giveaways', verifyToken, GiveawayRoutes);
app.use('/locations', verifyToken, LocationRoutes);
