import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Giveaway } from './models';
import { giveawaysContract } from './contracts';

// connect to mongodb
mongoose.connect(process.env.DATABASE_URI)
mongoose.connection.on('error', error => console.log(error))
mongoose.Promise = global.Promise

// setup express app
const host = process.env.SERVER_HOST;
const port = Number(process.env.SERVER_PORT);
export const app = express();

// define endpoints
app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Hello API' });
});

app.get('/giveaways', async (req: Request, res: Response) => {
  try {
    const giveaways = await Giveaway.find();
    res.json(giveaways);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch giveaways' });
  }
});

app.get('/giveaways/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const giveaway = await Giveaway.findById(id);

    if (!giveaway)
      return res.status(404).json({ message: `Giveaway with ID ${id} not found` });

    return res.json(giveaway);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/giveaways", async (req: Request, res: Response) => {
  try {
    const { title, description, startTime, endTime, numberOfWinners, requirements } = req.body;
    const giveaway = new Giveaway({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      numberOfWinners,
      requirements
    });
    await giveaway.save();

    const id = giveaway._id.toString();
    await giveawaysContract.methods
      .createGiveaway(id, startTime, endTime, numberOfWinners)
      .send({ from: process.env.OWNER_ACCOUNT_ADDRESS });

    res.status(200).send({ message: "Giveaway created successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// initialize express app
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
