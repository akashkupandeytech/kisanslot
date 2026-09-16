const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    father: { type: String, trim: true },
    mobile: { type: String, required: true, trim: true },
    village: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true, default: 'Uttarakhand' },
    land: { type: String, trim: true },
    bank: { type: String, trim: true },
    mode: { type: String, enum: ['Owner', 'Tenant'], default: 'Owner' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farmer', farmerSchema);
