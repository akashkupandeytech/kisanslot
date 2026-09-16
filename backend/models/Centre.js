const mongoose = require('mongoose');

const centreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    cap: { type: Number, required: true }, // quintal per hour capacity
    load: { type: Number, default: 0 }, // current load percentage
    crops: { type: String, default: '' }
  },
  { timestamps: true }
);

centreSchema.virtual('overloaded').get(function () {
  return this.load >= 90;
});
centreSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Centre', centreSchema);
