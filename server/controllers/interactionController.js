import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Service from '../models/Service.js';

export const createBooking = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const booking = await Booking.create({
      athleteId: req.user.id,
      serviceId,
      amount: service.price,
      paymentId: `FQI-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      status: 'Confirmed',
    });

    res.status(201).json(await booking.populate({ path: 'serviceId', populate: 'coachId' }));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Unable to create booking' });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const filter = req.user.role === 'Coach' ? {} : { athleteId: req.user.id };
    const bookings = await Booking.find(filter)
      .populate('athleteId', 'name email')
      .populate({ path: 'serviceId', populate: { path: 'coachId', select: 'name email' } })
      .sort({ createdAt: -1 });

    const scopedBookings =
      req.user.role === 'Coach'
        ? bookings.filter((booking) => booking.serviceId?.coachId?._id?.toString() === req.user.id)
        : bookings;

    res.json(scopedBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch bookings' });
  }
};

export const createReview = async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const review = await Review.create({
      serviceId,
      athleteId: req.user.id,
      rating,
      comment,
    });

    const stats = await Review.aggregate([
      { $match: { serviceId: service._id } },
      { $group: { _id: '$serviceId', rating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    service.rating = Number(stats[0].rating.toFixed(1));
    service.reviewCount = stats[0].count;
    await service.save();

    res.status(201).json(await review.populate('athleteId', 'name profileImage'));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Unable to add review' });
  }
};
