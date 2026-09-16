const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    const filter = farmerId ? { farmer: farmerId } : {};
    const docs = await Document.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { farmer, type, name } = req.body;
    if (!farmer || !type || !name) {
      return res.status(400).json({ message: 'Saari fields zaroori hain' });
    }
    const doc = await Document.create({ farmer, type, name });
    const io = req.app.get('io');
    io.emit('document:created', doc);
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
