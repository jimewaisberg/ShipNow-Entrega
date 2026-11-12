const router = require('express').Router();

const {
  uploadUserDocument,
  uploadDeliveryReceipt
} = require('../config/multer.config');

const { handleUpload } = require('../middlewares/upload.middleware');
const controller = require('../controllers/upload.controller');
const { validateUploadEntity } = require('../middlewares/upload-entity.middleware');

router.post(
  '/users/:id/documents',
  validateUploadEntity('user'),
  handleUpload(uploadUserDocument),
  controller.uploadUserDocument
);

router.post(
  '/deliveries/:id/proof',
  validateUploadEntity('delivery'),
  handleUpload(uploadDeliveryReceipt),
  controller.uploadDeliveryReceipt
);

/**
 * @openapi
 * /api/users/{id}/documents:
 *   post:
 *     tags: [Uploads]
 *     summary: Subir documento de usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, documentType]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF, JPG o PNG, máximo 5 MB
 *               documentType:
 *                 type: string
 *                 enum: [DNI, LICENCIA, OTRO]
 *     responses:
 *       '201':
 *         description: Documento guardado correctamente
 *       '400':
 *         description: Archivo faltante, inválido o tipo de documento incorrecto
 *       '404':
 *         description: Usuario inexistente
 *       '413':
 *         description: Archivo demasiado grande
 *       '500':
 *         description: Error interno
 *
 * /api/deliveries/{id}/proof:
 *   post:
 *     tags: [Uploads]
 *     summary: Subir comprobante de entrega
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF, JPG o PNG, máximo 5 MB
 *     responses:
 *       '201':
 *         description: Comprobante guardado correctamente
 *       '400':
 *         description: Archivo faltante o inválido
 *       '404':
 *         description: Entrega inexistente
 *       '413':
 *         description: Archivo demasiado grande
 *       '500':
 *         description: Error interno
 */

module.exports = router;
