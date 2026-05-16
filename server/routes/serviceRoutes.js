import express from 'express';
import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService,
} from '../controllers/serviceController.js';
import { coachOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', protect, coachOnly, createService);
router.put('/:id', protect, coachOnly, updateService);
router.delete('/:id', protect, coachOnly, deleteService);

export default router;
