import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUp,
  BadgeCheck,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Dumbbell,
  Eye,
  Flame,
  HandCoins,
  Images,
  ImagePlus,
  LogOut,
  MessageCircle,
  Moon,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Target,
  TrendingUp,
  UserRound,
  Users,
  WalletCards,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext.jsx';
import { categories, fakeUsers, goals } from './data/sampleServices.js';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const landingStats = [
  { label: 'athletes exploring each month', value: 50000, prefix: '', suffix: '+' },
  { label: 'active coaches earning on the platform', value: 1200, prefix: '', suffix: '+' },
  { label: 'verified transformations and proof posts', value: 18000, prefix: '', suffix: '+' },
  { label: 'average coach monthly revenue', value: 180000, prefix: 'Rs ', suffix: '' },
];

const collaborators = [
  { name: 'Decathlon', logo: 'https://cdn.simpleicons.org/decathlon/0078d7' },
  { name: 'Nike', logo: 'https://cdn.simpleicons.org/nike/111111' },
  { name: 'Adidas', logo: 'https://cdn.simpleicons.org/adidas/111111' },
  { name: 'Under Armour', logo: 'https://cdn.simpleicons.org/underarmour/111111' },
  { name: 'Puma', logo: 'https://cdn.simpleicons.org/puma/111111' },
  { name: 'Reebok', logo: 'https://cdn.simpleicons.org/reebok/e41d1b' },
];

const testimonials = [
  {
    quote: 'FitQuest brought serious buyers who actually cared about transformation proof, not just cheap plans.',
    name: 'Aarav Mehta',
    role: 'Strength Coach',
    metric: 'Rs 2.4L earned in 90 days',
  },
  {
    quote: 'I picked my coach because I could compare diet plans, results, reviews, and communication style in one place.',
    name: 'Neha Patil',
    role: 'Athlete',
    metric: '8 kg fat loss with weekly reviews',
  },
  {
    quote: 'The platform made my service page feel premium. People started booking after seeing real proof and clear outcomes.',
    name: 'Priya Nair',
    role: 'Coach',
    metric: '36 active clients',
  },
];

const chatThreads = [
  {
    id: 'aarav',
    name: 'Aarav Mehta',
    avatar: 'AM',
    preview: 'I updated your bulk macros for next week.',
    time: '2m',
    messages: [
      { id: '1', from: 'them', text: 'I updated your bulk macros for next week. We are pushing carbs slightly higher.' },
      { id: '2', from: 'me', text: 'Perfect. I also uploaded my new progress shots.' },
      { id: '3', from: 'them', text: 'Saw them. Chest and shoulders are coming up nicely.' },
    ],
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    avatar: 'PN',
    preview: 'Sending a simpler office lunch plan.',
    time: '18m',
    messages: [
      { id: '1', from: 'them', text: 'Sending a simpler office lunch plan with easier protein options.' },
      { id: '2', from: 'me', text: 'Thank you, that makes the routine much easier.' },
    ],
  },
  {
    id: 'kabir',
    name: 'Kabir Singh',
    avatar: 'KS',
    preview: 'Your speed block starts tomorrow.',
    time: '1h',
    messages: [
      { id: '1', from: 'them', text: 'Your speed block starts tomorrow. Keep the recovery meal ready.' },
    ],
  },
];

const defaultCoachForm = {
  title: '',
  category: 'Fitness',
  goal: 'Muscle Gain',
  price: '2999',
  location: 'Mumbai',
  duration: '8 weeks',
  image: '',
  proofImages: '',
  description: '',
  expertise: 'Muscle Gain, Diet Planning, Accountability',
  dietPlan: 'Protein target, Meal timing, Grocery list',
  credentials: 'Certified Strength Coach, Nutrition Coach',
  coachBio: '',
  outcomes: 'Weekly check-ins, Form reviews, Progress tracking',
};

