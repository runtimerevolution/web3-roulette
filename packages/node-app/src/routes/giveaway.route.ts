import express from 'express';
import multer, { diskStorage } from 'multer';

import {
  addParticipant,
  createGiveaway,
  generateWinners,
  getGiveaway,
  getParticipants,
  listGiveaways,
  updateGiveaway,
  updateParticipant,
} from '../controllers/giveaway.controller';
import { verifyAdmin, verifyToken } from '../middlewares/auth.middleware';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

export const router = express.Router();

router.get('/', verifyToken, listGiveaways);
router.get('/:id', verifyToken, getGiveaway);
router.put('/:id/participants', verifyToken, addParticipant);
router.get('/:id/participants', verifyToken, getParticipants);

router.post(
  '/',
  verifyToken,
  verifyAdmin,
  upload.single('image'),
  createGiveaway
);

router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  upload.single('image'),
  updateGiveaway
);

router.put(
  '/:id/participants/:participantId',
  verifyToken,
  verifyAdmin,
  updateParticipant
);

router.get('/:id/generate-winners', verifyToken, verifyAdmin, generateWinners);
