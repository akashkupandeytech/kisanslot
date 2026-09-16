const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET notifications for a farmer, or by audience (operator/officer)
router.get('/', async (req, res) => {
  try {
    const { farmerId, audience } = req.query;
    let filter = {};
    if (farmerId) filter.farmer = farmerId;
    else if (audience) filter.audience = audience;
    const notifs = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { farmer, audience, text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text zaroori hai' });
    const notif = await Notification.create({ farmer, audience: audience || 'farmer', text });
    const io = req.app.get('io');
    io.emit('notification:new', notif);
    res.status(201).json(notif);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
