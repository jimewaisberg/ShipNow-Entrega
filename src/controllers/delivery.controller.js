
const deliveryService = require('../services/delivery.service');

class DeliveryController {
  async getAll(req, res, next) {
    try {
      const deliveries = await deliveryService.getAll();
      res.status(200).json(deliveries);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const delivery = await deliveryService.getById(req.params.id);
      res.status(200).json(delivery);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const delivery = await deliveryService.create(req.body);
      res.status(201).json(delivery);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const delivery = await deliveryService.update(
        req.params.id,
        req.body
      );
      res.status(200).json(delivery);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DeliveryController();
