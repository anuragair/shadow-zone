// signup.js

import config from './config.js';

const signupForm = document.getElementById('signupForm');
const otpForm = document.getElementById('otpForm');
const signupError = document.getElementById('signupError');
const signupSuccess = document.getElementById('signupSuccess');
const otpError = document.getElementById('otpError');
let userEmail = '';

// Password visibility toggle
document.querySelector('.toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Reset error messages
    signupError.textContent = '';
    signupSuccess.textContent = '';

    // Validate input
    if (!validateEmail(email)) {
        signupError.textContent = 'Please enter a valid email address';
        return;
    }

    if (!validatePassword(password)) {
        signupError.textContent = 'Password must be at least 6 characters long';
        return;
    }

    try {
        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitButton.disabled = true;
        
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
        
        // Smooth transition between forms
        signupForm.style.opacity = '0';
        setTimeout(() => {
            signupForm.style.display = 'none';
            otpForm.style.display = 'block';
            setTimeout(() => {
                otpForm.classList.add('visible');
                document.getElementById('otp').focus();
            }, 50);
        }, 300);
    } catch (error) {
        signupSuccess.textContent = '';
        signupError.textContent = error.message;
    } finally {
        const submitButton = signupForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});

otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const otp = document.getElementById('otp').value.trim();

    // Validate OTP
    if (!/^\d{6}$/.test(otp)) {
        otpError.textContent = 'Please enter a valid 6-digit code';
        return;
    }

    try {
        otpError.textContent = '';
        const submitButton = otpForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        submitButton.disabled = true;

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

        // Store the token and redirect to dashboard
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard.html';
    } catch (error) {
        otpError.textContent = error.message;
    } finally {
        const submitButton = otpForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});