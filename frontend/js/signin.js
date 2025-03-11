// signin.js

document.getElementById('signinForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const emailOrPhone = document.getElementById('emailOrPhone').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (emailOrPhone === '' || password === '') {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailOrPhone: emailOrPhone,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert(error.message || 'An error occurred during login.');
    }
});
