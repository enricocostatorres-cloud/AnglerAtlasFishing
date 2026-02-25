const express = require('express');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/:userId', verifyToken, async (req, res) => {
  try {
    // Only allow users to update their own profile
    if (req.params.userId !== req.userId && req.params.userId !== String(req.userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updates = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
      location: req.body.location,
      profilePicture: req.body.profilePicture,
    };

    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow user
router.post('/:userId/follow', verifyToken, async (req, res) => {
  try {
    if (req.params.userId === String(req.userId)) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.userId)) {
      currentUser.following.pull(req.params.userId);
      userToFollow.followers.pull(req.userId);
    } else {
      currentUser.following.push(req.params.userId);
      userToFollow.followers.push(req.userId);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ 
      message: currentUser.following.includes(req.params.userId) ? 'User followed' : 'User unfollowed',
      following: currentUser.following.includes(req.params.userId),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
