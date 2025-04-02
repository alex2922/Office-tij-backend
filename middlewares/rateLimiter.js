import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        error: 'Rate Limit Exceeded'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter limiter for authentication routes
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 login attempts per hour
    message: {
        success: false,
        message: 'Too many login attempts, please try again later.',
        error: 'Rate Limit Exceeded'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Custom limiter for specific routes
export const createCustomLimiter = (windowMs, max) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message: 'Too many requests, please try again later.',
            error: 'Rate Limit Exceeded'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
}; 