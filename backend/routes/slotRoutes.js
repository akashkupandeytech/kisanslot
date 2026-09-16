const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');
const Centre = require('../models/Centre');
const Notification = require('../models/Notification');

function computeDynamics(qty, existingCount, centreLoad) {
  const duration = 15 + Math.ceil(qty / 10) * 3; // minutes
  const queueAhead = existingCount;
  const wait = queueAhead * duration;
  return { duration, queueAhead, wait, centreLoad };
}

// GET /api/slots/estimate — live estimate before booking (centre, date, qty as query params)
router.get('/estimate', async (req, res) => {
  try {
    const { centre, date, qty } = req.query;
    const existingCount = await Slot.countDocuments({ centre, date, statusKey: { $ne: 'checkedin' } });
    const centreDoc = await Centre.findOne({ name: centre });
    const dyn = computeDynamics(Number(qty) || 10, existingCount, centreDoc ? centreDoc.load : 0);
    res.json(dyn);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all slots, optionally filtered by farmer
router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    const filter = farmerId ? { farmer: farmerId } : {};
    const slots = await Slot.find(filter).populate('farmer', 'name mobile village').sort({ createdAt: -1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE slot (book) — computes duration/queue live, bumps centre load, emits real-time
router.post('/', async (req, res) => {
  try {
    const { farmer, centre, date, crop, qty } = req.body;
    if (!farmer || !centre || !date || !crop || !qty) {
      return res.status(400).json({ message: 'Saari fields zaroori hain' });
    }
    const existingCount = await Slot.countDocuments({ centre, date, statusKey: { $ne: 'checkedin' } });
    const centreDoc = await Centre.findOne({ name: centre });
    const dyn = computeDynamics(Number(qty), existingCount, centreDoc ? centreDoc.load : 0);
    const startMinutes = 8 * 60 + existingCount * dyn.duration;
    const fmt = (m) => {
      let h = Math.floor(m / 60) % 24;
      const min = m % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${String(min).padStart(2, '0')} ${ampm}`;
    };
    const window = `${fmt(startMinutes)} - ${fmt(startMinutes + dyn.duration)}`;

    const slot = await Slot.create({
      farmer, centre, date, crop, qty, window,
      duration: dyn.duration, queueAhead: dyn.queueAhead
    });
    const populated = await slot.populate('farmer', 'name mobile village');

    if (centreDoc) {
      centreDoc.load = Math.min(100, centreDoc.load + 2);
      await centreDoc.save();
    }

    const io = req.app.get('io');
    io.emit('slot:created', populated);
    if (centreDoc) io.emit('centre:updated', centreDoc);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH check-in a slot (operator scans token)
router.patch('/:id/checkin', async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id).populate('farmer', 'name mobile village');
    if (!slot) return res.status(404).json({ message: 'Slot nahi mila' });
    slot.statusKey = 'checkedin';
    await slot.save();

    const notif = await Notification.create({
      farmer: slot.farmer._id,
      audience: 'farmer',
      text: `Aapka token ${slot.token} check-in ho gaya hai. Quality check jald hoga.`
    });

    const io = req.app.get('io');
    io.emit('slot:updated', slot);
    io.emit('notification:new', notif);
    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH mark quantity mismatch -> auto re-slot
router.patch('/:id/mismatch', async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id).populate('farmer', 'name mobile village');
    if (!slot) return res.status(404).json({ message: 'Slot nahi mila' });
    slot.statusKey = 'reslotted';
    slot.queueAhead = slot.queueAhead + 2;
    await slot.save();

    const notif = await Notification.create({
      farmer: slot.farmer._id,
      audience: 'farmer',
      text: `Quantity mismatch ki wajah se aapka token ${slot.token} auto re-slot ho gaya hai.`
    });

    const io = req.app.get('io');
    io.emit('slot:updated', slot);
    io.emit('notification:new', notif);
    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH mark quality check done
router.patch('/:id/quality', async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id).populate('farmer', 'name mobile village');
    if (!slot) return res.status(404).json({ message: 'Slot nahi mila' });
    slot.qualityDone = true;
    await slot.save();
    const io = req.app.get('io');
    io.emit('slot:updated', slot);
    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH mark weighing done -> also starts payment
router.patch('/:id/weigh', async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id).populate('farmer', 'name mobile village');
    if (!slot) return res.status(404).json({ message: 'Slot nahi mila' });
    if (!slot.qualityDone) return res.status(400).json({ message: 'Pehle quality check zaroori hai' });
    slot.weighDone = true;
    slot.paymentStage = 'Initiated';
    await slot.save();

    const notif = await Notification.create({
      farmer: slot.farmer._id,
      audience: 'farmer',
      text: `Aapki fasal ${slot.crop} weigh ho gayi. Payment process shuru ho gaya hai.`
    });

    const io = req.app.get('io');
    io.emit('slot:updated', slot);
    io.emit('notification:new', notif);
    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH advance payment stage (Initiated -> Processed -> Credited)
router.patch('/:id/payment', async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id).populate('farmer', 'name mobile village');
    if (!slot) return res.status(404).json({ message: 'Slot nahi mila' });
    const order = ['Initiated', 'Processed', 'Credited'];
    const idx = order.indexOf(slot.paymentStage);
    if (idx === -1 || idx === order.length - 1) {
      return res.status(400).json({ message: 'Payment already complete ya shuru nahi hua' });
    }
    slot.paymentStage = order[idx + 1];
    await slot.save();

    const notif = await Notification.create({
      farmer: slot.farmer._id,
      audience: 'farmer',
      text: `Payment update: ${slot.crop} ka payment ab "${slot.paymentStage}" stage mein hai.`
    });

    const io = req.app.get('io');
    io.emit('slot:updated', slot);
    io.emit('notification:new', notif);
    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
