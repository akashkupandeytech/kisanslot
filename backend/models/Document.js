const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    type: { type: String, required: true },
    name: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
