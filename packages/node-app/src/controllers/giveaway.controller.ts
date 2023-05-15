import { Request, Response } from 'express';
import fs from 'fs';
import web3 from 'web3'
import { Giveaway } from '../models/giveaway.model';
import { Location } from '../models/location.model';
import { giveawaysContract } from '../contracts';
import { fileToBase64 } from '../utils/file.util';

export const getGiveaways = async (req: Request, res: Response) => {
  try {
    const giveaways = await Giveaway.find();
    res.status(200).json(giveaways);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGiveaway = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const giveaway = await Giveaway.findById(id);
    res.status(200).json(giveaway);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
export const createGiveaway = async (req: Request, res: Response) => {
  const { title, description, startTime, endTime, numberOfWinners,
    requirements, prize, rules } = req.body;
  const file = req.file as Express.Multer.File
  let giveawayId;

  try {
    if (requirements && requirements.location) {
      const location = await Location.findById(requirements.location);
      if (!location) return res.status(404).json({ error: 'Location not found' });
    }

    const image = fileToBase64(file as Express.Multer.File)
    const giveaway = new Giveaway({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      numberOfWinners,
      requirements,
      prize,
      image,
      rules
    });
    await giveaway.save();
    giveawayId = giveaway._id

    await giveawaysContract.methods
      .createGiveaway(
        web3.utils.asciiToHex(giveawayId.toString()),
        new Date(startTime).getTime(),
        new Date(endTime).getTime(),
        numberOfWinners)
      .send({ from: process.env.OWNER_ACCOUNT_ADDRESS, gas: '1000000' });

    res.status(201).json(giveaway);
  } catch (error) {
    if (giveawayId) await Giveaway.findByIdAndDelete(giveawayId);

    res.status(500).json({ error: error.message });
  } finally {
    // remove image from tmp folder
    fs.unlink(file.path, () => { return })
  }
};
