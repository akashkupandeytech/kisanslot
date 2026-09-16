const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');

// GET all farmers (used by operator to search/assist)
router.get('/', async (req, res) => {
  try {
    const { mobile } = req.query;
    if (mobile) {
      const farmer = await Farmer.findOne({ mobile });
      return res.json(farmer);
    }
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one farmer by id
router.get('/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE or UPDATE (by mobile number) a farmer profile
router.post('/', async (req, res) => {
  try {
    const { name, mobile } = req.body;
    if (!name || !mobile) {
      return res.status(400).json({ message: 'Naam aur mobile number zaroori hai' });
    }
    let farmer = await Farmer.findOne({ mobile });
    if (farmer) {
      Object.assign(farmer, req.body);
      await farmer.save();
    } else {
      farmer = await Farmer.create(req.body);
    }
    const io = req.app.get('io');
    io.emit('farmer:updated', farmer);
    res.status(200).json(farmer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
