
const orderService = require('../services/order.service');

class OrderController {
  async getAll(req, res, next) {
    try {
      const orders = await orderService.getAll();
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const order = await orderService.getById(req.params.id);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const order = await orderService.create(req.body);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const order = await orderService.update(
        req.params.id,
        req.body
      );
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
