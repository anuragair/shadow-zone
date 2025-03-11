// signin.js

import config from './config.js';

const signinForm = document.getElementById('signinForm');
const otpForm = document.getElementById('otpForm');
const signinError = document.getElementById('signinError');
const signinSuccess = document.getElementById('signinSuccess');
const otpError = document.getElementById('otpError');
let userEmail = '';

signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${config.API_URL}/users/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Signin failed');
        }

        userEmail = email;
        signinSuccess.textContent = 'OTP sent to your email';
        signinForm.style.display = 'none';
        otpForm.style.display = 'block';
    } catch (error) {
        signinError.textContent = error.message;
    }
});

otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const otp = document.getElementById('otp').value;

    try {
        const response = await fetch(`${config.API_URL}/users/verify-signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: userEmail, otp })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'OTP verification failed');
        }

        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard.html';
    } catch (error) {
        otpError.textContent = error.message;
    }
});
