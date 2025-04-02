import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ;
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables.");
}

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}; 