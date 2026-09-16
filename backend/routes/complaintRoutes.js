const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    const filter = farmerId ? { farmer: farmerId } : {};
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { farmer, topic, description } = req.body;
    if (!farmer || !topic || !description) {
      return res.status(400).json({ message: 'Saari fields zaroori hain' });
    }
    const complaint = await Complaint.create({ farmer, topic, description });
    const io = req.app.get('io');
    io.emit('complaint:created', complaint);
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
