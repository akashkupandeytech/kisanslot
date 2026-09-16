const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');

router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    const filter = farmerId ? { farmer: farmerId } : {};
    const crops = await Crop.find(filter).sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { farmer, crop, qty, season } = req.body;
    if (!farmer || !crop || !qty) {
      return res.status(400).json({ message: 'Farmer, crop aur quantity zaroori hai' });
    }
    const newCrop = await Crop.create({ farmer, crop, qty, season });
    const io = req.app.get('io');
    io.emit('crop:created', newCrop);
    res.status(201).json(newCrop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
