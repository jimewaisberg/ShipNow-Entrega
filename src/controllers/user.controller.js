const service = require('../services/user.service');
const handler = fn => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
exports.list = handler(async (req, res) => res.json(await service.getAll()));
exports.get = handler(async (req, res) => res.json(await service.getById(req.params.id)));
exports.create = handler(async (req, res) => res.status(201).json(await service.create(req.body)));
exports.update = handler(async (req, res) => res.json(await service.update(req.params.id, req.body)));
exports.remove = handler(async (req, res) => { await service.delete(req.params.id); res.status(204).send(); });
