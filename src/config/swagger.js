
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'ShipNow API',
      version: '1.0.0',
      description:
        'API REST para gestionar usuarios, productos y datos de prueba. Incluye manejo centralizado de errores y logging con Winston.'
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor local de desarrollo'
      }
    ],
    tags: [
      {
        name: 'Users',
        description: 'Gestión de usuarios'
      },
      {
        name: 'Orders',
        description: 'Pedidos y generación de pedidos ficticios'
      },
      {
        name: 'Deliveries',
        description: 'Entregas y generación de entregas ficticias'
      },
      {
        name: 'Mocks',
        description: 'Generación y carga de datos de prueba'
      },
      {
        name: 'Logger',
        description: 'Validación interna del sistema de logs'
      },
      {
        name: 'Products',
        description: 'Gestión de productos'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Identificador del usuario en MongoDB'
            },
            first_name: {
              type: 'string',
              example: 'Ana'
            },
            last_name: {
              type: 'string',
              example: 'García'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'ana@example.com'
            },
            age: {
              type: 'integer',
              minimum: 0,
              example: 25
            },
            role: {
              type: 'string',
              example: 'user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },

        CreateUser: {
          type: 'object',
          required: [
            'first_name',
            'last_name',
            'email',
            'age',
            'password'
          ],
          properties: {
            first_name: {
              type: 'string',
              example: 'Ana'
            },
            last_name: {
              type: 'string',
              example: 'García'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'ana@example.com'
            },
            age: {
              type: 'integer',
              minimum: 0,
              example: 25
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              writeOnly: true,
              example: 'claveSegura123'
            }
          }
        },

        UpdateUser: {
          type: 'object',
          description:
            'Permite modificar nombre, apellido o edad. Se requiere al menos un campo editable.',
          minProperties: 1,
          properties: {
            first_name: {
              type: 'string',
              example: 'Ana María'
            },
            last_name: {
              type: 'string',
              example: 'García'
            },
            age: {
              type: 'integer',
              minimum: 0,
              example: 26
            }
          }
        },

        ErrorResponse: {
          type: 'object',
          description:
            'Formato uniforme del middleware global de errores.',
          required: [
            'status',
            'code',
            'message'
          ],
          properties: {
            status: {
              type: 'string',
              enum: ['error'],
              example: 'error'
            },
            code: {
              type: 'string',
              description: 'Código interno del error.',
              example: 'USER_NOT_FOUND'
            },
            message: {
              type: 'string',
              description: 'Mensaje descriptivo del error.',
              example: 'Usuario no encontrado'
            }
          }
        },

        SuccessResponse: {
          type: 'object',
          description:
            'Formato de respuesta utilizado por endpoints que devuelven estado y mensaje, como la prueba del logger.',
          required: [
            'status',
            'message'
          ],
          properties: {
            status: {
              type: 'string',
              enum: ['success'],
              example: 'success'
            },
            message: {
              type: 'string',
              example: 'Operación realizada correctamente'
            }
          }
        },

        Order: {
          type: 'object',
          description:
            'Pedido almacenado en MongoDB. Actualmente los pedidos se generan mediante el módulo de mocks.',
          properties: {
            _id: {
              type: 'string',
              description: 'Identificador del pedido en MongoDB.'
            },
            customer: {
              type: 'string',
              description: 'Identificador del usuario que realizó el pedido.'
            },
            status: {
              type: 'string',
              description: 'Estado del pedido.',
              example: 'PENDING'
            },
            priority: {
              type: 'string',
              description: 'Prioridad del pedido.',
              example: 'NORMAL'
            },
            total: {
              type: 'number',
              minimum: 0,
              example: 1250
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },

        Delivery: {
          type: 'object',
          description:
            'Entrega asociada a un pedido de ShipNow.',
          properties: {
            _id: {
              type: 'string',
              description: 'Identificador de la entrega en MongoDB.'
            },
            order: {
              type: 'string',
              description: 'Identificador del pedido asociado.'
            },
            driver: {
              type: 'string',
              nullable: true,
              description:
                'Identificador del repartidor o null si no está asignado.'
            },
            status: {
              type: 'string',
              description: 'Estado de la entrega.',
              example: 'PENDING'
            },
            destination: {
              type: 'string',
              example: 'Calle de prueba 100, Buenos Aires'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },

        OrderItem: {
          type: 'object',
          description:
            'Schema de referencia solicitado para la documentación. El modelo Order actual no almacena ítems ni dispone de endpoints para administrarlos.',
          properties: {
            product: {
              type: 'string',
              description: 'Identificador del producto.'
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              example: 2
            },
            unitPrice: {
              type: 'number',
              minimum: 0,
              example: 500
            }
          }
        },

        Product: {
          type: 'object',
          description: 'Producto registrado en MongoDB.',
          properties: {
            _id: {
              type: 'string',
              description: 'Identificador del producto en MongoDB.'
            },
            title: {
              type: 'string',
              example: 'Auriculares inalámbricos'
            },
            description: {
              type: 'string',
              example: 'Auriculares con conexión Bluetooth'
            },
            code: {
              type: 'string',
              example: 'AUR-001'
            },
            price: {
              type: 'number',
              minimum: 0,
              example: 25000
            },

stock: {
    type: 'integer',
    minimum: 0,
    description: 'Cantidad disponible. Fuente única de verdad para calcular la disponibilidad.',
    example: 15
  },
  status: {
    type: 'boolean',
    readOnly: true,
    description: 'Disponibilidad calculada a partir del stock. No se almacena en MongoDB.',
    example: true
  },
  stockStatus: {
    type: 'string',
    readOnly: true,
    enum: ['AVAILABLE', 'OUT_OF_STOCK'],
    description: 'Estado calculado a partir del stock utilizando PRODUCT_STATUS.',
    example: 'AVAILABLE'
  },

            category: {
              type: 'string',
              example: 'Electrónica'
            },
            thumbnails: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: [
                'https://example.com/auriculares.jpg'
              ]
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },

        CreateProduct: {
          type: 'object',
          required: [
            'title',
            'code',
            'price',
            'stock',
            'category'
          ],
          properties: {
            title: {
              type: 'string',
              example: 'Auriculares inalámbricos'
            },
            description: {
              type: 'string',
              example: 'Auriculares Bluetooth'
            },
            code: {
              type: 'string',
              example: 'AUR-001'
            },
            price: {
              type: 'number',
              minimum: 0,
              example: 25000
            },
            stock: {
              type: 'integer',
              minimum: 0,
              example: 15
            },
            category: {
              type: 'string',
              example: 'Electrónica'
            },
            thumbnails: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        },

        UpdateProduct: {
          type: 'object',
          description:
            'Permite modificar los campos editables de un producto. Se requiere al menos uno.',
          minProperties: 1,
          properties: {
            title: {
              type: 'string',
              example: 'Auriculares nuevos'
            },
            description: {
              type: 'string',
              example: 'Descripción actualizada'
            },
            code: {
              type: 'string',
              example: 'AUR-002'
            },
            price: {
              type: 'number',
              minimum: 0,
              example: 28000
            },
            stock: {
              type: 'integer',
              minimum: 0,
              example: 20
            },
            category: {
              type: 'string',
              example: 'Electrónica'
            },
            thumbnails: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  },

  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

