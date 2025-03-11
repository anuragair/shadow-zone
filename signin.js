// signin.js

document.getElementById('signinForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    const emailOrPhone = document.getElementById('emailOrPhone').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (emailOrPhone === '' || password === '') {
        alert('Please fill in all fields.');
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Find user with matching credentials
    const user = users.find(u => u.emailOrPhone === emailOrPhone && u.password === password);

    if (!user) {
        alert('Invalid email/phone or password.');
        return;
    }

    // Login successful
    console.log('Signing in with:', emailOrPhone);
    
    // Store user session
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', emailOrPhone);

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
});
