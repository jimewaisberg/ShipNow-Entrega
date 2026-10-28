const mongoose = require('mongoose');
const config = require('./env.config');
const logger = require('./logger');

module.exports = async function connectDB() {
  try {
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000
    });

    logger.info('Conexión a MongoDB establecida correctamente');
  } catch (error) {
    logger.fatal('No se pudo establecer la conexión con MongoDB');
    throw error;
  }
};
