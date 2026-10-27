// Importar configuración primero: ante una variable crítica ausente, la app falla antes de escuchar.
const config = require('./config/env.config');
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok', environment: config.nodeEnv }));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use((req, res) => res.status(404).json({ status: 'error', message: 'Ruta no encontrada' }));
app.use((err, req, res, next) => {
  const status = err.statusCode || (err.name === 'CastError' || err.name === 'ValidationError' ? 400 : err.code === 11000 ? 409 : 500);
  if (status === 500) console.error(err);
  res.status(status).json({ status: 'error', message: status === 500 ? 'Error interno del servidor' : err.message });
});
async function start() {
  await connectDB();
  return app.listen(config.port, () => console.log(`ShipNow escuchando en puerto ${config.port} (${config.nodeEnv})`));
}
if (require.main === module) {
  start().catch(async error => { console.error('No se pudo iniciar ShipNow:', error.message); await mongoose.disconnect(); process.exitCode = 1; });
}
module.exports = { app, start };
