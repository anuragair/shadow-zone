// Auth0 configuration
let auth0Client = null;

// Initialize Auth0 client
async function initializeAuth0() {
    auth0Client = await createAuth0Client({
        domain: 'dev-2d67b8khfvv4gi3r.us.auth0.com',
        client_id: 'fxLq0MdyEHshCX8hRgczuLXosn9xq3db',
        redirect_uri: 'https://shadowzone.netlify.app/callback'
    });

    // Check if user was redirected after login
    if (window.location.search.includes("code=")) {
        try {
            // Handle the redirect and get the user
            await auth0Client.handleRedirectCallback();
            const user = await auth0Client.getUser();
            console.log("User logged in:", user);
            
            // Store auth state
            localStorage.setItem('isLoggedIn', 'true');
            
            // Redirect to dashboard or home page
            window.location.href = '/dashboard.html';
        } catch (error) {
            console.error("Error handling redirect:", error);
        }
    }

    updateUI();
}

// Update UI based on authentication state
async function updateUI() {
    try {
        const isAuthenticated = await auth0Client.isAuthenticated();
        
        // Get all relevant buttons
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const profileSection = document.getElementById('profileSection');
        
        if (isAuthenticated) {
            // User is authenticated
            const user = await auth0Client.getUser();
            
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (profileSection) {
                profileSection.style.display = 'block';
                const userEmail = document.getElementById('userEmail');
                if (userEmail) userEmail.textContent = user.email;
            }
        } else {
            // User is not authenticated
            if (loginBtn) loginBtn.style.display = 'block';
            if (signupBtn) signupBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (profileSection) profileSection.style.display = 'none';
        }
    } catch (error) {
        console.error("Error updating UI:", error);
    }
}

// Login function
async function login() {
    try {
        await auth0Client.loginWithRedirect({
            redirect_uri: 'https://shadowzone.netlify.app/callback'
        });
    } catch (error) {
        console.error("Error during login:", error);
    }
}

// Signup function
async function signup() {
    try {
        await auth0Client.loginWithRedirect({
            redirect_uri: 'https://shadowzone.netlify.app/callback',
            screen_hint: 'signup'
        });
    } catch (error) {
        console.error("Error during signup:", error);
    }
}

// Logout function
async function logout() {
    try {
        await auth0Client.logout({
            returnTo: 'https://shadowzone.netlify.app'
        });
        localStorage.removeItem('isLoggedIn');
    } catch (error) {
        console.error("Error during logout:", error);
    }
}

// Initialize when the page loads
window.onload = initializeAuth0; 