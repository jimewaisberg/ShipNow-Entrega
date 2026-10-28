
const router = require('express').Router();
const controller = require('../controllers/user.controller');

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Listar usuarios
 *     description: Obtiene todos los usuarios registrados en MongoDB.
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', controller.list);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener usuario por ID
 *     description: Busca un usuario registrado mediante su identificador de MongoDB.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Usuario encontrado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Identificador inválido.
 *       '404':
 *         description: Usuario no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */

router.get('/:id', controller.get);

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Crear usuario
 *     description: Crea un usuario en MongoDB. La contraseña se almacena encriptada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       '201':
 *         description: Usuario creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Datos inválidos o campos obligatorios faltantes.
 *       '409':
 *         description: El correo electrónico ya está registrado.
 *       '500':
 *         description: Error interno del servidor.
 */

router.post('/', controller.create);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Actualizar usuario
 *     description: Permite modificar el nombre, apellido o edad de un usuario existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del usuario en MongoDB.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       '200':
 *         description: Usuario actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Datos inválidos o ningún campo editable enviado.
 *       '404':
 *         description: Usuario no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */

router.put('/:id', controller.update);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Eliminar usuario
 *     description: Elimina un usuario de MongoDB mediante su identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del usuario en MongoDB.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Usuario eliminado correctamente. No devuelve contenido.
 *       '400':
 *         description: Identificador inválido.
 *       '404':
 *         description: Usuario no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */

router.delete('/:id', controller.remove);

module.exports = router;
