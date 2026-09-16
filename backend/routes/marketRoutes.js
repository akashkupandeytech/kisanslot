const express = require('express');
const router = express.Router();
const marketPrices = require('../data/marketPrices');

router.get('/', (req, res) => {
  res.json(marketPrices);
});

module.exports = router;
