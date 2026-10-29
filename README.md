# ShipNow — API REST

ShipNow API es una API REST desarrollada con Node.js, Express y MongoDB, organizada mediante una arquitectura por capas.

El proyecto incluye las pre-entregas correspondientes a los siguientes módulos:

- **Módulo 1:** Arquitectura por capas, configuración del entorno y conexión a MongoDB.
- **Módulo 2:** Generación de datos ficticios (mocks) para realizar pruebas.
- **Módulo 3:** Manejo profesional y centralizado de errores mediante errores personalizados y un middleware global.
- **Módulo 4:** Logging y monitoreo básico con Winston, persistencia de errores y rotación automática de archivos.
- **Módulo 5:** Documentación profesional de la API con Swagger UI y OpenAPI.

## Módulo 1 — Arquitectura por capas

La API está organizada siguiendo la estructura:

**Routes → Controllers → Services → Repositories → Models**

Cada capa tiene una responsabilidad específica:

- **Routes:** definen los endpoints disponibles.
- **Controllers:** reciben las solicitudes HTTP y delegan las operaciones.
- **Services:** implementan la lógica de negocio y las validaciones.
- **Repositories:** realizan las operaciones de acceso a MongoDB.
- **Models:** definen los esquemas de datos con Mongoose.

Se implementaron endpoints para administrar usuarios y productos, configuraciones mediante variables de entorno y constantes compartidas.

## Instalación y configuración

Requisitos: Node.js, npm y una conexión a MongoDB local o MongoDB Atlas.

1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Copiar `.env.example` a `.env`.
4. Configurar `PORT`, `NODE_ENV` y `MONGODB_URI`.
5. Iniciar el servidor con `npm run dev`.

Ejemplo de configuración:

```dotenv
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow
MOCK_SEED_ENABLED=false
```

Si se utiliza MongoDB Atlas, reemplazar `MONGODB_URI` por una cadena de conexión propia.

**Importante:** nunca publicar el archivo `.env` ni las credenciales de MongoDB.

Para ejecutar las pruebas:

```bash
npm test
```

## Módulo 2 — Mocking y carga de datos de prueba

Se incorporó un sistema de generación de datos ficticios para probar el funcionamiento de ShipNow sin depender de información real.

El módulo permite generar:

- Usuarios con rol `user`.
- Repartidores con rol `driver`.
- Pedidos con estados y prioridades válidos.
- Entregas relacionadas con pedidos y repartidores.

### Endpoints de mocking

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/mocks/users?qty=2` | Genera usuarios ficticios |
| GET | `/api/mocks/drivers?qty=2` | Genera repartidores ficticios |
| GET | `/api/mocks/orders?qty=2` | Genera pedidos ficticios |
| GET | `/api/mocks/deliveries?qty=2` | Genera entregas ficticias |
| GET | `/api/mocks/bundle?qty=2` | Genera un conjunto de datos relacionados |
| POST | `/api/mocks/seed` | Inserta datos ficticios en MongoDB |

Los endpoints GET generan datos temporalmente y **no los guardan en MongoDB**.

La cantidad `qty` es opcional, tiene un valor predeterminado de 5 y admite enteros entre 1 y 50.

### Ejemplos de uso

Generar usuarios:

```bash
curl "http://localhost:8080/api/mocks/users?qty=2"
```

Generar un conjunto completo:

```bash
curl "http://localhost:8080/api/mocks/bundle?qty=2"
```

### Inserción en MongoDB

El endpoint `POST /api/mocks/seed` permite guardar datos ficticios en MongoDB.

Para habilitarlo, configurar en el archivo `.env`:

```dotenv
MOCK_SEED_ENABLED=true
```

Reiniciar el servidor después de modificar la configuración.

Ejemplo:

```bash
curl -i -X POST "http://localhost:8080/api/mocks/seed" \
  -H "Content-Type: application/json" \
  -d '{"qty":10}'
