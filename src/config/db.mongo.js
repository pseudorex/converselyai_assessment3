'use strict';

const mongoose = require('mongoose');

async function connectMongo() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('[MongoDB] Connected successfully.');
}

module.exports = { connectMongo };
