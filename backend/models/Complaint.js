const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    topic: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
