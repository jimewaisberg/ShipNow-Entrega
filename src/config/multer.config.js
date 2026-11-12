const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');
const { randomUUID } = require('node:crypto');
const { AppError } = require('../errors/AppError');

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png'
};

const DIRECTORIES = {
  user: path.resolve(__dirname, '../../uploads/users/documents'),
  delivery: path.resolve(__dirname, '../../uploads/deliveries/receipts')
};

function createUploader(kind) {
  const directory = DIRECTORIES[kind];

  if (!directory) {
    throw new Error('Tipo de almacenamiento desconocido');
  }

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      try {
        fs.mkdirSync(directory, { recursive: true });
        cb(null, directory);
      } catch (error) {
        cb(new AppError('FILE_UPLOAD_FAILED'));
      }
    },

    filename(req, file, cb) {
      const extension = ALLOWED_TYPES[file.mimetype];

      cb(null, `${randomUUID()}${extension}`);
    }
  });

  return multer({
    storage,
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1,
      fields: 5
    },

    fileFilter(req, file, cb) {
      if (!Object.hasOwn(ALLOWED_TYPES, file.mimetype)) {
        return cb(new AppError('INVALID_FILE_TYPE'));
      }

      cb(null, true);
    }
  });
}

module.exports = {
  uploadUserDocument: createUploader('user'),
  uploadDeliveryReceipt: createUploader('delivery'),
  MAX_FILE_SIZE,
  ALLOWED_TYPES,
  DIRECTORIES
};