```

Para `qty=10`, se generan 10 clientes, 4 repartidores, 10 pedidos y 10 entregas.

La respuesta informa las cantidades insertadas y los identificadores creados en MongoDB.

Los identificadores temporales `mockId` se sustituyen por referencias reales de MongoDB durante la inserción.

Si ocurre una falla, el repositorio intenta eliminar los registros creados durante esa ejecución. Este mecanismo **no constituye una transacción de MongoDB**, por lo que no garantiza atomicidad completa.

Las contraseñas ficticias se almacenan mediante hashes y los correos utilizan el dominio de prueba `example.test`.

### Seguridad

La carga de mocks está deshabilitada por defecto y también en producción.

Después de realizar las pruebas, se recomienda configurar:

```dotenv
MOCK_SEED_ENABLED=false
```

**El endpoint no incluye autenticación.** No debe habilitarse en servidores públicos ni utilizarse con bases de datos de producción.

## Módulo 3 — Manejo profesional de errores

Se implementó una capa centralizada para gestionar los errores de la API y devolver respuestas HTTP uniformes.

El objetivo es evitar que cada controller o ruta construya respuestas de error de manera independiente.

### Estructura del sistema de errores

- `src/errors/errorDictionary.js`: contiene los códigos de error, mensajes y estados HTTP.
- `src/errors/AppError.js`: define la clase base de errores y errores personalizados.
- `src/middlewares/errorHandler.js`: middleware global encargado de transformar los errores en respuestas HTTP.
- `src/services/`: contiene las validaciones y genera errores cuando se incumplen reglas de negocio.

Los controllers envían los errores al middleware mediante `next`, mientras que los services detectan los casos inválidos.

### Formato de respuesta de error

Todos los errores HTTP utilizan la siguiente estructura JSON:

```json
{
  "status": "error",
  "code": "INVALID_MOCK_QUANTITY",
  "message": "qty debe ser un entero entre 1 y 50"
}
```

Los campos representan:

- `status`: indica que ocurrió un error.
- `code`: identifica el tipo de error.
- `message`: describe el problema de forma comprensible.

El estado HTTP correspondiente se envía en la respuesta.

### Errores personalizados

Entre los códigos implementados se encuentran:

| Código | HTTP | Descripción |
|---|---|---|
| `USER_NOT_FOUND` | 404 | Usuario inexistente |
| `PRODUCT_NOT_FOUND` | 404 | Producto inexistente |
| `ORDER_NOT_FOUND` | 404 | Pedido inexistente |
| `INVALID_DATA` | 400 | Datos inválidos |
| `INVALID_STATUS` | 400 | Estado inválido |
| `INVALID_MOCK_QUANTITY` | 400 | Cantidad de mocks inválida |
| `INVALID_MOCK_TYPE` | 400 | Tipo de mock inválido |
| `DUPLICATE_RESOURCE` | 409 | Recurso duplicado |
| `MOCKS_DISABLED` | 403 | Mocks no disponibles en producción |
| `MOCK_SEED_DISABLED` | 403 | Inserción de mocks deshabilitada |
| `MOCK_SEED_FAILED` | 500 | Falla durante la inserción de mocks |
| `ROUTE_NOT_FOUND` | 404 | Ruta inexistente |
| `INTERNAL_ERROR` | 500 | Error interno inesperado |

Algunos errores representan situaciones del dominio y otros permiten controlar fallas técnicas.

### Cómo probar el manejo de errores

Primero, iniciar el servidor:

```bash
npm run dev
```

Abrir otra terminal para ejecutar las solicitudes de prueba.

**1. Ruta inexistente — HTTP 404**

```bash
curl -i "http://localhost:8080/api/ruta-inexistente"
```

Respuesta esperada:

```json
{
  "status": "error",
  "code": "ROUTE_NOT_FOUND",
  "message": "Ruta no encontrada"
}
```

**2. Cantidad negativa de mocks — HTTP 400**

```bash
curl -i "http://localhost:8080/api/mocks/users?qty=-5"
```

Respuesta esperada:

```json
{
  "status": "error",
  "code": "INVALID_MOCK_QUANTITY",
  "message": "qty debe ser un entero entre 1 y 50"
}
```

**3. Cantidad superior al máximo permitido — HTTP 400**

```bash
curl -i "http://localhost:8080/api/mocks/users?qty=100"
```

**4. Cantidad no numérica — HTTP 400**

```bash
curl -i "http://localhost:8080/api/mocks/users?qty=abc"
```

**5. Carga de mocks deshabilitada — HTTP 403**

Con `MOCK_SEED_ENABLED=false`:

```bash
curl -i -X POST "http://localhost:8080/api/mocks/seed" \
  -H "Content-Type: application/json" \
  -d '{"qty":2}'
