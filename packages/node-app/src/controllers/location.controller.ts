import { Request, Response } from 'express';
import { Location } from '../models/location.model';

export const listLocations = async (req: Request, res: Response) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createLocation = async (req: Request, res: Response) => {
  try {
    const { name, latitude, longitude, radius } = req.body;
    const location = new Location({
      name,
      latitude,
      longitude,
      radius,
    });
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, latitude, longitude, radius } = req.body;
    const location = await Location.findByIdAndUpdate(
      id,
      { name, latitude, longitude, radius },
      { new: true }
    );

    if (!location) return res.status(404).json({ error: 'Location not found' });

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Location.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
