const nodemailer = require('nodemailer');

// Create a test account using Ethereal (for development)
const createTestAccount = async () => {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

// In production, you would use your actual email service
const createProductionTransport = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendOTPEmail = async (email, otp) => {
    try {
        // Use test account for development
        const transporter = await createTestAccount();
        
        const info = await transporter.sendMail({
            from: '"Shadow Zone" <noreply@shadowzone.com>',
            to: email,
            subject: "Your OTP for Shadow Zone",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Shadow Zone Authentication</h2>
                    <p>Your one-time password (OTP) is:</p>
                    <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this OTP, please ignore this email.</p>
                </div>
            `,
        });

        console.log("Email sent: %s", info.messageId);
        // For development: Log URL where you can preview the email
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = {
    sendOTPEmail
}; 