import rateLimit from 'express-rate-limit';

// Standard general API limiter: 300 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Strict Auth Limiter: 25 attempts per 15 minutes (protects login and register against brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many login/registration attempts from this IP. Please try again after 15 minutes.'
  }
});

// Order Creation Limiter: 30 orders per 15 minutes (prevents bot checkout flooding)
export const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many order requests. Please wait a few moments before trying again.'
  }
});
