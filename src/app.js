
const config = require('./config/env.config');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');


const { AppError } = require('./errors/AppError');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: config.nodeEnv
  });
});


app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/deliveries', require('./routes/delivery.routes'));
app.use('/api/mocks', require('./routes/mocks'));
app.use('/api/logger', require('./routes/logger'));



// Las rutas inexistentes generan un error personalizado.
app.use((req, res, next) => {
  next(new AppError('ROUTE_NOT_FOUND'));
});

// Todos los errores HTTP se responden desde este middleware.
app.use(errorHandler);

module.exports = app;

if (require.main === module) {
  start().catch(async error => {
    logger.fatal(`No se pudo iniciar ShipNow: ${error.message}`);
    await mongoose.disconnect();
    process.exitCode = 1;
  });
}
