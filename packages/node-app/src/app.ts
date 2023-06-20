import cors from 'cors';
import express from 'express';

import { router as AuthRoutes } from './routes/auth.route';
import { router as GiveawayRoutes } from './routes/giveaway.route';
import { router as LocationRoutes } from './routes/location.routes';
import { User } from './models/user.model';
import { verifyToken } from './middlewares/auth.middleware';

declare module 'express' {
  interface Request {
    user: User;
  }
}

export const app = express();

app.use(cors({ origin: [process.env.APP_ORIGIN] }));
app.use(express.json());

app.get('/', verifyToken, (req, res) => {
  res.status(200).json({ alive: 'True' });
});

app.use('/', AuthRoutes);
app.use('/giveaways', GiveawayRoutes);
app.use('/locations', LocationRoutes);
