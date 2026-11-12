const fs = require('node:fs/promises');
const multer = require('multer');
const { AppError } = require('../errors/AppError');
const logger = require('../config/logger');

async function cleanupFile(file) {
  if (file?.path) {
    await fs.unlink(file.path).catch(() => {});
  }
}

function isValidSignature(mimetype, bytes) {
  if (mimetype === 'application/pdf') {
    return bytes.subarray(0, 5).toString() === '%PDF-';
  }

  if (mimetype === 'image/jpeg') {
    return bytes.length >= 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff;
  }

  if (mimetype === 'image/png') {
    return bytes.subarray(0, 8).equals(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
    );
  }

  return false;
}

function mapUploadError(error) {
  if (error instanceof AppError) return error;

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return new AppError('FILE_TOO_LARGE');
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE' ||
        error.code === 'LIMIT_FILE_COUNT') {
      return new AppError('UNEXPECTED_FILE_FIELD');
    }

    return new AppError('INVALID_DATA');
  }

  return new AppError('FILE_UPLOAD_FAILED');
}

function handleUpload(uploader) {
  return (req, res, next) => {
    uploader.single('file')(req, res, async error => {
      if (error) {
        await cleanupFile(req.file);
        logger.warning('Carga de archivo rechazada');
        return next(mapUploadError(error));
      }

      if (!req.file) {
        return next(new AppError('FILE_REQUIRED'));
      }

      try {
        const handle = await fs.open(req.file.path, 'r');

        let bytes;
        try {
          const buffer = Buffer.alloc(8);
          const { bytesRead } = await handle.read(buffer, 0, 8, 0);
          bytes = buffer.subarray(0, bytesRead);
        } finally {
          await handle.close();
        }

        if (!isValidSignature(req.file.mimetype, bytes)) {
          await cleanupFile(req.file);
          logger.warning('Archivo rechazado por firma inválida');
          return next(new AppError('INVALID_FILE_TYPE'));
        }

        return next();
      } catch (error) {
        await cleanupFile(req.file);
        return next(new AppError('FILE_UPLOAD_FAILED'));
      }
    });
  };
}

module.exports = {
  handleUpload,
  cleanupFile,
  isValidSignature,
  mapUploadError
};
