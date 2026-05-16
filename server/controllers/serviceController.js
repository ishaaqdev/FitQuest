import Service from '../models/Service.js';
import Review from '../models/Review.js';

const servicePopulate = { path: 'coachId', select: 'name email profileImage bio stats' };

export const getServices = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, minRating, sort = 'rating' } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };

    const sortMap = {
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
      newest: { createdAt: -1 },
      rating: { rating: -1, reviewCount: -1 },
    };

    const services = await Service.find(filter)
      .populate(servicePopulate)
      .sort(sortMap[sort] || sortMap.rating);

    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch services' });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(servicePopulate);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const reviews = await Review.find({ serviceId: service._id })
      .populate({ path: 'athleteId', select: 'name profileImage' })
      .sort({ createdAt: -1 });

    res.json({ ...service.toObject(), reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch service' });
  }
};

export const createService = async (req, res) => {
  try {
    const service = await Service.create({ ...req.body, coachId: req.user.id });
    await service.populate(servicePopulate);
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Unable to create service' });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.coachId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own listings' });
    }

    Object.assign(service, req.body);
    await service.save();
    await service.populate(servicePopulate);
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Unable to update service' });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.coachId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }

    await Review.deleteMany({ serviceId: service._id });
    await service.deleteOne();
    res.json({ message: 'Service deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to delete service' });
  }
};
