const express = require('express');
const User = require('../models/User');
const Catch = require('../models/Catch');

const router = express.Router();

// Get global leaderboard
router.get('/', async (req, res) => {
  try {
    const timeframe = req.query.timeframe || 'all'; // all, month, week
    let dateFilter = {};

    if (timeframe === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (timeframe === 'month') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: monthAgo } };
    }

    // Calculate points based on catches
    const catches = await Catch.find(dateFilter).populate('userId');
    const userPoints = {};

    catches.forEach(catchDoc => {
      const userId = catchDoc.userId._id;
      userPoints[userId] = (userPoints[userId] || 0) + 100; // Base points per catch
      userPoints[userId] += catchDoc.likes.length * 10; // Points per like
      userPoints[userId] += (catchDoc.weight || 0) * 5; // Points per lb
    });

    const leaderboard = await User.find()
      .select('username rank points profilePicture')
      .sort({ points: -1 })
      .limit(100);

    // Update points with calculated values
    const enrichedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
      calculatedPoints: userPoints[user._id] || 0,
    }));

    res.json(enrichedLeaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user rank
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('username rank points profilePicture');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const rankAbove = await User.countDocuments({ points: { $gt: user.points } });

    res.json({
      user,
      rank: rankAbove + 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
