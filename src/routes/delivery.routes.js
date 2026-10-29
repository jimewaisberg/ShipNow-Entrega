
const express = require('express');
const router = express.Router();

const deliveryController = require('../controllers/delivery.controller');

router.get('/', (req, res, next) =>
  deliveryController.getAll(req, res, next)
);

router.get('/:id', (req, res, next) =>
  deliveryController.getById(req, res, next)
);

router.post('/', (req, res, next) =>
  deliveryController.create(req, res, next)
);

router.put('/:id', (req, res, next) =>
  deliveryController.update(req, res, next)
);

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Obtener todas las entregas
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: Lista de entregas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *   post:
 *     summary: Crear una entrega
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [order, destination]
 *             properties:
 *               order:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               driver:
 *                 type: string
 *                 nullable: true
 *                 example: "507f191e810c19729de860ea"
 *               destination:
 *                 type: string
 *                 example: "Av. Corrientes 1234, Buenos Aires"
 *     responses:
 *       201:
 *         description: Entrega creada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Pedido o repartidor inexistente
 *       409:
 *         description: El pedido ya tiene una entrega
 *
 * /api/deliveries/{id}:
 *   get:
 *     summary: Obtener una entrega por ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entrega encontrada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Entrega no encontrada
 *   put:
 *     summary: Actualizar una entrega
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, ASSIGNED, IN_TRANSIT, DELIVERED]
 *               driver:
 *                 type: string
 *                 nullable: true
 *               destination:
 *                 type: string
 *                 example: "Av. Santa Fe 1500, Buenos Aires"
 *     responses:
 *       200:
 *         description: Entrega actualizada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Entrega o repartidor inexistente
 */

module.exports = router;
