
const { PRODUCT_STATUS } = require('./index');

function getProductAvailability(stock) {
  return stock > 0
    ? PRODUCT_STATUS.AVAILABLE
    : PRODUCT_STATUS.OUT_OF_STOCK;
}

function withProductAvailability(product) {
  if (!product) return product;

  const stockStatus = getProductAvailability(product.stock);

  return {
    ...product,
    status: stockStatus === PRODUCT_STATUS.AVAILABLE,
    stockStatus
  };
}

module.exports = {
  getProductAvailability,
  withProductAvailability
};
