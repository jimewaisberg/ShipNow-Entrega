
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/env.config');
const connectDB = require('./config/database');
const logger = require('./config/logger');

async function start() {
  await connectDB();

  return app.listen(config.port, () => {
    logger.info(
      `Servidor ShipNow escuchando en el puerto ${config.port} (${config.nodeEnv})`
    );
  });
}

if (require.main === module) {
  start().catch(async error => {
    logger.fatal(`No se pudo iniciar ShipNow: ${error.message}`);
    await mongoose.disconnect();
    process.exitCode = 1;
  });
}

module.exports = { start };
