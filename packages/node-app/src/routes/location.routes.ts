import express from 'express';

import {
  createLocation,
  deleteLocation,
  listLocations,
  updateLocation,
} from '../controllers/location.controller';
import { verifyToken } from '../middlewares/auth.middleware';

export const router = express.Router();

router.get('/', verifyToken, listLocations);
router.post('/', verifyToken, createLocation);
router.put('/:id', verifyToken, updateLocation);
router.delete('/:id', verifyToken, deleteLocation);
