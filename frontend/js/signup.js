// signup.js

document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const emailOrPhone = document.getElementById('emailOrPhone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Basic validation
    if (emailOrPhone === '' || password === '' || confirmPassword === '') {
        alert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    try {
        // Determine if input is email or phone
        const isEmail = emailOrPhone.includes('@');
        const userData = {
            [isEmail ? 'email' : 'phone']: emailOrPhone,
            password: password
        };

        const response = await fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        alert('Sign up successful! You can now sign in.');
        window.location.href = 'signin.html';
    } catch (error) {
        alert(error.message || 'An error occurred during registration.');
    }
});