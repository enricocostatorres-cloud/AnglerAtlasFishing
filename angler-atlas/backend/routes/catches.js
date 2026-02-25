const express = require('express');
const Catch = require('../models/Catch');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Log a new catch
router.post('/log', verifyToken, async (req, res) => {
  try {
    const {
      species,
      weight,
      length,
      depth,
      latitude,
      longitude,
      address,
      lureUsed,
      waterConditions,
      weather,
      timeOfDay,
      catchTime,
      releaseInfo,
      notes,
      visibility,
      images,
    } = req.body;

    if (!species || !latitude || !longitude) {
      return res.status(400).json({ error: 'Species and location are required' });
    }

    const newCatch = new Catch({
      userId: req.userId,
      species,
      weight,
      length,
      depth,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
        address,
      },
      lureUsed,
      waterConditions,
      weather,
      timeOfDay,
      catchTime: catchTime || new Date(),
      releaseInfo,
      images,
      notes,
      visibility: visibility || 'public',
    });

    await newCatch.save();
    await newCatch.populate('userId', 'username profilePicture');

    res.status(201).json({
      message: 'Catch logged successfully',
      catch: newCatch,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all catches for feed (public)
router.get('/feed', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const catches = await Catch.find({ visibility: 'public' })
      .populate('userId', 'username profilePicture rank')
      .populate('comments.userId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Catch.countDocuments({ visibility: 'public' });

    res.json({
      catches,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get catches near location (for map)
router.get('/nearby', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance } = req.query;
    const distance = maxDistance ? parseInt(maxDistance) : 5000; // 5km default

    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Longitude and latitude are required' });
    }

    const catches = await Catch.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: distance,
        },
      },
      visibility: 'public',
    })
      .populate('userId', 'username profilePicture')
      .limit(50);

    res.json(catches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's catches
router.get('/user/:userId', async (req, res) => {
  try {
    const catches = await Catch.find({ userId: req.params.userId, visibility: { $in: ['public', 'friends'] } })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(catches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like a catch
router.post('/:catchId/like', verifyToken, async (req, res) => {
  try {
    const catchDoc = await Catch.findById(req.params.catchId);

    if (!catchDoc) {
      return res.status(404).json({ error: 'Catch not found' });
    }

    const likeIndex = catchDoc.likes.indexOf(req.userId);

    if (likeIndex > -1) {
      catchDoc.likes.splice(likeIndex, 1);
    } else {
      catchDoc.likes.push(req.userId);
    }

    await catchDoc.save();
    res.json({ likes: catchDoc.likes.length, liked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment
router.post('/:catchId/comment', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const catchDoc = await Catch.findByIdAndUpdate(
      req.params.catchId,
      {
        $push: {
          comments: {
            userId: req.userId,
            text,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate('comments.userId', 'username profilePicture');

    res.json(catchDoc.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
