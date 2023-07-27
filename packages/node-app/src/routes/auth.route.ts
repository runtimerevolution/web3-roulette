import express from 'express';
import { getCurrentUser, googleOauth } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

export const router = express.Router();

router.get('/user', verifyToken, getCurrentUser);
router.get('/google', googleOauth);
