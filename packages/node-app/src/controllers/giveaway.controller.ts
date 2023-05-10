import { Request, Response } from 'express';
import { Giveaway } from '../models/giveaway.model';
import { giveawaysContract } from '../contracts';

export const getGiveaways = async (req: Request, res: Response) => {
  try {
    const giveaways = await Giveaway.find();
    res.status(200).json(giveaways);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getGiveaway = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const giveaway = await Giveaway.findById(id);
    return res.status(200).json(giveaway);
  } catch (error) {
    return res.status(500).json(error);
  }
};
  
export const createGiveaway = async (req: Request, res: Response) => {
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

    res.status(200).json(giveaway);
  } catch (error) {
    res.status(500).json(error);
  }
};