```

Respuesta esperada:

```json
{
  "status": "error",
  "code": "MOCK_SEED_DISABLED",
  "message": "Carga de prueba deshabilitada"
}
```

### Manejo de errores de MongoDB y Mongoose

El middleware global reconoce errores habituales de la base de datos:

| Error | HTTP | Código de respuesta |
|---|---|---|
| `CastError` | 400 | `INVALID_DATA` |
| `ValidationError` | 400 | `INVALID_DATA` |
| Código MongoDB `11000` | 409 | `DUPLICATE_RESOURCE` |
| Error inesperado | 500 | `INTERNAL_ERROR` |

Si el repositorio falla durante una carga de mocks, el servicio transforma la falla en `MOCK_SEED_FAILED`, con estado HTTP 500.

Los errores inesperados no exponen contraseñas, cadenas de conexión ni detalles internos en las respuestas HTTP.

### Pruebas automatizadas

Ejecutar:

```bash
npm test
```

Las pruebas incluyen:

- Validación de variables de entorno.
- Protección de constantes.
- Coherencia de relaciones entre mocks.
- Errores personalizados de usuarios y productos.
- Validación de cantidades negativas.
- Formato uniforme del middleware.
- Respuesta segura ante errores inesperados.
- Definición del error de carga de mocks.

La suite actual del proyecto cuenta con 39 pruebas aprobadas y 0 fallidas, incluyendo las pruebas del manejo de errores.

## Repositorio y entrega

El proyecto se entrega mediante el mismo repositorio de GitHub utilizado en los módulos anteriores:

https://github.com/jimewaisberg/ShipNow-Entrega

El archivo `.gitignore` excluye `node_modules`, `.env`, logs y otros archivos que no deben publicarse.

El proyecto es educativo y utiliza una base de datos MongoDB de desarrollo para las pruebas de persistencia.

## Módulo 4 — Logging y monitoreo básico

ShipNow API utiliza Winston para registrar eventos internos del servidor
de manera centralizada, manteniendo la arquitectura por capas.

### Configuración

El logger se encuentra en `src/config/logger.js`.

Se utilizan las siguientes dependencias:

- `winston`: gestión centralizada de logs.
- `winston-daily-rotate-file`: persistencia y rotación automática.

### Niveles de logging

| Nivel | Uso |
|---|---|
| `debug` | Detalles de operaciones durante desarrollo |
| `http` | Eventos relacionados con solicitudes HTTP |
| `info` | Conexiones exitosas y operaciones completadas |
| `warning` | Errores controlados y situaciones anormales |
| `error` | Errores del servidor y fallas de operaciones |
| `fatal` | Fallas críticas, como problemas al iniciar |

### Desarrollo y producción

El comportamiento depende de `NODE_ENV`:

- `development`: registra todos los niveles, incluido `debug`.
- `production`: registra desde `info` hasta `fatal`, evitando logs de depuración.

### Integración con ShipNow

El logger registra eventos importantes:

- Inicio correcto del servidor.
- Conexión exitosa o fallida a MongoDB.
- Errores controlados mediante el middleware global.
- Errores inesperados del servidor.
- Generación de usuarios, pedidos y otros datos ficticios.
- Carga de mocks en MongoDB y fallas durante su inserción.

### Endpoint de prueba

En desarrollo, iniciar el servidor:

```bash
npm run dev
```

Desde otra terminal:

```bash
curl -i "http://localhost:8080/api/logger/test"
```

Este endpoint genera un mensaje de prueba para cada nivel:
`debug`, `http`, `info`, `warning`, `error` y `fatal`.

En producción, el endpoint está bloqueado y responde con un error 404.

### Persistencia de logs

Los errores importantes se guardan en la carpeta `logs/`.

Ejemplo de archivo:

`logs/error-2026-10-28.log`

El archivo registra únicamente los niveles `error` y `fatal`.

Para consultar los logs del día:

```bash
cat logs/error-$(date +%Y-%m-%d).log
```

### Rotación de archivos

Se utiliza `winston-daily-rotate-file`, configurado con:

- Rotación diaria.
- Tamaño máximo de 10 MB por archivo.
- Conservación durante 14 días.

Esto evita que los archivos de logs crezcan indefinidamente.

La carpeta `logs/` está excluida del repositorio mediante `.gitignore`.
También se excluyen `.env` y `node_modules`.

### Pruebas automatizadas

Ejecutar:

```bash
npm test
```

Las pruebas verifican los seis niveles de Winston, la configuración
según el entorno y la existencia de los transportes de consola
y archivos rotativos.

Las pruebas de Winston forman parte de la suite general del proyecto, que actualmente cuenta con 39 pruebas aprobadas y 0 fallidas.

## Módulo 5 — Documentación de API con Swagger

ShipNow API incorpora documentación interactiva mediante
Swagger UI y OpenAPI 3.0.3.

### Herramientas utilizadas

- swagger-ui-express
- swagger-jsdoc

La configuración centralizada se encuentra en
`src/config/swagger.js`.

### Cómo iniciar el proyecto

Instalar las dependencias:

```bash
npm install
```

Configurar las variables de entorno correspondientes,
incluyendo `MONGODB_URI`.

Iniciar el servidor:

```bash
npm run dev
```

### Acceder a Swagger UI

Con el servidor funcionando, abrir:

http://localhost:8080/api/docs

Desde Swagger UI se pueden consultar los endpoints,
sus parámetros, ejemplos de respuestas y errores.

También se pueden realizar peticiones mediante
la opción "Try it out".

### Módulos documentados

- Users: gestión de usuarios.
- Products: gestión de productos y paginación.
- Orders: generación de pedidos ficticios.
- Deliveries: generación de entregas ficticias.
- Mocks: generación y carga controlada de datos de prueba.
- Logger: endpoint interno para validar Winston.

La documentación incluye 25 operaciones HTTP.

### Schemas reutilizables

Se definen schemas para:

- User, CreateUser y UpdateUser.
- Product, CreateProduct y UpdateProduct.
- Order, Delivery y OrderItem.
- ErrorResponse y SuccessResponse.

OrderItem es un schema de referencia.
El modelo actual de pedidos todavía no almacena ítems.

### Consideraciones para las pruebas

Los endpoints GET de mocks generan datos ficticios
sin guardarlos en MongoDB.

La ruta POST /api/mocks/seed inserta documentos reales
y solo funciona fuera de producción cuando
MOCK_SEED_ENABLED=true.

Los endpoints POST, PUT y DELETE de usuarios y
productos modifican la base de datos.

GET /api/logger/test permite validar los niveles
de Winston en desarrollo. En producción devuelve 404.

Los pedidos y entregas se documentan a través de
las rutas existentes de mocks. Actualmente no hay
rutas CRUD independientes para estas entidades.

### Pruebas automatizadas

Ejecutar:

```bash
npm test
```

El proyecto cuenta con 39 pruebas aprobadas,
incluyendo verificaciones de configuración,
tags, operaciones y schemas de Swagger.

Las pruebas automatizadas utilizan `test/setup.js` para configurar las variables `PORT`, `NODE_ENV`, `MONGODB_URI` y `MOCK_SEED_ENABLED` antes de ejecutarse.

Esto permite ejecutar `npm test` sin configurar manualmente las variables de entorno para las pruebas. No es necesario conectarse a MongoDB Atlas para ejecutar la suite actual.

La última ejecución registró **39 pruebas aprobadas y 0 fallidas**.

## Ampliación de entidades — Orders y Deliveries

Se incorporaron endpoints REST para administrar pedidos y entregas, siguiendo la arquitectura por capas utilizada en ShipNow:

Routes → Controllers → Services → Repositories → Models.

### Endpoints de pedidos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/orders` | Obtener todos los pedidos |
| GET | `/api/orders/:id` | Obtener un pedido por ID |
| POST | `/api/orders` | Crear un pedido |
| PUT | `/api/orders/:id` | Actualizar estado o prioridad |

Los pedidos incluyen cliente, total, estado y prioridad.

### Endpoints de entregas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/deliveries` | Obtener todas las entregas |
| GET | `/api/deliveries/:id` | Obtener una entrega por ID |
| POST | `/api/deliveries` | Crear una entrega |
| PUT | `/api/deliveries/:id` | Actualizar una entrega |

Cada entrega se relaciona con un pedido y puede tener un repartidor asignado.

### Mejora del rollback de mocks

Se reorganizó la lógica de compensación del seed para utilizar los identificadores de los documentos generados durante cada ejecución.

La eliminación se realiza en orden: entregas, pedidos y usuarios.

Se incorporaron pruebas automatizadas del orden de limpieza y del manejo de errores. Esta estrategia no reemplaza una transacción de MongoDB.

### Pruebas y documentación

- 39 pruebas automatizadas aprobadas.
- 0 pruebas fallidas.
- 25 operaciones HTTP documentadas con Swagger.
- Pruebas de validación para Orders y Deliveries.
- Prueba HTTP de manejo de errores.
- Pruebas de rollback mediante operaciones simuladas.
