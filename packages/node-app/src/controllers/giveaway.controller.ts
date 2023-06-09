import {
  Request,
  Response,
} from 'express';
import fs from 'fs';
import { omit } from 'lodash';

import { giveawaysContract } from '../contracts';
import {
  Giveaway,
  ParticipantState,
} from '../models/giveaway.model';
import { Location } from '../models/location.model';
import { UserRole } from '../models/user.model';
import {
  hasEnded,
  isoStringToSecondsTimestamp,
} from '../utils/date.utils';
import {
  fileToBase64,
  getDefinedFields,
  giveawayStats,
  giveawayWinners,
  handleError,
} from '../utils/model.utils';
import {
  getParticipant,
  validateParticipant,
} from '../utils/validations.utils';
import {
  decrypt,
  encrypt,
  objectIdToBytes24,
} from '../utils/web3.utils';

export const listGiveaways = async (req: Request, res: Response) => {
  try {
    let giveaways = await Giveaway.find()
      .select(
        'title description startTime endTime winners requirements prize image participants manual'
      )
      .lean();

    giveaways = giveaways.map((giveaway) => ({
      ...omit(giveaway, ['participants']),
      winners: giveawayWinners(giveaway),
      stats: giveawayStats(giveaway),
    }));

    res.status(200).json(giveaways);
  } catch (error) {
    const { code, message } = handleError(error);
    res.status(code).json({ error: message });
  }
};

export const getGiveaway = async (req: Request, res: Response) => {
  try {
    let giveaway = await Giveaway.findById(req.params.id).lean();
    giveaway = {
      ...omit(giveaway, ['participants']),
      winners: giveawayWinners(giveaway),
      stats: giveawayStats(giveaway),
    };
    res.status(200).json(giveaway);
  } catch (error) {
    const { code, message } = handleError(error);
    res.status(code).json({ error: message });
  }
};

export const createGiveaway = async (req: Request, res: Response) => {
  const {
    title,
    description,
    startTime,
    endTime,
    numberOfWinners,
    requirements,
    prize,
    rules,
    manual,
  } = req.body;
  const file = req.file as Express.Multer.File;
  let giveawayId;

  try {
    // check if location is required and valid
    if (requirements && requirements.location) {
      const location = await Location.findById(requirements.location);
      if (!location)
        return res.status(404).json({ error: 'Location not found' });
    }

    // create giveaway
    const image = fileToBase64(file as Express.Multer.File);
    const giveaway = await Giveaway.create({
      title,
      description,
      startTime,
      endTime,
      numberOfWinners,
      requirements,
      prize,
      image,
      rules,
      manual,
    });
    giveawayId = giveaway._id;

    // add giveaway to smart contract
    await giveawaysContract.methods
      .createGiveaway(
        objectIdToBytes24(giveawayId),
        isoStringToSecondsTimestamp(startTime),
        isoStringToSecondsTimestamp(endTime),
        Number(numberOfWinners)
      )
      .send({ from: process.env.OWNER_ACCOUNT_ADDRESS, gas: '1000000' });

    res.status(201).json(giveaway);
  } catch (error) {
    if (giveawayId) await Giveaway.findByIdAndDelete(giveawayId);

    const { code, message } = handleError(error);
    res.status(code).json({ error: message });
  } finally {
    // remove image from tmp folder
    fs.unlink(file.path, () => {
      return;
    });
  }
};

export const updateGiveaway = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File;
  try {
    const { id } = req.params;
    const { title, description, prize, rules } = req.body;
    const image = file ? fileToBase64(file as Express.Multer.File) : undefined;
    const updateFields = getDefinedFields({
      title,
      description,
      prize,
      rules,
      image,
    });
    const giveaway = await Giveaway.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    res.status(200).json(giveaway);
  } catch (error) {
    const { code, message } = handleError(error);
    res.status(code).json({ error: message });
  } finally {
    if (file)
      fs.unlink(file.path, () => {
        return;
      });
  }
};

