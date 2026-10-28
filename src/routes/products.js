const router = require('express').Router();
const controller = require('../controllers/product.controller');

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Listar productos
 *     description: Obtiene productos con paginación, filtros y ordenamiento.
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Número de página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: Cantidad de productos por página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: sort
 *         description: Ordenamiento por precio.
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: query
 *         description: Filtrar productos por categoría.
 *         schema:
 *           type: string
 *       - in: query
 *         name: availableOnly
 *         description: Si es true, devuelve solo productos con stock.
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       '200':
 *         description: Productos obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Product'
 *                       - type: object
 *                         properties:
 *                           stockStatus:
 *                             type: string
 *                             description: Estado calculado según el stock.
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalDocs:
 *                       type: integer
 *       '400':
 *         description: Parámetros de paginación u ordenamiento inválidos (INVALID_DATA).
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

router.get('/', controller.list);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Obtener producto por ID
 *     description: Busca un producto registrado en MongoDB mediante su identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del producto en MongoDB.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Producto encontrado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Identificador inválido (INVALID_DATA).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Producto no encontrado (PRODUCT_NOT_FOUND).
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

router.get('/:id', controller.get);

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Crear producto
 *     description: >
 *       Crea un producto en MongoDB. El código debe ser único,
 *       el precio debe ser un número no negativo y el stock
 *       debe ser un entero no negativo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       '201':
 *         description: Producto creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Datos inválidos o campos obligatorios faltantes (INVALID_DATA).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Código de producto duplicado (DUPLICATE_RESOURCE).
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

router.post('/', controller.create);

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Actualizar producto
 *     description: >
 *       Actualiza uno o más campos editables de un producto.
 *       Si cambia el stock, se actualiza su disponibilidad.
 *       El código del producto no puede estar duplicado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del producto en MongoDB.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       '200':
 *         description: Producto actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Datos inválidos o ausencia de campos editables (INVALID_DATA).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Producto no encontrado (PRODUCT_NOT_FOUND).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Código de producto duplicado (DUPLICATE_RESOURCE).
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

router.put('/:id', controller.update);

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Eliminar producto
 *     description: Elimina un producto de MongoDB mediante su identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del producto en MongoDB.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Producto eliminado correctamente. No devuelve contenido.
 *       '400':
 *         description: Identificador inválido (INVALID_DATA).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Producto no encontrado (PRODUCT_NOT_FOUND).
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

router.delete('/:id', controller.remove);
module.exports = router;
