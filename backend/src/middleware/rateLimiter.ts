import rateLimit from 'express-rate-limit';

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth rate limiter (more restrictive)
export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 auth requests per windowMs
  message: {
    error: 'Trop de tentatives d\'authenfication, veuillez réessayer plus tard'
  },
  standardHeaders: true,
  legacyHeaders: false
});