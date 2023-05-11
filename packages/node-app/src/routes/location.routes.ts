import express from 'express';
import {
  listLocations,
  createLocation,
  updateLocation,
  deleteLocation
} from '../controllers/location.controller';

export const router = express.Router();

router.get('/', listLocations);
router.post('/', createLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);
