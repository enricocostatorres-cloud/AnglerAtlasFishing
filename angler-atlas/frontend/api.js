// API Helper Module
const API_BASE_URL = 'http://localhost:5000/api';

let authToken = localStorage.getItem('authToken');

// Auth Functions
async function register(username, email, password, confirmPassword) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, confirmPassword }),
        });
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.user._id);
            return data;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.user._id);
            return data;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
}

function isLoggedIn() {
    return !!authToken;
}

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
    };
}

// User Functions
async function getCurrentUser() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

async function getUserProfile(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

async function updateUserProfile(userId, profileData) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

// Catch Functions
async function logCatch(catchData) {
    try {
        const response = await fetch(`${API_BASE_URL}/catches/log`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(catchData),
        });
        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error logging catch:', error);
        throw error;
    }
}

async function getFeed(page = 1) {
    try {
        const response = await fetch(`${API_BASE_URL}/catches/feed?page=${page}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching feed:', error);
        return { catches: [], pagination: {} };
    }
}

async function getNearby(longitude, latitude, maxDistance = 5000) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/catches/nearby?longitude=${longitude}&latitude=${latitude}&maxDistance=${maxDistance}`
        );
        return await response.json();
    } catch (error) {
        console.error('Error fetching nearby catches:', error);
        return [];
    }
}

async function getUserCatches(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/catches/user/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user catches:', error);
        return [];
    }
}

async function likeCatch(catchId) {
    try {
        const response = await fetch(`${API_BASE_URL}/catches/${catchId}/like`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Error liking catch:', error);
        throw error;
    }
}

async function addComment(catchId, text) {
    try {
        const response = await fetch(`${API_BASE_URL}/catches/${catchId}/comment`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ text }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
}

// Leaderboard Functions
async function getLeaderboard(timeframe = 'all') {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard?timeframe=${timeframe}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

async function getUserRank(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard/user/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user rank:', error);
        return null;
    }
}

// Store Functions
async function getStoreProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/store/products`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return { products: [] };
    }
}

// Follow Functions
async function followUser(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Error following user:', error);
        throw error;
    }
}
