import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fitquest-dev-secret');
      
      req.user = decoded; // Contains id and role from token
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const coachOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Coach') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a Coach' });
  }
};
