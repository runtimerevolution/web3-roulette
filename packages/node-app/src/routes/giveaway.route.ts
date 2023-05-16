import express from "express";
import multer, { diskStorage } from 'multer';
import {
  listGiveaways,
  getGiveaway,
  createGiveaway,
  updateGiveaway,
  addParticipant,
  generateWinners
} from "../controllers/giveaway.controller";

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage })

export const router = express.Router();

router.get("/", listGiveaways);
router.post("/", upload.single('image'), createGiveaway);
router.get("/:id", getGiveaway);
router.put("/:id", upload.single('image'), updateGiveaway);
router.put("/:id/participants", addParticipant);
router.get("/:id/generate-winners", generateWinners);
