const Product = require('../models/Product');
class ProductRepository {
  // La proyección y la paginación están encapsuladas en persistencia.
  async getAll({ limit = 10, page = 1, sort = null, filter = {} } = {}) {
    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : { createdAt: -1 };
    return Product.paginate(filter, { limit, page, sort: sortOption, lean: true, select: '-__v' });
  }
  async getById(id) { return Product.findById(id).select('-__v').lean(); }
  async getByCode(code) { return Product.findOne({ code }).select('_id').lean(); }
  async create(data) { return Product.create(data); }
  async update(id, data) { return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
  async delete(id) { return Product.findByIdAndDelete(id); }
}
module.exports = new ProductRepository();
