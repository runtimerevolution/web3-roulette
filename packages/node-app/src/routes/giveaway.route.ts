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
import { verifyToken } from '../middlewares/auth.middleware';

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
router.post('/', verifyToken, upload.single('image'), createGiveaway);
router.get('/:id', verifyToken, getGiveaway);
router.put('/:id', verifyToken, upload.single('image'), updateGiveaway);
router.put('/:id/participants', verifyToken, addParticipant);
router.put('/:id/participants/:participantId', verifyToken, updateParticipant);
router.get('/:id/participants', verifyToken, getParticipants);
router.get('/:id/generate-winners', verifyToken, generateWinners);
