# ShipNow — Pre-entrega Módulo 1

API REST de **Productos y Usuarios**, refactorizada sobre el proyecto previo de e-commerce. Esta entrega se enfoca en arquitectura Controller → Service → Repository, separación de persistencia, constantes de dominio y configuración validada.

## Instalación

1. Instalar Node.js y tener una instancia MongoDB local o Atlas disponible.
2. Ejecutar `npm install`.
3. Copiar `.env.example` como `.env` y colocar valores propios. **Nunca subir `.env` al repositorio.**
4. Ejecutar `npm run dev` (desarrollo) o `npm start`.
5. Ejecutar `npm test` para verificar constantes y configuración obligatoria.

La aplicación no inicia si falta `PORT`, `NODE_ENV` o `MONGODB_URI`, si `PORT` no es válido, o si MongoDB no logra conectar.

## Estructura

```text
src/
  app.js
  config/            env.config.js, database.js
  constants/         index.js
  controllers/       product.controller.js, user.controller.js
  services/          product.service.js, user.service.js
  repositories/      product.repository.js, user.repository.js
  models/            Product.js, User.js
  routes/            products.js, users.js
  utils/             errors.js
```

### Responsabilidades

- **Routes:** asocian métodos y URLs con controladores.
- **Controllers:** reciben `req`, extraen parámetros y responden con HTTP, sin importar Mongoose.
- **Services:** aplican validaciones y reglas de negocio, por ejemplo unicidad de código, stock positivo, roles y hash de contraseñas.
- **Repositories:** conocen los modelos Mongoose, encapsulan consultas, proyecciones, filtros, paginación y escritura.
- **Config:** concentra `process.env`, valida las claves al iniciar y gestiona conexión.
- **Constants:** elimina strings mágicos de roles y estados usando `Object.freeze`.

No se usa la capa DAO adicional del proyecto previo: aquí el Repository es la frontera única con Mongoose, como exige esta consigna.

## Endpoints

| Método | URL | Descripción |
| --- | --- | --- |
| GET | `/health` | Salud básica |
| GET | `/api/products` | Listar con `page`, `limit`, `sort=asc/desc`, `query` (categoría), `availableOnly=true` |
| GET | `/api/products/:id` | Obtener producto |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/:id` | Actualizar producto |
| DELETE | `/api/products/:id` | Eliminar producto |
| GET | `/api/users` | Listar usuarios sin contraseñas |
| GET | `/api/users/:id` | Obtener usuario sin contraseña |
| POST | `/api/users` | Crear usuario con rol USER y contraseña hasheada |
| PUT | `/api/users/:id` | Actualizar nombre, apellido o edad |
| DELETE | `/api/users/:id` | Eliminar usuario |

### Ejemplos

```bash
curl http://localhost:8080/api/products
curl -X POST http://localhost:8080/api/products -H 'Content-Type: application/json' -d '{"title":"Caja mediana","description":"Caja para envíos","code":"CX-001","price":20,"stock":4,"category":"embalaje"}'
curl -X POST http://localhost:8080/api/users -H 'Content-Type: application/json' -d '{"first_name":"Ana","last_name":"García","email":"ana@example.com","age":25,"password":"claveSegura123"}'
```

## Alcance y seguridad

Esta pre-entrega es una **API de práctica** centrada en capas: las rutas de escritura no incorporan autenticación/autorización. No se debe exponer en producción sin agregarlas. Por diseño, crear usuarios siempre asigna rol USER y no expone contraseñas. Se mantienen los nombres de campos del modelo original de productos para aprovechar la base de código previa.

Proyecto adaptado a partir de la API de e-commerce original para la actividad ShipNow.
