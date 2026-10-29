
const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');

router.get('/', (req, res, next) =>
  orderController.getAll(req, res, next)
);

router.get('/:id', (req, res, next) =>
  orderController.getById(req, res, next)
);

router.post('/', (req, res, next) =>
  orderController.create(req, res, next)
);

router.put('/:id', (req, res, next) =>
  orderController.update(req, res, next)
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener todos los pedidos
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *   post:
 *     summary: Crear un pedido
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customer, total]
 *             properties:
 *               customer:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               total:
 *                 type: number
 *                 minimum: 0
 *                 example: 1500
 *               priority:
 *                 type: string
 *                 enum: [LOW, NORMAL, HIGH]
 *                 example: NORMAL
 *     responses:
 *       201:
 *         description: Pedido creado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Cliente no encontrado
 *
 * /api/orders/{id}:
 *   get:
 *     summary: Obtener un pedido por ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Pedido no encontrado
 *   put:
 *     summary: Actualizar estado o prioridad de un pedido
 *     tags: [Orders]
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
 *                 enum: [PENDING, SHIPPED, DELIVERED]
 *               priority:
 *                 type: string
 *                 enum: [LOW, NORMAL, HIGH]
 *     responses:
 *       200:
 *         description: Pedido actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Pedido no encontrado
 */

module.exports = router;
