const repository = require('../repositories/product.repository');
const { PRODUCT_STATUS } = require('../constants');
const { HttpError } = require('../utils/errors');
const validateStock = stock => {
  if (!Number.isInteger(stock) || stock < 0) throw new HttpError('stock debe ser un entero no negativo');
};
class ProductService {
  async getAll({ page = 1, limit = 10, sort, query, availableOnly } = {}) {
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) throw new HttpError('Paginación inválida');
    if (sort && !['asc','desc'].includes(sort)) throw new HttpError('sort debe ser asc o desc');
    const filter = {};
    if (query) filter.category = query;
    if (availableOnly) filter.stock = { $gt: 0 };
    const result = await repository.getAll({ page, limit, sort, filter });
    return { products: result.docs.map(p => ({ ...p, stockStatus: p.stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK })), pagination: { page: result.page, limit: result.limit, totalPages: result.totalPages, totalDocs: result.totalDocs } };
  }
  async getById(id) { const item = await repository.getById(id); if (!item) throw new HttpError('Producto no encontrado', 404); return item; }
  async create(data) {
    const { title, code, price, stock, category } = data;
    if (!title || !code || !category || typeof price !== 'number' || price < 0) throw new HttpError('title, code, category y price válido son obligatorios');
    validateStock(stock);
    if (await repository.getByCode(code)) throw new HttpError('Código de producto duplicado', 409);
    return repository.create({ ...data, status: stock > 0 });
  }
  async update(id, data) {
    const allowed = ['title', 'description', 'code', 'price', 'stock', 'category', 'thumbnails'];
    const changes = Object.fromEntries(Object.entries(data).filter(([k]) => allowed.includes(k)));
    if (Object.keys(changes).length === 0) throw new HttpError('No se indicaron campos editables');
    if ('stock' in changes) { validateStock(changes.stock); changes.status = changes.stock > 0; }
    if ('price' in changes && (typeof changes.price !== 'number' || changes.price < 0)) throw new HttpError('price inválido');
    if (changes.code) { const existing = await repository.getByCode(changes.code); if (existing && String(existing._id) !== id) throw new HttpError('Código de producto duplicado', 409); }
    const updated = await repository.update(id, changes);
    if (!updated) throw new HttpError('Producto no encontrado', 404);
    return updated;
  }
  async delete(id) { const deleted = await repository.delete(id); if (!deleted) throw new HttpError('Producto no encontrado', 404); return deleted; }
}
module.exports = new ProductService();
