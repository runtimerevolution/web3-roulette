import express from 'express';

import { login, me } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

export const router = express.Router();

router.post('/login', login);
router.get('/me', verifyToken, me);
