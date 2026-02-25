// Global state
let currentPage = 1;
let map = null;
let userLocation = { latitude: 40.7128, longitude: -74.0060 }; // Default: NYC
let userMarkers = [];

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
        showAuthModal();
    } else {
        await initializeApp();
    }

    setupEventListeners();
});

// Initialize main app
async function initializeApp() {
    try {
        // Fetch current user
        const user = await getCurrentUser();
        if (user) {
            await updateUserDashboard(user);
        }

        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    console.log('Location:', userLocation);
                },
                (error) => {
                    console.log('Using default location');
                }
            );
        }

        // Load initial data
        await loadFeed();
        await loadLeaderboard();
        await loadGearSpotlight();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Update user dashboard
async function updateUserDashboard(user) {
    document.getElementById('userRank').textContent = user.rank || 'Novice Angler';
    document.getElementById('userPoints').textContent = user.points || 0;

    // Get user's catch count
    const catches = await getUserCatches(user._id);
    document.getElementById('userCatches').textContent = catches.length;
}

// Load feed
async function loadFeed(page = 1) {
    try {
        const data = await getFeed(page);
        const feedContainer = document.getElementById('feedContainer');

        if (page === 1) {
            feedContainer.innerHTML = '';
        }

        if (data.catches && data.catches.length > 0) {
            data.catches.forEach(catchData => {
                const postHTML = createPostCard(catchData);
                feedContainer.insertAdjacentHTML('beforeend', postHTML);
            });

            // Update load more button
            if (data.pagination.pages > page) {
                document.getElementById('loadMoreBtn').innerHTML = `
                    <button class="btn-primary" onclick="loadFeed(${page + 1})">Load More</button>
                `;
            } else {
                document.getElementById('loadMoreBtn').innerHTML = '<p>No more posts</p>';
            }
        } else {
            if (page === 1) {
                feedContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">No catches yet. Be the first to log one!</p>';
            }
        }

        // Reattach event listeners for new posts
        attachPostEventListeners();
    } catch (error) {
        console.error('Error loading feed:', error);
    }
}

// Create post card HTML
function createPostCard(catchData) {
    const user = catchData.userId;
    const likes = catchData.likes ? catchData.likes.length : 0;
    const timestamp = new Date(catchData.createdAt).toLocaleDateString();

    return `
        <article class="post-card" data-catch-id="${catchData._id}">
            <div class="post-header">
                <div class="user-avatar"></div>
                <div style="flex: 1;">
                    <span class="username">${user.username}</span>
                    <div style="font-size: 0.8rem; color: #999;">${timestamp}</div>
                </div>
            </div>
            <div class="post-image-container">
                <img src="https://placehold.co/600x400/00578a/ffffff?text=${catchData.species}" 
                     alt="${catchData.species}" class="post-image">
            </div>
            <div class="post-data">
                <strong>Catch:</strong> ${catchData.species} 
                ${catchData.weight ? `| <strong>Weight:</strong> ${catchData.weight} lbs` : ''}
                ${catchData.length ? `| <strong>Length:</strong> ${catchData.length} in` : ''}
                ${catchData.depth ? `| <strong>Depth:</strong> ${catchData.depth} ft` : ''}
                <br>
                <strong>Location:</strong> ${catchData.location.address || 'GPS Location'}
                ${catchData.lureUsed ? `| <strong>Lure:</strong> ${catchData.lureUsed}` : ''}
                ${catchData.releaseInfo?.wasReleased ? '<br><strong>✓ Released</strong>' : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn" data-catch-id="${catchData._id}">
                    <i class="fa-solid fa-fish"></i> <span class="like-count">${likes}</span>
                </button>
                <button class="action-btn share-btn">
                    <i class="fa-solid fa-anchor"></i> Share
                </button>
                <button class="action-btn comment-btn">
                    <i class="fa-regular fa-comment"></i> Comment
                </button>
            </div>
        </article>
    `;
}

// Attach event listeners to post actions
function attachPostEventListeners() {
    // Like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.removeEventListener('click', handleLike);
        btn.addEventListener('click', handleLike);
    });

    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.removeEventListener('click', handleShare);
        btn.addEventListener('click', handleShare);
    });
}

// Handle like
async function handleLike(e) {
    e.preventDefault();
    const catchId = e.currentTarget.dataset.catchId;

    try {
        const result = await likeCatch(catchId);
        const likeCount = e.currentTarget.querySelector('.like-count');
        likeCount.textContent = result.likes;
        e.currentTarget.classList.toggle('liked', result.liked);
    } catch (error) {
        alert('Error liking catch: ' + error.message);
    }
}

// Handle share
function handleShare(e) {
    e.preventDefault();
    alert("🎣 Link copied to clipboard!");
}

