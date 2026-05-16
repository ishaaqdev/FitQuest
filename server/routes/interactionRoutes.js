import express from 'express';
import { createBooking, createReview, getMyBookings } from '../controllers/interactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/bookings', protect, getMyBookings);
router.post('/book', protect, createBooking);
router.post('/review', protect, createReview);

export default router;