const landingShowcase = [
  {
    title: 'Transformation stories',
    stat: '+8.4 kg lean mass',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Diet proof boards',
    stat: '3,000 kcal muscle-gain plan',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Coach dashboard',
    stat: 'Rs 2.4L in 90 days',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
  },
];

const formatCompact = (value, prefix = '', suffix = '') => {
  const compact = new Intl.NumberFormat('en-IN', {
    notation: value >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 100000 ? 1 : 0,
  }).format(value);
  return `${prefix}${compact}${suffix}`;
};

const AnimatedStat = ({ value, prefix = '', suffix = '', label, className = '' }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    let start;
    const duration = 1400;

    const tick = (time) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div className={className}>
      <strong>{formatCompact(display, prefix, suffix)}</strong>
      <span>{label}</span>
    </div>
  );
};

const StarDisplay = ({ value, interactive = false, selected = 0, onSelect = () => {}, size = 18 }) => {
  const count = interactive ? selected : Math.round(value);
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={interactive ? 'star-button' : 'star-static'}
          onClick={interactive ? () => onSelect(star) : undefined}
        >
          <Star size={size} fill={star <= count ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
};

const SectionHeader = ({ eyebrow, title, copy, action }) => (
  <div className="section-header">
    <div>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
    {action}
  </div>
);

const Topbar = ({ page, setPage, experience, setTheme }) => {
  const { logout, theme, user } = useApp();
  return (
    <header className="topbar">
      <button className="brand" onClick={() => setPage('landing')}>
        <Dumbbell size={20} />
        <span>FitQuest India</span>
      </button>
      <nav>
        <button className={page === 'landing' ? 'active' : ''} onClick={() => setPage('landing')}>Platform</button>
        {experience === 'athlete' && <button className={page === 'athlete' ? 'active' : ''} onClick={() => setPage('athlete')}>Explore</button>}
        {experience === 'coach' && <button className={page === 'coach' ? 'active' : ''} onClick={() => setPage('coach')}>Coach Studio</button>}
      </nav>
      <div className="top-actions">
        {user && (
          <div className="user-chip">
            {user.image ? <img src={user.image} alt={user.name} /> : <UserRound size={16} />}
            <span>{user.name}</span>
          </div>
        )}
        {page !== 'landing' && (
          <button className="ghost-button" onClick={() => setPage('landing')}>
            <ArrowLeft size={16} /> Back
          </button>
        )}
        {user && (
          <button className="icon-button" onClick={logout} title="Sign out">
            <LogOut size={18} />
          </button>
        )}
        <button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

const LandingPage = ({ enterExperience }) => (
  <>
    <section className="landing-hero">
      <div className="landing-copy">
        <div className="eyebrow"><Sparkles size={16} /> Marketplace for athlete transformations and coach growth</div>
        <h1>One platform for discovering elite coaches and building a premium coaching business.</h1>
        <p>
          Athletes can compare proof, reviews, diets, pricing, and outcomes before committing. Coaches can publish
          services, show their transformations, track revenue, and grow a serious client base.
        </p>
        <div className="hero-actions">
          <button className="primary-button large" onClick={() => enterExperience('athlete')}>Get started as athlete</button>
          <button className="secondary-button large" onClick={() => enterExperience('coach')}>Get started as coach</button>
        </div>
        <div className="hero-microstats">
          <AnimatedStat value={50000} suffix="+" label="monthly athlete explorers" className="microstat" />
          <AnimatedStat value={240000} prefix="Rs " label="coach revenue in featured case study" className="microstat" />
        </div>
      </div>
      <div className="hero-visuals">
        <div className="visual-primary">
          <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80" alt="Coach helping athlete train" />
          <div className="visual-float float-left">
            <HandCoins size={18} />
            <div>
              <strong>Rs 1.8L</strong>
              <span>avg coach monthly revenue</span>
            </div>
          </div>
          <div className="visual-float float-right">
            <BadgeCheck size={18} />
            <div>
              <strong>18k+</strong>
              <span>verified proof uploads</span>
            </div>
          </div>
        </div>
        <div className="showcase-strip">
          {landingShowcase.map((item) => (
            <div className="showcase-card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div>
                <strong>{item.title}</strong>
                <span>{item.stat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="stats-band">
      {landingStats.map((item) => (
        <AnimatedStat key={item.label} value={item.value} prefix={item.prefix} suffix={item.suffix} label={item.label} className="stat-card stat-card-big" />
      ))}
    </section>

    <section className="content-section">
      <SectionHeader
        eyebrow="Why it works"
        title="Everything important is visible before the first chat."
        copy="The platform is designed to help athletes feel trust faster and help coaches convert higher quality leads."
      />
      <div className="feature-grid">
        <div className="feature-card">
          <Images size={20} />
          <h3>Proof-first listings</h3>
          <p>Transformation images, diet screenshots, outcomes, and training previews live directly on each service page.</p>
        </div>
        <div className="feature-card">
          <Star size={20} />
          <h3>Review-led decisions</h3>
          <p>Ratings and review breakdowns help athletes compare coaches the way they already do on trusted local platforms.</p>
        </div>
        <div className="feature-card">
          <TrendingUp size={20} />
          <h3>Coach growth tools</h3>
          <p>Coaches track earnings, active clients, listing performance, and can add new services whenever they want.</p>
        </div>
      </div>
    </section>

    <section className="content-section">
      <SectionHeader
        eyebrow="Coach experience"
        title="Coaches are turning proof into revenue."
        copy="The strongest service pages show clear outcomes, trusted reviews, and a polished brand."
      />
      <div className="testimonial-grid">
        {testimonials.map((item) => (
          <div className="testimonial-card" key={item.name}>
            <p>"{item.quote}"</p>
            <strong>{item.name}</strong>
            <span>{item.role}</span>
            <div className="testimonial-metric">{item.metric}</div>
          </div>
        ))}
      </div>
    </section>

    <section className="content-section">
      <SectionHeader
        eyebrow="Collaborators"
        title="Trusted by brands and teams that care about performance."
      />
      <div className="collaborator-row">
        {collaborators.map((item) => (
          <div className="collaborator-pill logo-pill" key={item.name}>
            <img src={item.logo} alt={item.name} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  </>
);

const FakeAuthModal = ({ role, onClose, onSuccess }) => {
  const { login } = useApp();
  const isCoach = role === 'coach';
  const demo = isCoach ? fakeUsers[1] : fakeUsers[0];
  const [form, setForm] = useState({ email: demo.email, password: demo.password, role: isCoach ? 'Seller' : 'Athlete' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const user = await login(form, 'login');
      onSuccess(user.role === 'Seller' ? 'coach' : 'athlete');
    } catch {
      setError('Use the demo credentials shown here. This is a fake login for the prototype.');
    }
  };

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.form className="auth-modal fake-auth" onSubmit={submit} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }}>
        <button type="button" className="icon-button close" onClick={onClose}><X size={18} /></button>
        <div className="auth-role-card">
          <div className="thread-avatar">{isCoach ? 'CO' : 'AT'}</div>
          <div>
            <span className="eyebrow">{isCoach ? 'Coach login' : 'Athlete login'}</span>
            <h2>{isCoach ? 'Open your coach studio' : 'Start exploring trusted coaches'}</h2>
            <p>{isCoach ? 'Manage services, proof, revenue, and active clients.' : 'Browse programs, compare reviews, and chat with coaches.'}</p>
          </div>
        </div>
        <label>Email</label>
        <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <label>Password</label>
        <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <div className="demo-credentials">
          <strong>Demo account</strong>
          <span>{demo.email} / {demo.password}</span>
        </div>
        {error && <p className="error">{error}</p>}
        <button className="primary-button full">Continue</button>
      </motion.form>
    </motion.div>
  );
};

const ServiceCard = ({ service, onOpen }) => (
  <motion.button className="service-card interactive" whileHover={{ y: -6 }} onClick={() => onOpen(service)}>
    <img src={service.image} alt={service.title} />
    <div className="service-overlay">
      <span className="goal-pill">{service.goal}</span>
      <div className="service-proof-badge"><Images size={14} /> {service.proofGallery.length} proofs</div>
    </div>
    <div className="service-body">
      <div className="service-headline">
        <div>
          <h3>{service.title}</h3>
          <div className="coach-mini">
            <img src={service.coachId?.image} alt={service.coachId?.name} />
            <span>{service.coachId?.name}</span>
            {service.coachId?.verified && <BadgeCheck size={14} />}
          </div>
        </div>
        <strong>{formatPrice(service.price)}</strong>
      </div>
      <p className="service-description">{service.description}</p>
      <div className="tag-row">
        {service.expertise.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </div>
      <div className="card-footer">
        <div className="rating-inline">
          <Star size={14} fill="currentColor" />
          <span>{service.rating}</span>
          <small>({service.reviewCount} reviews)</small>
        </div>
        <span className="cta-link">View full proof <ChevronRight size={14} /></span>
      </div>
    </div>
  </motion.button>
);

const AthletePage = ({ openService, goChat }) => {
  const { services, fetchServices } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [goal, setGoal] = useState('All Goals');

  useEffect(() => {
    fetchServices({});
  }, []);

  const filtered = useMemo(() => services.filter((service) => {
    const haystack = `${service.title} ${service.description} ${service.goal} ${service.location} ${(service.expertise || []).join(' ')}`.toLowerCase();
    return (
      haystack.includes(query.toLowerCase()) &&
      (category === 'All' || service.category === category) &&
      (goal === 'All Goals' || service.goal === goal)
    );
  }), [services, query, category, goal]);

  return (
    <section className="content-section athlete-page">
      <SectionHeader
        eyebrow="Athlete interface"
        title="Find the right coach through proof, outcomes, and reviews."
        copy="Search by goal, compare offerings, and open a complete service page before you commit."
        action={<button className="secondary-button" onClick={goChat}><MessageCircle size={16} /> Open chats</button>}
      />
      <div className="athlete-layout">
        <aside className="filters">
          <div className="panel-title"><Search size={18} /> Search and filter</div>
          <label>Search</label>
          <div className="searchbox"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Muscle gain, cricket, meal plan" /></div>
          <label>Category</label>
          <div className="segments">
            {categories.map((item) => (
              <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
          <label>Goal</label>
          <div className="segments">
            {goals.map((item) => (
              <button key={item} className={goal === item ? 'selected' : ''} onClick={() => setGoal(item)}>{item}</button>
            ))}
          </div>
        </aside>
        <div>
          <div className="proof-strip">
            <div>
              <Flame size={18} />
              <strong>Muscle gain coaches</strong>
              <span>Bulk plans, progressive overload, and meal timing</span>
            </div>
            <div>
              <Target size={18} />
              <strong>Transformation proof</strong>
              <span>See visual results, diet snapshots, and week-by-week outcomes</span>
            </div>
            <div>
              <ShieldCheck size={18} />
              <strong>Review-backed trust</strong>
              <span>Use ratings and detailed feedback before reaching out</span>
            </div>
          </div>
          <div className="service-grid">
            {filtered.map((service) => <ServiceCard key={service._id} service={service} onOpen={openService} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

const CoachPage = () => {
  const { createService, services, user } = useApp();
  const [form, setForm] = useState(defaultCoachForm);

  const myServices = services.slice(0, 4);
  const activeClients = myServices.reduce((sum, service) => sum + (service.coachId?.clients || 18), 0);
  const revenue = myServices.reduce((sum, service) => sum + (service.coachId?.revenue || service.price * 12), 0);
  const avgRating = (myServices.reduce((sum, service) => sum + service.rating, 0) / myServices.length).toFixed(1);

  const handleSubmit = (event) => {
    event.preventDefault();
    createService({
      ...form,
      image: form.image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
      coachBio: form.coachBio || 'Coach profile updated with service proof and outcomes.',
    });
    setForm(defaultCoachForm);
  };

  return (
    <section className="content-section coach-page">
      <SectionHeader
        eyebrow="Coach studio"
        title="A command center for proof, services, clients, and money."
        copy="Publish believable offers, track demand, and keep your coaching profile looking premium."
      />
      <div className="coach-hero">
        <div className="coach-profile-card">
          <img src={user?.image || myServices[0]?.coachId?.image} alt={user?.name || 'Coach'} />
          <div>
            <span className="eyebrow">Verified coach account</span>
            <h2>{user?.name || 'Demo Coach'}</h2>
            <p>Strength and transformation coach with a proof-first service page, active buyers, and growing monthly revenue.</p>
            <div className="tag-row">
              <span className="tag"><CheckCircle2 size={14} /> Verified profile</span>
              <span className="tag"><Images size={14} /> 24 proof posts</span>
              <span className="tag"><MessageCircle size={14} /> 17 unread leads</span>
            </div>
          </div>
        </div>
        <div className="coach-score-card">
          <strong>{avgRating}</strong>
          <StarDisplay value={Number(avgRating)} />
          <span>Average service rating</span>
        </div>
      </div>
      <div className="metrics">
        <div className="stat"><Users size={18} /><span>Active clients</span><strong>{activeClients}</strong></div>
        <div className="stat"><WalletCards size={18} /><span>Money made</span><strong>{formatPrice(revenue)}</strong></div>
        <div className="stat"><Eye size={18} /><span>Listing views</span><strong>14.2k</strong></div>
      </div>
      <div className="coach-layout">
        <div className="coach-left-stack">
          <div className="list-panel">
            <h3>Your listed services</h3>
            {myServices.map((service) => (
              <div className="service-manager-card" key={service._id}>
                <img src={service.image} alt={service.title} />
                <div>
                  <strong>{service.title}</strong>
                  <p>{service.goal} · {service.location}</p>
                  <div className="manager-meta">
                    <span>{formatPrice(service.price)}</span>
                    <span>{service.reviewCount} reviews</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="list-panel">
            <h3>Client pipeline</h3>
            {['New lead: Rohit wants muscle gain', 'Megha uploaded progress photos', 'Nikhil asked for vegetarian bulk plan'].map((item) => (
              <div className="manager-row stacked" key={item}>
                <div>
                  <strong>{item}</strong>
                  <p>High intent buyer activity</p>
                </div>
                <span>Today</span>
              </div>
            ))}
          </div>
        </div>
        <form className="coach-form" onSubmit={handleSubmit}>
          <div className="panel-title"><ImagePlus size={18} /> Add a new service</div>
          <p className="form-intro">Use a clear promise, real proof images, and a diet outline. The new service appears instantly in the athlete marketplace.</p>
          <div className="form-grid">
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Service title" required />
            <input value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Price" required />
            <input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Location" required />
            <input value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} placeholder="Duration" required />
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {categories.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value })}>
              {goals.filter((item) => item !== 'All Goals').map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe the program, transformation style, and support" required />
          <textarea value={form.coachBio} onChange={(event) => setForm({ ...form, coachBio: event.target.value })} placeholder="Coach bio" />
          <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="Cover image URL" />
          <input value={form.proofImages} onChange={(event) => setForm({ ...form, proofImages: event.target.value })} placeholder="Proof image URLs separated by commas" />
          <input value={form.expertise} onChange={(event) => setForm({ ...form, expertise: event.target.value })} placeholder="Expertise separated by commas" />
          <input value={form.dietPlan} onChange={(event) => setForm({ ...form, dietPlan: event.target.value })} placeholder="Diet highlights separated by commas" />
          <input value={form.credentials} onChange={(event) => setForm({ ...form, credentials: event.target.value })} placeholder="Credentials separated by commas" />
          <input value={form.outcomes} onChange={(event) => setForm({ ...form, outcomes: event.target.value })} placeholder="Program outcomes separated by commas" />
          <button className="primary-button full"><Plus size={16} /> Publish service</button>
        </form>
      </div>
    </section>
  );
};

const ReviewsPanel = ({ service, selectedRating, onRatingChange, reviewText, onTextChange, submitReview }) => {
  const counts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: (service.reviews || []).filter((review) => review.rating === rating).length,
  }));
  const maxCount = Math.max(1, ...counts.map((item) => item.count));

  return (
    <div className="reviews-panel">
      <div className="reviews-summary">
        <div>
          <strong>{service.rating.toFixed(1)}</strong>
          <StarDisplay value={service.rating} />
          <span>{service.reviewCount} reviews</span>
        </div>
        <div className="ratings-breakdown">
          {counts.map((item) => (
            <div className="rating-row" key={item.rating}>
              <span>{item.rating}</span>
              <div className="rating-bar"><div style={{ width: `${(item.count / maxCount) * 100}%` }} /></div>
              <small>{item.count}</small>
            </div>
          ))}
        </div>
      </div>
      <form className="review-compose" onSubmit={submitReview}>
        <label>Your review</label>
        <StarDisplay interactive selected={selectedRating} onSelect={onRatingChange} size={20} />
        <textarea value={reviewText} onChange={(event) => onTextChange(event.target.value)} placeholder="Share what the coach did well, what changed, and how the plan felt." />
        <button className="primary-button">Post review</button>
      </form>
    </div>
  );
};

const ServiceModal = ({ service, onClose, openChat }) => {
  const { addReview, bookService } = useApp();
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [bookingText, setBookingText] = useState('Start this plan');

  const submitReview = async (event) => {
    event.preventDefault();
    if (!reviewText.trim()) return;
    await addReview(service._id, { rating: selectedRating, comment: reviewText });
    setReviewText('');
    setSelectedRating(5);
  };

  const startPlan = async () => {
    setBookingText('Processing...');
    await new Promise((resolve) => setTimeout(resolve, 700));
    await bookService(service);
    setBookingText('Plan unlocked');
  };

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="service-modal" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }}>
        <button className="icon-button close" onClick={onClose}><X size={18} /></button>
        <div className="modal-hero">
          <img src={service.image} alt={service.title} />
          <div className="modal-intro">
            <span className="eyebrow">{service.goal} · {service.location}</span>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <div className="tag-row">
              {(service.expertise || []).map((item) => <span className="tag" key={item}>{item}</span>)}
            </div>
            <div className="detail-stats">
              <div className="stat"><CircleDollarSign size={18} /><span>Price</span><strong>{formatPrice(service.price)}</strong></div>
              <div className="stat"><CalendarClock size={18} /><span>Duration</span><strong>{service.duration}</strong></div>
              <div className="stat"><Star size={18} /><span>Rating</span><strong>{service.rating}</strong></div>
            </div>
            <div className="hero-actions">
              <button className="primary-button" onClick={startPlan}>{bookingText}</button>
              <button className="secondary-button" onClick={openChat}><MessageCircle size={16} /> Chat with coach</button>
            </div>
          </div>
        </div>

        <div className="modal-sections">
          <div className="info-card">
            <h3>Coach and outcomes</h3>
            <div className="coach-block">
              <ShieldCheck size={18} />
              <div>
                <div className="coach-modal-title">
                  <img src={service.coachId?.image} alt={service.coachId?.name} />
                  <strong>{service.coachId?.name}</strong>
                  {service.coachId?.verified && <BadgeCheck size={16} />}
                </div>
                <p>{service.coachId?.bio}</p>
              </div>
            </div>
            <div className="list-chips">
              {(service.coachId?.credentials || []).map((item) => <span className="diet-chip" key={item}>{item}</span>)}
            </div>
            <div className="list-chips">
              {(service.outcomes || ['Weekly check-ins', 'Diet adjustments', 'Progress tracking']).map((item) => <span className="diet-chip" key={item}>{item}</span>)}
            </div>
          </div>

          <div className="info-card">
            <h3>Proof and diet details</h3>
            <div className="proof-gallery">
              {(service.proofGallery || []).map((proof) => (
                <div className="proof-card" key={proof.label}>
                  <img src={proof.image} alt={proof.label} />
                  <span>{proof.label}</span>
                </div>
              ))}
            </div>
            <div className="diet-list">
              {(service.dietPlan || []).map((item) => <span className="diet-chip" key={item}>{item}</span>)}
            </div>
          </div>
        </div>

        <ReviewsPanel
          service={service}
          selectedRating={selectedRating}
          onRatingChange={setSelectedRating}
          reviewText={reviewText}
          onTextChange={setReviewText}
          submitReview={submitReview}
        />

        <div className="review-list">
          {(service.reviews || []).map((review) => (
            <div className="review-card" key={review._id}>
              <div className="review-head">
                <strong>{review.athleteId?.name}</strong>
                <StarDisplay value={review.rating} />
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ChatPage = () => {
  const [threads, setThreads] = useState(chatThreads);
  const [activeThreadId, setActiveThreadId] = useState(chatThreads[0].id);
  const [draft, setDraft] = useState('');
  const active = threads.find((thread) => thread.id === activeThreadId);

  const sendMessage = () => {
    if (!draft.trim()) return;
    setThreads((current) =>
      current.map((thread) =>
        thread.id === activeThreadId
          ? {
              ...thread,
              preview: draft,
              time: 'now',
              messages: [...thread.messages, { id: `${Date.now()}`, from: 'me', text: draft }],
            }
          : thread
      )
    );
    setDraft('');
  };

  return (
    <section className="content-section">
      <SectionHeader eyebrow="Coach chat" title="Instagram-style direct messages" copy="All chats on the left, active conversation on the right." />
      <div className="chat-shell instagram-chat">
        <aside className="chat-list">
          {threads.map((thread) => (
            <button key={thread.id} className={thread.id === activeThreadId ? 'thread-row selected' : 'thread-row'} onClick={() => setActiveThreadId(thread.id)}>
              <div className="thread-avatar">{thread.avatar}</div>
              <div className="thread-meta">
                <strong>{thread.name}</strong>
                <span>{thread.preview}</span>
              </div>
              <small>{thread.time}</small>
            </button>
          ))}
        </aside>
        <div className="chat-window">
          <div className="chat-header">
            <div className="thread-avatar">{active.avatar}</div>
            <div>
              <strong>{active.name}</strong>
              <span>{active.preview}</span>
            </div>
          </div>
          <div className="message-feed">
            {active.messages.map((message) => (
              <div className={message.from === 'me' ? 'bubble user' : 'bubble coach'} key={message.id}>{message.text}</div>
            ))}
          </div>
          <div className="composer">
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Message..." onKeyDown={(event) => { if (event.key === 'Enter') sendMessage(); }} />
            <button className="send-button" onClick={sendMessage}><ArrowUp size={16} /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Shell = () => {
  const { setTheme } = useApp();
  const [page, setPage] = useState('landing');
  const [experience, setExperience] = useState('athlete');
  const [authRole, setAuthRole] = useState('athlete');
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const enterExperience = (role) => {
    setAuthRole(role);
    setAuthOpen(true);
  };

  const finishAuth = (role) => {
    setExperience(role);
    setPage(role === 'coach' ? 'coach' : 'athlete');
    setAuthOpen(false);
  };

  return (
    <>
      <Topbar page={page} setPage={setPage} experience={experience} setTheme={setTheme} />
      <main>
        {page === 'landing' && <LandingPage enterExperience={enterExperience} />}
        {page === 'athlete' && <AthletePage openService={setSelectedService} goChat={() => setPage('chat')} />}
        {page === 'coach' && <CoachPage />}
        {page === 'chat' && <ChatPage />}
      </main>
      <AnimatePresence>
        {authOpen && <FakeAuthModal role={authRole} onClose={() => setAuthOpen(false)} onSuccess={finishAuth} />}
        {selectedService && <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} openChat={() => setPage('chat')} />}
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