// Load leaderboard
async function loadLeaderboard() {
    try {
        const leaderboard = await getLeaderboard();
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';

        leaderboard.slice(0, 10).forEach((user, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${index + 1}. ${user.username}</span>
                <span>${user.points || 0} pts</span>
            `;
            leaderboardList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// Load gear spotlight
async function loadGearSpotlight() {
    try {
        const result = await getStoreProducts();
        const spotlight = document.getElementById('gearSpotlight');

        if (result.products && result.products.length > 0) {
            const random = result.products[Math.floor(Math.random() * result.products.length)];
            spotlight.innerHTML = `
                <p><strong>${random.name}</strong></p>
                <p style="color: var(--accent-copper); font-weight: bold;">$${random.price}</p>
                <button class="purchase-btn">Buy Now</button>
            `;
        }
    } catch (error) {
        console.error('Error loading gear spotlight:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Modal controls
    const postModal = document.getElementById('postModal');
    const authModal = document.getElementById('authModal');
    const mapModal = document.getElementById('mapModal');

    document.getElementById('openPostModalBtn')?.addEventListener('click', () => {
        if (!isLoggedIn()) {
            alert('Please log in first');
            return;
        }
        postModal.classList.add('show');
    });

    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('show');
        });
    });

    // Close on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Catch logging form
    document.getElementById('createPostForm')?.addEventListener('submit', handlePostSubmit);

    // Auth forms
    document.getElementById('loginFormElement')?.addEventListener('submit', handleLogin);
    document.getElementById('registerFormElement')?.addEventListener('submit', handleRegister);

    // Navigation
    document.getElementById('mapLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        initializeMap();
        document.getElementById('mapModal').classList.add('show');
    });

    document.getElementById('profileLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Profile page coming soon!');
    });

    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
        window.location.reload();
    });
}

// Handle post submit
async function handlePostSubmit(e) {
    e.preventDefault();

    const catchData = {
        species: document.getElementById('speciesInput').value,
        weight: parseFloat(document.getElementById('weightInput').value) || null,
        length: parseFloat(document.getElementById('lengthInput').value) || null,
        depth: parseFloat(document.getElementById('depthInput').value) || null,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
        address: document.getElementById('locationInput').value,
        lureUsed: document.getElementById('lureInput').value,
        waterConditions: {
            temperature: parseFloat(document.getElementById('tempInput').value) || null,
        },
        notes: document.getElementById('notesInput').value,
        visibility: document.getElementById('visibilitySelect').value,
        releaseInfo: {
            wasReleased: document.getElementById('releaseCheckbox').checked,
        },
    };

    try {
        await logCatch(catchData);
        alert('Catch logged successfully!');
        document.getElementById('postModal').classList.remove('show');
        document.getElementById('createPostForm').reset();
        currentPage = 1;
        await loadFeed();
    } catch (error) {
        alert('Error logging catch: ' + error.message);
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await login(email, password);
        document.getElementById('authModal').classList.remove('show');
        await initializeApp();
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

// Handle register
async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    try {
        await register(username, email, password, confirmPassword);
        document.getElementById('authModal').classList.remove('show');
        await initializeApp();
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
}

// Toggle auth form
function toggleAuthForm(e) {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 
        document.getElementById('loginForm').style.display === 'none' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = 
        document.getElementById('registerForm').style.display === 'none' ? 'block' : 'none';
}

// Show auth modal
function showAuthModal() {
    document.getElementById('authModal').classList.add('show');
}

// Initialize Google Map
function initializeMap() {
    if (map) return; // Already initialized

    const mapElement = document.getElementById('map');
    const mapOptions = {
        zoom: 12,
        center: {
            lat: userLocation.latitude,
            lng: userLocation.longitude,
        },
    };

    map = new google.maps.Map(mapElement, mapOptions);

    // Add user location marker
    new google.maps.Marker({
        position: mapOptions.center,
        map: map,
        title: 'Your Location',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    });

    // Load nearby catches
    loadNearbyOnMap();
}

// Load nearby catches on map
async function loadNearbyOnMap() {
    try {
        const catches = await getNearby(userLocation.longitude, userLocation.latitude);

        catches.forEach(catchData => {
            const marker = new google.maps.Marker({
                position: {
                    lat: catchData.location.coordinates[1],
                    lng: catchData.location.coordinates[0],
                },
                map: map,
                title: `${catchData.species} - ${new Date(catchData.createdAt).toLocaleDateString()}`,
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="color: #333;">
                        <strong>${catchData.species}</strong><br>
                        By: ${catchData.userId.username}<br>
                        ${catchData.weight ? `Weight: ${catchData.weight} lbs<br>` : ''}
                        ${new Date(catchData.createdAt).toLocaleDateString()}
                    </div>
                `,
            });

            marker.addListener('click', () => {
                // Close all other info windows
                document.querySelectorAll('.gm-style-iw').forEach(el => el.closest('.gm-style').style.display = 'none');
                infoWindow.open(map, marker);
            });
        });
    } catch (error) {
        console.error('Error loading nearby catches:', error);
    }
}
