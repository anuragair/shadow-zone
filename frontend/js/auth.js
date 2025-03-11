import { createAuth0Client } from '@auth0/auth0-spa-js';

let auth0Client = null;

// Initialize Auth0 client
async function initializeAuth0() {
    try {
        auth0Client = await createAuth0Client({
            domain: 'dev-2d67b8khfvv4gi3r.us.auth0.com',
            client_id: 'Gy7RxKFNqwvEGBBHhiZZvBTNtVODGPB5',
            redirect_uri: 'https://shadowzone.netlify.app/callback.html',
            cacheLocation: 'localstorage'
        });

        // Check if user was redirected after login
        if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
            try {
                // Handle the redirect and get the user
                await auth0Client.handleRedirectCallback();
                window.history.replaceState({}, document.title, window.location.pathname);
                await updateUI();
                
                // Redirect to dashboard if on callback page
                if (window.location.pathname === '/callback.html') {
                    window.location.href = '/dashboard.html';
                }
            } catch (error) {
                console.error("Error handling redirect:", error);
                showError("Error handling login redirect");
            }
        } else {
            await updateUI();
        }
    } catch (error) {
        console.error("Error initializing Auth0:", error);
        showError("Error initializing authentication");
    }
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
            if (loginBtn) loginBtn.style.display = 'block';
            if (signupBtn) signupBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (profileSection) profileSection.style.display = 'none';
        }
    } catch (error) {
        console.error("Error updating UI:", error);
        showError("Error updating interface");
    }
}

// Login function
async function login() {
    try {
        await auth0Client.loginWithRedirect({
            redirect_uri: 'https://shadowzone.netlify.app/callback.html'
        });
    } catch (error) {
        console.error("Error during login:", error);
        showError("Error initiating login");
    }
}

// Signup function
async function signup() {
    try {
        await auth0Client.loginWithRedirect({
            redirect_uri: 'https://shadowzone.netlify.app/callback.html',
            screen_hint: 'signup'
        });
    } catch (error) {
        console.error("Error during signup:", error);
        showError("Error initiating signup");
    }
}

// Signup with Google function
async function signupWithGoogle() {
    try {
        await auth0Client.loginWithRedirect({
            redirect_uri: 'https://shadowzone.netlify.app/callback.html',
            connection: 'google-oauth2'
        });
    } catch (error) {
        console.error("Error during Google signup:", error);
        showError("Error initiating Google signup");
    }
}

// Logout function
async function logout() {
    try {
        await auth0Client.logout({
            returnTo: 'https://shadowzone.netlify.app'
        });
    } catch (error) {
        console.error("Error during logout:", error);
        showError("Error logging out");
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeAuth0);

// Export functions for use in other files
export { login, signup, signupWithGoogle, logout }; 