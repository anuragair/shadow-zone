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

        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ message: 'Email and password are required' });
        }

        console.log('Checking for existing user:', email);
        // Check if user already exists
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate and store OTP
        const otp = generateOTP();
        console.log('Generated OTP for:', email);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        otpStore.set(email, {
            otp,
            password: hashedPassword,
            timestamp: Date.now()
        });

        // Send OTP via email
        console.log('Attempting to send OTP email to:', email);
        const emailSent = await sendOTPEmail(email, otp);
        
        if (!emailSent) {
            console.error('Failed to send OTP email to:', email);
            return res.status(500).json({ 
                message: 'Failed to send OTP. Please check your email address or try again later.'
            });
        }

        console.log('OTP sent successfully to:', email);
        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error in signup:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({ message: 'Database connection failed' });
        }
        res.status(500).json({ 
            message: 'An error occurred during signup. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check database connection
        try {
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

            // Generate OTP for signin
            const otp = generateOTP();
            
            // Store OTP for verification
            otpStore.set(email, {
                otp,
                userId: user.id,
                timestamp: Date.now()
            });

            // Send OTP via email
            const emailSent = await sendOTPEmail(email, otp);
            if (!emailSent) {
                console.error('Failed to send OTP email');
                return res.status(500).json({ message: 'Failed to send OTP' });
            }

            res.json({ message: 'OTP sent to your email' });
        } catch (dbError) {
            console.error('Database error:', dbError);
            return res.status(500).json({ message: 'Database error occurred' });
        }
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