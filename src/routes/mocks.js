
const { Router } = require('express');
const controller = require('../controllers/mock.controller');

const router = Router();

/**
 * @openapi
 * /api/mocks/users:
 *   get:
 *     tags:
 *       - Mocks
 *     summary: Generar usuarios ficticios
 *     description: >
 *       Genera usuarios de prueba sin guardarlos en MongoDB.
 *       Solo funciona fuera de producción. Si no se indica qty,
 *       genera 5 usuarios.
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         description: Cantidad de usuarios a generar, entre 1 y 50.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 5
 *         example: 2
 *     responses:
 *       '200':
 *         description: Usuarios ficticios generados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   mockId:
 *                     type: string
 *                     example: user-abc123-0
 *                   first_name:
 *                     type: string
 *                     example: Ana
 *                   last_name:
 *                     type: string
 *                     example: Pérez
 *                   email:
 *                     type: string
 *                     example: ana@example.test
 *                   age:
 *                     type: integer
 *                     example: 25
 *                   role:
 *                     type: string
 *                     example: user
 *       '400':
 *         description: Cantidad inválida (INVALID_MOCK_QUANTITY).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Mocks deshabilitados en producción (MOCKS_DISABLED).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/users', controller.users);

/**
 * @openapi
 * /api/mocks/drivers:
 *   get:
 *     tags:
 *       - Mocks
 *     summary: Generar repartidores ficticios
 *     description: >
 *       Genera repartidores ficticios sin guardarlos en MongoDB.
 *       qty determina la cantidad base para generar datos.
 *       Se genera al menos un repartidor y uno por cada tres
 *       usuarios aproximadamente, redondeando hacia arriba.
 *       Solo está disponible fuera de producción.
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         description: Cantidad base, entre 1 y 50. Por defecto, 5.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 5
 *     responses:
 *       '200':
 *         description: Repartidores ficticios generados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   mockId:
 *                     type: string
 *                     example: driver-abc123-0
 *                   first_name:
 *                     type: string
 *                     example: María
 *                   last_name:
 *                     type: string
 *                     example: García
 *                   email:
 *                     type: string
 *                     example: shipnow.driver.abc123.0@example.test
 *                   age:
 *                     type: integer
 *                     example: 22
 *                   role:
 *                     type: string
 *                     description: Rol de repartidor.
 *       '400':
 *         description: Cantidad inválida (INVALID_MOCK_QUANTITY).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Mocks deshabilitados en producción (MOCKS_DISABLED).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/drivers', controller.drivers);

/**
 * @openapi
 * /api/mocks/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Generar pedidos ficticios
 *     description: >
 *       Genera pedidos de prueba sin guardarlos en MongoDB.
 *       Los clientes se identifican mediante IDs temporales.
 *       Solo está disponible fuera de producción.
 *       Si no se indica qty, genera 5 pedidos.
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         description: Cantidad de pedidos a generar, entre 1 y 50.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 5
 *         example: 2
 *     responses:
 *       '200':
 *         description: Pedidos ficticios generados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   mockId:
 *                     type: string
 *                     example: order-abc123-0
 *                   customer:
 *                     type: string
 *                     example: user-abc123-0
 *                   status:
 *                     type: string
 *                     example: PENDING
 *                   priority:
 *                     type: string
 *                     example: NORMAL
 *                   total:
 *                     type: number
 *                     minimum: 0
 *                     example: 1250
 *       '400':
 *         description: Cantidad inválida (INVALID_MOCK_QUANTITY).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Mocks deshabilitados en producción (MOCKS_DISABLED).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/orders', controller.orders);

/**
 * @openapi
 * /api/mocks/deliveries:
 *   get:
 *     tags:
 *       - Deliveries
 *     summary: Generar entregas ficticias
 *     description: >
 *       Genera entregas de prueba sin guardarlas en MongoDB.
 *       Cada entrega se relaciona con un pedido mediante un ID temporal.
 *       Algunas entregas no tienen repartidor asignado.
 *       Solo está disponible fuera de producción.
 *       Si no se indica qty, genera 5 entregas.
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         description: Cantidad de entregas a generar, entre 1 y 50.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 5
 *         example: 2
 *     responses:
 *       '200':
 *         description: Entregas ficticias generadas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   mockId:
 *                     type: string
 *                     example: delivery-abc123-0
 *                   order:
 *                     type: string
 *                     example: order-abc123-0
 *                   driver:
 *                     type: string
 *                     nullable: true
 *                     description: ID temporal del repartidor o null.
 *                     example: null
 *                   status:
 *                     type: string
 *                     example: PENDING
 *                   destination:
 *                     type: string
 *                     example: Calle de prueba 100, Buenos Aires
 *       '400':
 *         description: Cantidad inválida (INVALID_MOCK_QUANTITY).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Mocks deshabilitados en producción (MOCKS_DISABLED).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/deliveries', controller.deliveries);

/**
 * @openapi
 * /api/mocks/bundle:
 *   get:
 *     tags:
 *       - Mocks
 *     summary: Generar conjunto de datos ficticios
 *     description: >
 *       Genera usuarios, repartidores, pedidos y entregas relacionados
 *       mediante identificadores temporales.
 *       No guarda datos en MongoDB.
 *       Solo está disponible fuera de producción.
 *       Por defecto utiliza qty=5.
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         description: Cantidad base de generación, entre 1 y 50.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 5
 *         example: 2
 *     responses:
 *       '200':
 *         description: Conjunto de datos ficticios generado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - users
 *                 - drivers
 *                 - orders
 *                 - deliveries
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Usuario ficticio con datos de prueba.
 *                 drivers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Repartidor ficticio.
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       mockId:
 *                         type: string
 *                       customer:
 *                         type: string
 *                       status:
 *                         type: string
 *                       priority:
 *                         type: string
 *                       total:
 *                         type: number
 *                 deliveries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       mockId:
 *                         type: string
 *                       order:
 *                         type: string
 *                       driver:
 *                         type: string
 *                         nullable: true
 *                       status:
 *                         type: string
 *                       destination:
 *                         type: string
 *       '400':
 *         description: Cantidad inválida (INVALID_MOCK_QUANTITY).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Mocks deshabilitados en producción (MOCKS_DISABLED).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/bundle', controller.bundle);

/**
 * @openapi
 * /api/mocks/seed:
 *   post:
 *     tags:
 *       - Mocks
 *     summary: Insertar datos ficticios en MongoDB
 *     description: >
 *       Genera e inserta usuarios, repartidores, pedidos y entregas
 *       relacionados. Solo está disponible fuera de producción cuando
 *       MOCK_SEED_ENABLED=true. Si no se indica qty, utiliza 5.
 *       Esta operación modifica la base de datos.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qty:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 50
 *                 default: 5
 *                 example: 2
 *     responses:
 *       '201':
 *         description: Datos ficticios insertados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inserted:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: integer
 *                     drivers:
 *                       type: integer
 *                     orders:
 *                       type: integer
 *                     deliveries:
 *                       type: integer
 *                 total:
 *                   type: integer
 *                 ids:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: string
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: string
 *                     deliveries:
 *                       type: array
 *                       items:
 *                         type: string
 *       '400':
 *         description: Cantidad inválida (INVALID_MOCK_QUANTITY).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Carga deshabilitada (MOCK_SEED_DISABLED).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Falló la inserción (MOCK_SEED_FAILED) u ocurrió un error interno.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/seed', controller.seed);

module.exports = router;
