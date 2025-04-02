import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

if (!secretKey) {
    throw new Error("Jwwt Error");
}

// Middleware to authenticate user
export const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            error: "No token provided",
        });
    }

    const tokenString = token.split(" ")[1];

    try {
        const decoded = jwt.verify(tokenString, secretKey);
        req.user = decoded; // Attach user data to request object
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                error: "Token has expired",
            });
        }
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            error: "Invalid token",
        });
    }
};
