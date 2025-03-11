// signup.js

document.getElementById('signupForm').addEventListener('submit', function(e) {
    console.log('Form submitted');
    e.preventDefault(); // Prevent the default form submission

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

    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.some(user => user.emailOrPhone === emailOrPhone)) {
        alert('This email/phone is already registered.');
        return;
    }

    // Add new user
    users.push({
        emailOrPhone: emailOrPhone,
        password: password  // In a real app, this should be hashed
    });

    // Save updated users array
    localStorage.setItem('users', JSON.stringify(users));

    alert('Sign up successful! You can now sign in.');
    window.location.href = 'signin.html';
});