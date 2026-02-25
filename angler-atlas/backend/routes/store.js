const express = require('express');

const router = express.Router();

// Store routes (can be expanded with products, cart, checkout)
router.get('/products', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Deep Diver Lure', price: 12.99, category: 'lures' },
      { id: 2, name: 'Fishing Rod', price: 89.99, category: 'rods' },
      { id: 3, name: 'Net', price: 34.99, category: 'nets' },
    ],
  });
});

module.exports = router;
