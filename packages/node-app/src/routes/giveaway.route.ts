import express from "express";
import {
  getGiveaways,
  getGiveaway,
  createGiveaway,
} from "../controllers/giveaway.controller";

export const router = express.Router();

router.get("/", getGiveaways);

router.get("/:id", getGiveaway);

router.post("/", createGiveaway);
