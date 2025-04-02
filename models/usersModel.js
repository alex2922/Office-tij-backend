export class userModel {
    constructor(user) {
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
        this.otp_code = user.otp_code || null; // OTP will be null by default
        this.otp_expires_at = user.otp_expires_at || null; // OTP expiration
        this.is_verified = user.is_verified || false; // New users are unverified by default
    }
}
