import { Request, Response } from 'express';
import fs from 'fs';
import { Giveaway } from '../models/giveaway.model';
import { Location } from '../models/location.model';
import { giveawaysContract } from '../contracts';
import { fileToBase64, getDefinedFields } from '../utils/model.util';
import { getParticipantAddress, isValidParticipant } from '../utils/inside.util';
import { objectIdToBytes24 } from '../utils/web3.util';

export const listGiveaways = async (req: Request, res: Response) => {
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
    const giveaway = await Giveaway.create({
      title,
      description,
      startTime: new Date(Number(startTime)),
      endTime: new Date(Number(endTime)),
      numberOfWinners: Number(numberOfWinners),
      requirements,
      prize,
      image,
      rules
    });
    giveawayId = giveaway._id

    await giveawaysContract.methods
      .createGiveaway(
        objectIdToBytes24(giveawayId),
        new Date(Number(startTime)).getTime(),
        new Date(Number(endTime)).getTime(),
        Number(numberOfWinners))
      .send({ from: process.env.OWNER_ACCOUNT_ADDRESS, gas: '1000000' });

    res.status(201).json(giveaway);
  } catch (error) {
    if (giveawayId) await Giveaway.findByIdAndDelete(giveawayId);

    res.status(500).json({ error: error.message });
  } finally {
    // remove image from tmp folder
    fs.unlink(file.path, () => { return });
  }
};

export const updateGiveaway = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File
  try {
    const { id } = req.params;
    const { title, description, prize, rules } = req.body;
    const image = file ? fileToBase64(file as Express.Multer.File) : undefined
    const updateFields = getDefinedFields({ title, description, prize, rules, image });
    const giveaway = await Giveaway.findByIdAndUpdate(id, updateFields, { new: true });

    res.status(200).json(giveaway);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (file) fs.unlink(file.path, () => { return });
  }
};

export const addParticipant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { participant } = req.body;
    const giveaway = await Giveaway.findById(id);

    if (!giveaway)
      return res.status(404).json({ error: 'Giveaway not found' });

    if (!isValidParticipant(participant, giveaway.requirements))
      return res.status(400).json({ error: "Participant is not whitelisted" });

    const address = getParticipantAddress(participant);
    giveaway.participants.push(address);
    await giveaway.save();

    await giveawaysContract.methods
      .addParticipant(
        objectIdToBytes24(giveaway._id),
        address)
      .send({ from: process.env.OWNER_ACCOUNT_ADDRESS, gas: '1000000' });

    res.status(200).json(giveaway);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateWinners = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const giveaway = await Giveaway.findById(id);

    if (!giveaway)
      return res.status(404).json({ error: 'Giveaway not found' });
    
    if (new Date() < giveaway.endTime)
      return res.status(400).json({ error: 'Giveaway has not ended yet' });
    
    if (giveaway.winners)
      return res.status(400).json({ error: 'Giveaway already has winners' });

    await giveawaysContract.methods
      .generateWinners(objectIdToBytes24(giveaway._id))
      .send({ from: process.env.OWNER_ACCOUNT_ADDRESS, gas: '1000000' });
    
    const winners = await giveawaysContract.methods
      .getWinners(objectIdToBytes24(giveaway._id)).call();

    giveaway.winners = winners;
    await giveaway.save();

    res.status(200).json({ winners });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};