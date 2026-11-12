
const ERROR_DICTIONARY = Object.freeze({
    FILE_REQUIRED: {
      statusCode: 400,
      message: 'Se requiere adjuntar un archivo'
    },
    INVALID_FILE_TYPE: {
      statusCode: 400,
      message: 'Tipo de archivo no permitido'
    },
    FILE_TOO_LARGE: {
      statusCode: 413,
      message: 'El archivo supera el tamaño máximo permitido'
    },
    INVALID_DOCUMENT_TYPE: {
      statusCode: 400,
      message: 'Tipo de documento inválido'
    },
    UNEXPECTED_FILE_FIELD: {
      statusCode: 400,
      message: 'Campo de archivo inesperado'
    },
    FILE_UPLOAD_FAILED: {
      statusCode: 500,
      message: 'No se pudo guardar el archivo'
    },
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
    DELIVERY_NOT_FOUND: {
      statusCode: 404,
      message: 'Entrega no encontrada'
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
  