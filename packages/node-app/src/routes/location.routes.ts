import express from 'express';

import {
  createLocation,
  deleteLocation,
  listLocations,
  updateLocation,
} from '../controllers/location.controller';
import { verifyAdmin } from '../middlewares/auth.middleware';

export const router = express.Router();

router.get('/', listLocations);
router.post('/', verifyAdmin, createLocation);
router.put('/:id', verifyAdmin, updateLocation);
router.delete('/:id', verifyAdmin, deleteLocation);
