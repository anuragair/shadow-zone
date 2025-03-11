// otpService.js

class OTPService {
    constructor() {
        this.otpStorage = new Map();
    }

    // Generate a 6-digit OTP
    generateOTP(phoneNumber) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        this.otpStorage.set(phoneNumber, {
            code: otp,
            timestamp: Date.now(),
            attempts: 0
        });
        return otp;
    }

    // Verify OTP
    verifyOTP(phoneNumber, userOTP) {
        const otpData = this.otpStorage.get(phoneNumber);
        
        if (!otpData) {
            return { valid: false, message: 'No OTP found for this number' };
        }

        // Check if OTP is expired (5 minutes validity)
        if (Date.now() - otpData.timestamp > 5 * 60 * 1000) {
            this.otpStorage.delete(phoneNumber);
            return { valid: false, message: 'OTP has expired' };
        }

        // Check attempts
        if (otpData.attempts >= 3) {
            this.otpStorage.delete(phoneNumber);
            return { valid: false, message: 'Too many attempts. Please request a new OTP' };
        }

        // Increment attempts
        otpData.attempts++;
        this.otpStorage.set(phoneNumber, otpData);

        // Verify OTP
        if (otpData.code === parseInt(userOTP)) {
            this.otpStorage.delete(phoneNumber);
            return { valid: true, message: 'OTP verified successfully' };
        }

        return { valid: false, message: 'Invalid OTP' };
    }

    // Send OTP (mock implementation - in real app, this would integrate with SMS service)
    async sendOTP(phoneNumber) {
        const otp = this.generateOTP(phoneNumber);
        console.log(`Mock SMS: Your OTP is ${otp}`); // In production, replace with actual SMS service
        return true;
    }
}

// Export the service
const otpService = new OTPService();
export default otpService;
