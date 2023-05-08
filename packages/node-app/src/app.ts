import express from "express";
import { router as GiveawayRoutes } from "./routes/giveaway.route";

export const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ alive: "True" });
});

app.use("/giveaways", GiveawayRoutes);