export const addParticipant = async (req: Request, res: Response) => {
  try {
    // validate user
    const participantEmail = req.body.id;
    const user = req.user;

    if (participantEmail !== user.email) {
      return res.status(400).json({ error: 'Invalid participant' });
    }

    // check if giveaway exists
    const giveaway = await Giveaway.findById(req.params.id).populate(
      'requirements.location'
    );
    if (!giveaway) return res.status(404).json({ error: 'Giveaway not found' });

    // get participant state based on requirements and save to db
    const participant = await getParticipant(req.body);

    const participantExists =
      (await Giveaway.findOne({
        _id: giveaway._id,
        'participants.id': participant.id,
      })) !== null;

    if (participantExists)
      return res
        .status(409)
        .json({ error: 'Participant already exists in the giveaway' });

    const state = validateParticipant(participant, giveaway);
    giveaway.participants.push({
      id: participant.id,
      name: participant.name,
      state,
    });
    await giveaway.save();

    // send state feedback
    if (state === ParticipantState.REJECTED)
      return res.status(422).json({ error: 'Participant rejected' });
    else if (state === ParticipantState.PENDING)
      return res
        .status(200)
        .json({ message: 'Participant pending manual approval' });

    try {
      // add approved participant to smart contract
      const participantHash = encrypt(participant.id);
      await giveawaysContract.methods
        .addParticipant(objectIdToBytes24(giveaway._id), participantHash)
        .send({ from: process.env.OWNER_ACCOUNT_ADDRESS, gas: '1000000' });
    } catch (error) {
      // if contract insertion fails, remove participant from the database
      giveaway.participants = giveaway.participants.filter(
        (p) => p.id !== participant.id
      );
      await giveaway.save();
      throw error;
    }

    res.status(200).json({ message: 'Participant added successfully' });
  } catch (error) {
    const { code, message } = handleError(error);
    res.status(code).json({ error: message });
  }
};

export const getParticipants = async (req: Request, res: Response) => {
  try {
    const giveaway = await Giveaway.findById(req.params.id);
    if (!giveaway) return res.status(404).json({ error: 'Giveaway not found' });

    res.status(200).json(giveaway.participants);
  } catch (error) {
    const { code, message } = handleError(error);
    res.status(code).json({ error: message });
  }
};

export const updateParticipant = async (req: Request, res: Response) => {
  try {
    // valid giveaway
    const giveaway = await Giveaway.findById(req.params.id);
    if (!giveaway) return res.status(404).json({ error: 'Giveaway not found' });

    // valid participant
    const participant = giveaway.participants.find(
      (participant) => participant.id === req.params.participantId
    );
    if (!participant)
      return res.status(404).json({ error: 'Participant not found' });

    // handle state
    const { state, notified } = req.body;
    const user = req.user;

    if (state) {
      // not active giveaway
      const now = new Date();
      if (giveaway.startTime > now || now > giveaway.endTime) {
        return res.status(400).json({ error: 'Giveaway not active' });
      }

      // unauthorized user
      if (user.role !== UserRole.ADMIN) {
        return res
          .status(401)
          .json({ error: 'Unauthorized to change participant state' });
      }

      if (participant.state !== ParticipantState.PENDING)
        return res.status(400).json({ error: 'Participant state already set' });

      // add to smart contract
      if (state === ParticipantState.CONFIRMED) {
        const participantHash = encrypt(participant.id);
        await giveawaysContract.methods
          .addParticipant(objectIdToBytes24(giveaway._id), participantHash)
          .send({ from: process.env.OWNER_ACCOUNT_ADDRESS, gas: '1000000' });
      }

      participant.state = state;
    }

    // save participant
    if (notified) {
      if (user.email !== participant.id) {
        return res
          .status(401)
          .json({ error: 'Unauthorized to change participant' });
      }

      participant.notified = notified;
    }
    await giveaway.save();

    res.status(200).json({ message: 'Participant updated successfully' });
  } catch (error) {
    const { code, message } = handleError(error);
    res.status(code).json({ error: message });
  }
};

export const generateWinners = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const giveaway = await Giveaway.findById(id);

    if (!giveaway) return res.status(404).json({ error: 'Giveaway not found' });

    if (!hasEnded(giveaway.endTime))
      return res.status(400).json({ error: 'Giveaway has not ended yet' });

    if (giveaway.winners.length > 0)
      return res.status(400).json({ error: 'Giveaway already has winners' });

    await giveawaysContract.methods
      .generateWinners(objectIdToBytes24(giveaway._id))
      .send({ from: process.env.OWNER_ACCOUNT_ADDRESS, gas: '1000000' });

    const winners = await giveawaysContract.methods
      .getWinners(objectIdToBytes24(giveaway._id))
      .call();

    const decryptedWinners = winners.map((winner) => ({ id: decrypt(winner) }));

    giveaway.winners = decryptedWinners;
    await giveaway.save();

    res.status(200).json(decryptedWinners);
  } catch (error) {
    const { code, message } = handleError(error);
    res.status(code).json({ error: message });
  }
};
