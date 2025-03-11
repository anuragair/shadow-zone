// signup.js

import config from './config.js';

const signupForm = document.getElementById('signupForm');
const otpForm = document.getElementById('otpForm');
const signupError = document.getElementById('signupError');
const signupSuccess = document.getElementById('signupSuccess');
const otpError = document.getElementById('otpError');
let userEmail = '';

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${config.API_URL}/users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }

        userEmail = email;
        signupSuccess.textContent = 'OTP sent to your email';
        signupForm.style.display = 'none';
        otpForm.style.display = 'block';
    } catch (error) {
        signupError.textContent = error.message;
    }
});

otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const otp = document.getElementById('otp').value;

    try {
        const response = await fetch(`${config.API_URL}/users/verify-signup`, {
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