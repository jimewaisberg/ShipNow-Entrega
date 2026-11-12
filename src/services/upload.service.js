const mongoose = require('mongoose');
const path = require('node:path');
const repository = require('../repositories/upload.repository');
const { AppError } = require('../errors/AppError');
const { cleanupFile } = require('../middlewares/upload.middleware');
const logger = require('../config/logger');

const DOCUMENT_TYPES = Object.freeze([
  'DNI',
  'LICENCIA',
  'OTRO'
]);

function buildMetadata(file, documentType) {
  return {
    originalName: file.originalname,
    filename: file.filename,
    path: path.relative(process.cwd(), file.path),
    mimetype: file.mimetype,
    size: file.size,
    documentType,
    uploadedAt: new Date()
  };
}

async function saveFile({ id, file, documentType, entity }) {
  try {
    if (!file) {
      throw new AppError('FILE_REQUIRED');
    }

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError('INVALID_DATA', 'Identificador inválido');
    }

    if (entity === 'user' && !DOCUMENT_TYPES.includes(documentType)) {
      throw new AppError('INVALID_DOCUMENT_TYPE');
    }

    const type = entity === 'delivery'
      ? 'COMPROBANTE_ENTREGA'
      : documentType;

    const metadata = buildMetadata(file, type);

    const updated = entity === 'user'
      ? await repository.addUserDocument(id, metadata)
      : await repository.addDeliveryReceipt(id, metadata);

    if (!updated) {
      throw new AppError(
        entity === 'user' ? 'USER_NOT_FOUND' : 'DELIVERY_NOT_FOUND'
      );
    }

    logger.info(
      `Archivo asociado correctamente: entidad=${entity}, id=${id}`
    );

    return {
      message: 'Archivo cargado correctamente',
      file: metadata,
      entity: updated
    };
  } catch (error) {
    await cleanupFile(file);

    logger.warning(
      `Error al asociar archivo: entidad=${entity}, codigo=${error.code || 'INTERNAL_ERROR'}`
    );

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('FILE_UPLOAD_FAILED');
  }
}

class UploadService {
  async uploadUserDocument(id, file, documentType) {
    return saveFile({
      id,
      file,
      documentType,
      entity: 'user'
    });
  }

  async uploadDeliveryReceipt(id, file) {
    return saveFile({
      id,
      file,
      entity: 'delivery'
    });
  }
}

module.exports = new UploadService();
module.exports.DOCUMENT_TYPES = DOCUMENT_TYPES;
