const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' }, // null = broadcast (operator/officer)
    audience: { type: String, enum: ['farmer', 'operator', 'officer', 'all'], default: 'farmer' },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
