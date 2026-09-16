const mongoose = require('mongoose');

function generateToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return 'KS-' + code;
}

const slotSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    centre: { type: String, required: true },
    date: { type: String, required: true },
    window: { type: String, required: true },
    crop: { type: String, required: true },
    qty: { type: Number, required: true },
    token: { type: String, unique: true, default: generateToken },
    duration: { type: Number, default: 20 }, // minutes
    queueAhead: { type: Number, default: 0 },
    statusKey: {
      type: String,
      enum: ['confirmed', 'checkedin', 'reslotted'],
      default: 'confirmed'
    },
    qualityDone: { type: Boolean, default: false },
    weighDone: { type: Boolean, default: false },
    paymentStage: {
      type: String,
      enum: ['Not applicable', 'Initiated', 'Processed', 'Credited'],
      default: 'Not applicable'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slot', slotSchema);
