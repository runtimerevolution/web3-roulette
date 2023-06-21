import express from 'express';

import {
  createLocation,
  deleteLocation,
  listLocations,
  updateLocation,
} from '../controllers/location.controller';
import { verifyAdmin, verifyToken } from '../middlewares/auth.middleware';

export const router = express.Router();

router.get('/', verifyToken, listLocations);
router.post('/', verifyToken, verifyAdmin, createLocation);
router.put('/:id', verifyToken, verifyAdmin, updateLocation);
router.delete('/:id', verifyToken, verifyAdmin, deleteLocation);
