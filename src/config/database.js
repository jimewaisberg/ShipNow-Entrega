const mongoose = require('mongoose');
const config = require('./env.config');
module.exports = async function connectDB() {
  await mongoose.connect(config.mongodbUri, { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB conectado');
};
