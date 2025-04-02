import { database } from "../db/config.js";
import crypto from "crypto"; 

export const generateOTP = async (email) => {
    try {
        // Generate a random 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        
        // Set expiry time (current time + 10 minutes)
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 10);
        
        // Update the database with OTP
        await database.query(
            "UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE email = ?",
            [otp, expiryTime, email]
        );

        return otp; // We will use this to send via email
    } catch (error) {
        throw new Error(`Failed to generate OTP: ${error.message}`);
    }
};
