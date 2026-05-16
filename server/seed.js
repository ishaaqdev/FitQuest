import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Service from './models/Service.js';
import User from './models/User.js';

dotenv.config();

const categories = ['Cricket', 'Yoga', 'Football', 'Fitness', 'Kabaddi'];
const locations = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Kolkata'];
const images = [
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80',
];

const coachNames = [
  'Aarav Mehta',
  'Priya Nair',
  'Kabir Singh',
  'Ananya Rao',
  'Rohan Iyer',
  'Meera Kapoor',
  'Dev Patel',
  'Sana Khan',
  'Arjun Menon',
  'Nisha Verma',
];

const serviceTitles = [
  'Powerplay Batting Lab',
  'Sunrise Hatha Yoga',
  'Elite Football Footwork',
  'Lean Strength Blueprint',
  'Kabaddi Raider Conditioning',
  'Spin Bowling Masterclass',
  'Desk-to-Mat Mobility',
  'Goalkeeper Reflex Camp',
  'Metabolic Reset Training',
  'Defender Agility Circuit',
  'Weekend Cricket Academy',
  'Prenatal Yoga Flow',
  'Striker Finishing Clinic',
  'Hypertrophy Fundamentals',
  'Kabaddi Team Tactics',
  'Fast Bowling Mechanics',
  'Mindful Breathwork Studio',
  'Midfield Engine Program',
  'Women Strength Collective',
  'Grip and Escape Kabaddi',
  'T20 Match Simulation',
  'Restorative Evening Yoga',
  'Youth Football Academy',
  'Fat Loss Accountability',
  'Corner Raid Specialist',
  'Wicketkeeping Intensive',
  'Ashtanga Progression',
  'Speed and Plyo Lab',
  'Corporate Fitness Reset',
  'All-Rounder Performance',
];

const makeService = (title, index, coachId) => {
  const category = categories[index % categories.length];
  const location = locations[index % locations.length];
  return {
    title,
    coachId,
    category,
    location,
    price: 1499 + (index % 6) * 750,
    duration: `${2 + (index % 5)} weeks`,
    image: images[index % images.length],
    rating: Number((4.2 + (index % 8) * 0.1).toFixed(1)),
    reviewCount: 18 + index * 3,
    description: `${category} coaching in ${location} with structured drills, weekly progress checks, and a premium training plan built for Indian athletes.`,
  };
};

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitquest');

  await Promise.all([User.deleteMany({}), Service.deleteMany({})]);

  const password = await bcrypt.hash('password123', 10);
  const coaches = await User.insertMany(
    coachNames.map((name, index) => ({
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@fitquest.in`,
      password,
      role: 'Coach',
      bio: `Certified ${categories[index % categories.length]} coach helping athletes train with discipline and confidence.`,
      profileImage: `https://i.pravatar.cc/240?img=${index + 12}`,
      stats: {
        totalStudents: 120 + index * 24,
        revenue: 180000 + index * 32000,
        profileViews: 1400 + index * 210,
      },
    }))
  );

  await User.create({
    name: 'Ishaaq Athlete',
    email: 'athlete@fitquest.in',
    password,
    role: 'Athlete',
    bio: 'Training for a stronger season.',
    profileImage: 'https://i.pravatar.cc/240?img=5',
  });

  await Service.insertMany(
    serviceTitles.map((title, index) => makeService(title, index, coaches[index % coaches.length]._id))
  );

  console.log('Seeded FitQuest India with 10 coaches, 1 athlete, and 30 services.');
  console.log('Demo login: athlete@fitquest.in / password123');
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
