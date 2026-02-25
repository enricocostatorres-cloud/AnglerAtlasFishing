const express = require('express');

const router = express.Router();

// Posts routes (can be expanded)
router.get('/', (req, res) => {
  res.json({ message: 'Posts endpoint' });
});

module.exports = router;
