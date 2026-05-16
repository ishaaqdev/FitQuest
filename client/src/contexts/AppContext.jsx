import React from 'react';
import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fakeUsers, sampleServices } from '../data/sampleServices.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AppContext = createContext(null);

const normalizeRole = (role) => (role === 'Coach' ? 'Seller' : role || 'Athlete');
const serializeRole = (role) => (role === 'Seller' ? 'Coach' : role);

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('fq-theme') || 'dark');
  const [user, setUser] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('fq-user') || 'null');
    return stored ? { ...stored, role: normalizeRole(stored.role) } : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('fq-token') || '');
  const [services, setServices] = useState(sampleServices);
  const [bookings, setBookings] = useState([]);

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: API_URL });
    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return instance;
  }, [token]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('fq-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) localStorage.setItem('fq-user', JSON.stringify(user));
    else localStorage.removeItem('fq-user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('fq-token', token);
    else localStorage.removeItem('fq-token');
  }, [token]);

  const fetchServices = async (params = {}) => {
    try {
      const { data } = await api.get('/services', { params });
      setServices(data.length ? data.map((service) => ({
        ...service,
        goal: service.goal || 'Muscle Gain',
        expertise: service.expertise || ['Training', 'Diet'],
        dietPlan: service.dietPlan || ['Protein goal', 'Hydration', 'Meal rhythm'],
        proofGallery: service.proofGallery || [],
        coachId: service.coachId ? { ...service.coachId, role: normalizeRole(service.coachId.role) } : service.coachId,
      })) : sampleServices);
    } catch {
      setServices(sampleServices);
    }
  };

  const login = async (payload, mode) => {
    const requestedRole = normalizeRole(payload.role);
    const fakeUser = fakeUsers.find((account) => account.email === payload.email && account.password === payload.password);

    if (fakeUser || payload.email === 'demo@fitquest.in' || payload.email === 'seller@fitquest.in') {
      const demoRole = normalizeRole(fakeUser?.role || (payload.email === 'seller@fitquest.in' || requestedRole === 'Seller' ? 'Seller' : 'Athlete'));
      const demo = {
        id: demoRole.toLowerCase(),
        name: fakeUser?.name || (demoRole === 'Seller' ? 'Demo Coach' : 'Demo Athlete'),
        email: payload.email,
        image: fakeUser?.image,
        role: demoRole,
      };
      setUser(demo);
      setToken('demo-token');
      return demo;
    }

    if (mode === 'register' && !token) {
      const localAccount = {
        id: `local-${Date.now()}`,
        name: payload.name || (requestedRole === 'Seller' ? 'New Seller' : 'New Athlete'),
        email: payload.email,
        role: requestedRole || 'Athlete',
      };
      setUser(localAccount);
      setToken('local-demo-token');
      return localAccount;
    }

    const outbound = { ...payload, role: serializeRole(payload.role) };
    const { data } = await api.post(`/auth/${mode}`, outbound);
    const normalizedUser = { ...data.user, role: normalizeRole(data.user.role) };
    setUser(normalizedUser);
    setToken(data.token);
    return normalizedUser;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    setBookings([]);
  };

  const bookService = async (service) => {
    const fallbackBooking = {
      _id: `booking-${Date.now()}`,
      serviceId: service,
      amount: service.price,
      status: 'Confirmed',
      paymentId: `FQI-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (!token || token === 'demo-token' || token === 'local-demo-token' || service._id.startsWith('svc-')) {
      setBookings((current) => [fallbackBooking, ...current]);
      return fallbackBooking;
    }

    const { data } = await api.post('/interactions/book', { serviceId: service._id });
    setBookings((current) => [data, ...current]);
    return data;
  };

  const addReview = async (serviceId, review) => {
    const localReview = {
      _id: `review-${Date.now()}`,
      ...review,
      athleteId: { name: user?.name || 'Guest Athlete' },
    };
    setServices((current) =>
      current.map((service) =>
        service._id === serviceId
          ? {
              ...service,
              reviews: [localReview, ...(service.reviews || [])],
              reviewCount: (service.reviewCount || 0) + 1,
              rating: Number(((service.rating + Number(review.rating)) / 2).toFixed(1)),
            }
          : service
      )
    );

    if (token && token !== 'demo-token' && token !== 'local-demo-token' && !String(serviceId).startsWith('svc-')) {
      await api.post('/interactions/review', { serviceId, ...review });
    }
  };

  const createService = (payload) => {
    const proofGallery = (payload.proofImages || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((image, index) => ({
        label: index === 0 ? 'Transformation Proof' : index === 1 ? 'Diet Proof' : `Proof ${index + 1}`,
        image,
      }));

    const expertise = (payload.expertise || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const dietPlan = (payload.dietPlan || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const service = {
      _id: `svc-${Date.now()}`,
      title: payload.title,
      category: payload.category,
      price: Number(payload.price),
      rating: 5,
      reviewCount: 0,
      location: payload.location,
      duration: payload.duration,
      image: payload.image,
      goal: payload.goal,
      expertise,
      description: payload.description,
      dietPlan,
      proofGallery,
      reviews: [],
      coachId: {
        name: user?.name || 'Coach',
        image: user?.image || 'https://i.pravatar.cc/240?img=12',
        bio: payload.coachBio,
        credentials: (payload.credentials || '').split(',').map((item) => item.trim()).filter(Boolean),
        followers: '0',
        clients: 0,
        revenue: 0,
        verified: false,
      },
      outcomes: (payload.outcomes || '').split(',').map((item) => item.trim()).filter(Boolean),
    };

    setServices((current) => [service, ...current]);
    return service;
  };

  return (
    <AppContext.Provider
      value={{
        addReview,
        api,
        bookings,
        bookService,
        createService,
        fetchServices,
        login,
        logout,
        setUser,
        services,
        setServices,
        setTheme,
        theme,
        token,
        user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
