import express from 'express';

import {
  createLocation,
  deleteLocation,
  listLocations,
  updateLocation,
} from '../controllers/location.controller';

export const router = express.Router();

router.get('/', listLocations);
router.post('/', createLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);
