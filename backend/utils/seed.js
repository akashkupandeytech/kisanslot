require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Centre = require('../models/Centre');

const seedCentres = [
  { name: 'Rajpur Mandi Kendra', cap: 60, load: 72, crops: 'Wheat, Rice, Mustard' },
  { name: 'Doiwala Kisan Kendra', cap: 40, load: 94, crops: 'Wheat, Maize' },
  { name: 'Vikasnagar Sahayata Kendra', cap: 80, load: 38, crops: 'Sugarcane, Wheat' }
];

async function run() {
  await connectDB();
  for (const c of seedCentres) {
    await Centre.findOneAndUpdate({ name: c.name }, c, { upsert: true, new: true });
  }
  console.log('Centres seeded:', seedCentres.map((c) => c.name).join(', '));
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
