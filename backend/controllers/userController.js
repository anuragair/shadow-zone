const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendOTPEmail } = require('../utils/emailService');

// Store OTPs temporarily (in production, use Redis or a database)
const otpStore = new Map();

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate and store OTP
        const otp = generateOTP();
        otpStore.set(email, {
            otp,
            password: await bcrypt.hash(password, 10),
            timestamp: Date.now()
        });

        // Send OTP via email
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP' });
        }

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const storedData = otpStore.get(email);

        if (!storedData) {
            return res.status(400).json({ message: 'OTP expired or invalid' });
        }

        // Check if OTP is expired (10 minutes)
        if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP expired' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Create user in database
        const [result] = await db.query(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, storedData.password]
        );

        // Generate JWT token
        const token = jwt.sign(
            { id: result.insertId, email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Clear OTP data
        otpStore.delete(email);

        res.json({ token });
    } catch (error) {
        console.error('Error in verifyOTP:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Generate and send OTP for signin
        const otp = generateOTP();
        
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Store OTP for verification
        otpStore.set(email, {
            otp,
            userId: user.id,
            timestamp: Date.now()
        });

        // Send OTP via email
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP' });
        }

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error in signin:', error);
        res.status(500).json({ message: 'Error signing in' });
    }
};

const verifySigninOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const storedData = otpStore.get(email);

        if (!storedData) {
            return res.status(400).json({ message: 'OTP expired or invalid' });
        }

        // Check if OTP is expired (10 minutes)
        if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP expired' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: storedData.userId, email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Clear OTP data
        otpStore.delete(email);

        res.json({ token });
    } catch (error) {
        console.error('Error in verifySigninOTP:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
};

module.exports = {
    signup,
    signin,
    verifyOTP,
    verifySigninOTP
}; 