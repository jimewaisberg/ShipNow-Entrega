const service = require('../services/upload.service');

const handler = fn => (req, res, next) =>
  Promise.resolve().then(() => fn(req, res)).catch(next);

exports.uploadUserDocument = handler(async (req, res) => {
  const result = await service.uploadUserDocument(
    req.params.id,
    req.file,
    req.body.documentType
  );

  res.status(201).json(result);
});

exports.uploadDeliveryReceipt = handler(async (req, res) => {
  const result = await service.uploadDeliveryReceipt(
    req.params.id,
    req.file
  );

  res.status(201).json(result);
});
