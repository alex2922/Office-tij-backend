// Custom error classes
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

export class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = 500;
    }
}

export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

export class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode = 401;
    }
}

// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Handle known errors
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: 'Validation Error'
        });
    }

    if (err instanceof DatabaseError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: 'Database Error'
        });
    }

    if (err instanceof NotFoundError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: 'Not Found'
        });
    }

    if (err instanceof AuthenticationError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: 'Authentication Error'
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: 'Authentication Error'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired',
            error: 'Authentication Error'
        });
    }

    // Handle unknown errors
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Unknown Error'
    });
}; 