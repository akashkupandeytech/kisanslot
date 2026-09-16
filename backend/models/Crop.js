const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    crop: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    season: { type: String, enum: ['Rabi', 'Kharif', 'Zaid'], default: 'Rabi' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', cropSchema);
