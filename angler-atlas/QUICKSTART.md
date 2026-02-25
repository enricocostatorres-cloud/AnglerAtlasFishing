# Quick Start Guide - Angler Atlas

## 5-Minute Setup

### Prerequisites
- Node.js installed (https://nodejs.org)
- MongoDB installed locally OR MongoDB Atlas account
- Google Maps API key

### Step 1: Get Google Maps API Key (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (name: "Angler Atlas")
3. Enable APIs:
   - Google Maps JavaScript API
   - Google Places API
   - Geocoding API
4. Create API key (Credentials → Create Credentials → API Key)
5. Copy the key (you'll need it)

### Step 2: Setup MongoDB (Choose One)

**Option A: Local MongoDB**
```bash
# Install MongoDB from https://www.mongodb.com/try/download/community
# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster (free tier available)
3. Create database user
4. Get connection string
5. Copy connection string

### Step 3: Clone and Configure

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/angler-atlas.git
cd angler-atlas

# Create .env file in backend folder
cd backend
cp .env.example .env

# Edit .env with your details
# nano .env  (or use your favorite editor)
```

### Step 4: Configure Environment Variables

Edit `backend/.env`:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/angler-atlas
JWT_SECRET=your-secret-key-here-change-this-in-production
GOOGLE_MAPS_API_KEY=your-google-maps-key-here
```

### Step 5: Install Dependencies

```bash
# From backend directory
npm install

# Takes about 1-2 minutes
```

### Step 6: Start the Server

```bash
# From backend directory
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

### Step 7: Update Google Maps API Key in Frontend

Edit `frontend/index.html` (around line 11):

Replace:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places,geometry"></script>
```

With:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=your-actual-api-key-here&libraries=places,geometry"></script>
```

### Step 8: Open the App

Open your browser and go to:
```
http://localhost:5000
```

## First Test Run

### 1. Register a User

1. Click "Register"
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm: `password123`
3. Click Register

### 2. Log a Catch

1. Click "Log Catch" button
2. Fill in:
   - Species: `Largemouth Bass`
   - Weight: `5.5`
   - Depth: `12`
   - Lure: `Worm`
   - Location: `New York`
3. Click "Log Catch"

### 3. View Feed

Your catch should appear in the activity feed!

### 4. Test Map

1. Click "Map" in navigation
2. See your catch location
3. Click the marker for details

## Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB is running: `mongod` terminal should show "waiting for connections"
- Verify MONGO_URI in .env is correct

### "Cannot GET /" after starting server
- Wait 5-10 seconds for server to fully start
- Check console for errors
- Refresh browser

### "Google Maps not showing"
- Verify API key is correct in index.html
- Check API has Maps API enabled
- Check browser console for errors (F12)

### "CORS error"
- Ensure frontend is loading from http://localhost:5000
- Not from a different port

### Port 5000 already in use
```bash
# Change PORT in .env to 5001
PORT=5001
```

## Directory Structure After Setup

```
angler-atlas/
├── backend/
│   ├── node_modules/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── api.js
└── README.md
```

## Common Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Install a new package
npm install package-name

# Check MongoDB connection
mongo  # or mongosh for newer versions

# View server logs
# Check console where npm run dev is running
```

## API Testing

### Test with curl

```bash
# Get health status
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123","confirmPassword":"password123"}'

# Get leaderboard
curl http://localhost:5000/api/leaderboard
```

### Test with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create new request
3. Set method to POST
4. URL: `http://localhost:5000/api/auth/login`
5. Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
6. Send

## Next Steps

1. **Explore the code**: Read through models, routes, and frontend logic
2. **Make changes**: Try modifying the UI or adding new fields
3. **Test thoroughly**: Register, log catches, use all features
4. **Read documentation**: Check README.md and ROADMAP.md
5. **Start developing**: Pick a feature from ROADMAP and build it!

## Development Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# Test locally

# Commit changes
git add .
git commit -m "Add: my feature"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
```

## Important Notes

- Keep `.env` out of git (it's in .gitignore)
- Never commit API keys or secrets
- Change `JWT_SECRET` in production
- Use environment variables for all sensitive data
- Test thoroughly before deployment

## Getting Help

1. Check error messages in console
2. Review README.md and documentation
3. Check GitHub issues
4. Review API endpoints in routes/
5. Check browser console (F12 → Console tab)

## Frontend Debugging

Press F12 in browser to open Developer Tools:
- **Console** tab: See errors and logs
- **Network** tab: See API requests and responses
- **Elements** tab: Inspect HTML elements
- **Application** tab: View localStorage (auth tokens)

## Backend Debugging

Check terminal where `npm run dev` is running:
- Look for error messages
- Check MongoDB connection
- Verify API requests are received

## Moving Forward

Once everything is working:
1. Create GitHub repository
2. Push code to GitHub
3. Start on Phase 2 features
4. Set up GitHub Issues for tracking
5. Create Pull Requests for code review

---

You're all set! Start building awesome features for Angler Atlas! 🎣
