# Angler Atlas - Social Fishing Platform

A Strava-style social platform for anglers to log catches, share experiences, track progress, and connect with other fishing enthusiasts. Features include interactive mapping, gamification, leaderboards, and an integrated gear store.

## Project Structure

```
angler-atlas/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Catch.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── catches.js
│   │   ├── posts.js
│   │   ├── leaderboard.js
│   │   └── store.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── api.js
└── README.md
```

## Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud)
- Google Maps API Key
- npm or yarn

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory using `.env.example` as a template:

```bash
cp .env.example .env
```

Edit `.env` and add your values:
- `MONGO_URI`: MongoDB connection string (e.g., `mongodb://localhost:27017/angler-atlas`)
- `JWT_SECRET`: Strong secret key for JWT tokens
- `GOOGLE_MAPS_API_KEY`: Get from [Google Cloud Console](https://console.cloud.google.com)

### 3. Start MongoDB

If running locally:
```bash
mongod
```

Or use MongoDB Atlas for cloud database.

### 4. Start the Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

## Frontend Setup

### 1. Update Google Maps API Key

In `frontend/index.html`, replace `YOUR_GOOGLE_MAPS_API_KEY`:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places,geometry"></script>
```

### 2. Serve the Frontend

The frontend is served automatically by the Express server when you run `npm run dev` in the backend.

Or for development, use a local server:
```bash
# From frontend directory
python -m http.server 8000
# or
npx http-server
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/me` - Get current user
- `PUT /api/users/:userId` - Update profile
- `POST /api/users/:userId/follow` - Follow/unfollow user

### Catches
- `POST /api/catches/log` - Log a new catch
- `GET /api/catches/feed` - Get public feed
- `GET /api/catches/nearby` - Get nearby catches
- `GET /api/catches/user/:userId` - Get user's catches
- `POST /api/catches/:catchId/like` - Like a catch
- `POST /api/catches/:catchId/comment` - Comment on catch

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/user/:userId` - Get user rank

### Store
- `GET /api/store/products` - Get store products

## Features Implemented

### Current Phase 1
- ✅ User authentication (register/login)
- ✅ Activity feed with catch posts
- ✅ Like and comment functionality
- ✅ Leaderboard system
- ✅ User profiles and following
- ✅ Interactive Google Map
- ✅ Catch logging form
- ✅ Responsive design
- ✅ JWT-based security

### Phase 2 (Coming Soon)
- Premium subscription system
- Weather integration
- Solunar timing predictions
- Advanced analytics
- Catch statistics
- Fish species database
- Social feed with followers
- Image uploads
- Mobile app

## Architecture Details

### Frontend
- Vanilla JavaScript (no framework)
- Responsive CSS with mobile support
- Google Maps API integration
- RESTful API client

### Backend
- Express.js framework
- MongoDB with Mongoose ODM
- JWT authentication
- Geospatial queries for location-based features
- Modular route structure

### Database Schema

**User Collection**
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  rank: String,
  points: Number,
  followers: [ObjectId],
  following: [ObjectId],
  preferences: { subscriptionTier, notifications, etc }
}
```

**Catch Collection**
```javascript
{
  userId: ObjectId,
  species: String,
  weight: Number,
  length: Number,
  depth: Number,
  location: { type: "Point", coordinates: [lng, lat] },
  lureUsed: String,
  waterConditions: { temperature, clarity, flowRate },
  catchTime: Date,
  releaseInfo: { wasReleased, releasedAt, releasedHealthy },
  likes: [ObjectId],
  comments: [{ userId, text, createdAt }],
  visibility: String (public/friends/private)
}
```

## Testing the App

### User Registration
1. Open `http://localhost:5000`
2. Click on Register
3. Fill in username, email, password
4. Submit

### Logging a Catch
1. Click "Log Catch" button
2. Fill in catch details
3. The app uses your device location (via geolocation)
4. Submit to add to feed

### View Map
1. Click "Map" in navigation
2. See all nearby catches pinned
3. Click pins for catch details

## Security Considerations

1. **JWT Tokens**: 7-day expiration
2. **Password Hashing**: bcryptjs with salt rounds of 10
3. **CORS**: Configured for frontend origin
4. **Input Validation**: Email and password validation
5. **Geospatial Security**: Location data stored with privacy settings

## Performance Optimizations

- Pagination on feed (10 posts per page)
- Geospatial index on catch locations
- Lazy loading for images
- Client-side caching with localStorage
- Efficient database queries with populate/select

## Deployment

### Backend (Heroku, Railway, etc.)
```bash
# Set environment variables in hosting platform
# Deploy repository
```

### Frontend
- Served by Express backend
- Can also deploy to Vercel, Netlify, etc.

### Database
- Use MongoDB Atlas for cloud database
- Update `MONGO_URI` in production environment

## Troubleshooting

### "Cannot POST /api/catches/log"
- Ensure backend is running
- Check that auth token is being sent in headers

### Map not loading
- Verify Google Maps API key is correct
- Check API key permissions
- Ensure geolocation is enabled

### MongoDB connection error
- Check MongoDB is running
- Verify `MONGO_URI` in .env
- Check network access if using Atlas

## Contributing

1. Create feature branches
2. Write clean, documented code
3. Test thoroughly
4. Submit pull requests

## Team

- **Enrico Costa Torres** (23202453)
- **Paulo Romera de Lima** (23202412)

## License

MIT License - feel free to use this project!

## Next Steps

1. Set up MongoDB database
2. Get Google Maps API key
3. Configure environment variables
4. Run backend server
5. Open frontend and register
6. Start logging catches!

---

For questions or issues, please check the GitHub repository or contact the development team.
