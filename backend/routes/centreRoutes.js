const express = require('express');
const router = express.Router();
const Centre = require('../models/Centre');
const Notification = require('../models/Notification');

// GET all centres (live load included)
router.get('/', async (req, res) => {
  try {
    const centres = await Centre.find().sort({ name: 1 });
    res.json(centres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH centre load (used when a slot is booked/checked-in, bumps load slightly)
router.patch('/:id/load', async (req, res) => {
  try {
    const { delta } = req.body; // e.g. +3 or -3
    const centre = await Centre.findById(req.params.id);
    if (!centre) return res.status(404).json({ message: 'Centre nahi mili' });
    centre.load = Math.max(0, Math.min(100, centre.load + (delta || 0)));
    await centre.save();
    const io = req.app.get('io');
    io.emit('centre:updated', centre);
    res.json(centre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST officer sends congestion alert for a centre (broadcast notification)
router.post('/:id/alert', async (req, res) => {
  try {
    const centre = await Centre.findById(req.params.id);
    if (!centre) return res.status(404).json({ message: 'Centre nahi mili' });
    const text = `Congestion alert bheja gaya: ${centre.name} (${centre.load}% load).`;
    const notif = await Notification.create({ audience: 'operator', text });
    const io = req.app.get('io');
    io.emit('notification:new', notif);
    res.json({ message: 'Alert sent', notification: notif });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST officer reallocates staff / reduces load for a centre
router.post('/:id/reallocate', async (req, res) => {
  try {
    const centre = await Centre.findById(req.params.id);
    if (!centre) return res.status(404).json({ message: 'Centre nahi mili' });
    centre.load = Math.max(0, centre.load - 20);
    await centre.save();
    const text = `Staff reallocate ho gaya: ${centre.name}. Load ab ${centre.load}%.`;
    const notif = await Notification.create({ audience: 'operator', text });
    const io = req.app.get('io');
    io.emit('centre:updated', centre);
    io.emit('notification:new', notif);
    res.json({ centre, notification: notif });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
