
const ERROR_DICTIONARY = Object.freeze({
    USER_NOT_FOUND: {
      statusCode: 404,
      message: 'Usuario no encontrado'
    },
    PRODUCT_NOT_FOUND: {
      statusCode: 404,
      message: 'Producto no encontrado'
    },
    ORDER_NOT_FOUND: {
      statusCode: 404,
      message: 'Pedido no encontrado'
    },
    INVALID_DATA: {
      statusCode: 400,
      message: 'Los datos proporcionados son inválidos'
    },
    INVALID_STATUS: {
      statusCode: 400,
      message: 'Estado inválido'
    },
    INVALID_MOCK_QUANTITY: {
      statusCode: 400,
      message: 'qty debe ser un entero entre 1 y 50'
    },
    INVALID_MOCK_TYPE: {
      statusCode: 400,
      message: 'Tipo de mock inválido'
    },
    DUPLICATE_RESOURCE: {
      statusCode: 409,
      message: 'El recurso ya existe'
    },
    MOCKS_DISABLED: {
      statusCode: 403,
      message: 'Mocks no disponibles en producción'
    },
    MOCK_SEED_DISABLED: {
      statusCode: 403,
      message: 'Carga de prueba deshabilitada'
    },
    MOCK_SEED_FAILED: {
      statusCode: 500,
      message: 'No se pudieron insertar los datos de prueba'
    },
    ROUTE_NOT_FOUND: {
      statusCode: 404,
      message: 'Ruta no encontrada'
    },
    INTERNAL_ERROR: {
      statusCode: 500,
      message: 'Error interno del servidor'
    }
  });
  
  module.exports = ERROR_DICTIONARY;
  