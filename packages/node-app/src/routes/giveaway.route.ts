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
import { verifyAdmin } from '../middlewares/auth.middleware';

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

router.get('/', listGiveaways);
router.get('/:id', getGiveaway);
router.put('/:id/participants', addParticipant);
router.get('/:id/participants', getParticipants);
router.put('/:id/participants/:participantId', updateParticipant);

router.post('/', verifyAdmin, upload.single('image'), createGiveaway);
router.put('/:id', verifyAdmin, upload.single('image'), updateGiveaway);
router.get('/:id/generate-winners', verifyAdmin, generateWinners);
