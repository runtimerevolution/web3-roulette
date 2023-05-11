import express from "express";
import multer, { diskStorage } from 'multer';
import {
  getGiveaways,
  getGiveaway,
  createGiveaway,
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

router.get("/", getGiveaways);

router.get("/:id", getGiveaway);

router.post("/", upload.single('image'), createGiveaway);
