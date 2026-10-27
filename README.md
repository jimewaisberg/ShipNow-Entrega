# ShipNow — Pre-entrega Módulo 2: Mocking y carga de datos

Extensión de la API del Módulo 1. Arquitectura **Routes → Controllers → Services → Repositories → Models**, con generación de Usuarios, Repartidores (usuarios con rol `driver`), Pedidos y Entregas. Conserva todos los endpoints del módulo anterior.

## Instalación

1. `npm install`
2. Copiar `.env.example` a `.env`. Configurar `PORT`, `NODE_ENV` y `MONGODB_URI` (MongoDB Atlas o local). **No publicar `.env`.**
3. `npm run dev`
4. `npm test` (prueba el módulo anterior y la coherencia de los mocks sin una DB real).

Para habilitar la inserción de datos de prueba **solo en desarrollo**, configurar `MOCK_SEED_ENABLED=true` en el `.env` local y reiniciar la aplicación. En producción los mocks y la carga están deshabilitados.

## API de mocking

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/mocks/users?qty=2` | Usuarios ficticios con rol `user`; no persiste |
| GET | `/api/mocks/drivers?qty=2` | Repartidores ficticios con rol `driver`; no persiste |
| GET | `/api/mocks/orders?qty=2` | Pedidos con prioridad y estado válidos; no persiste |
| GET | `/api/mocks/deliveries?qty=2` | Entregas vinculadas a pedidos simulados; no persiste |
| GET | `/api/mocks/bundle?qty=2` | Grafo completo: `users`, `drivers`, `orders`, `deliveries`; no persiste |
| POST | `/api/mocks/seed` | Inserta lote coherente en MongoDB, si está habilitado |

`qty` es opcional (por defecto 5) y admite enteros entre 1 y 50. En `bundle`, genera `qty` clientes, `ceil(qty/3)` repartidores (mínimo uno), `qty` pedidos y `qty` entregas. `seed` usa idéntica convención. Los identificadores `mockId` de GET son **temporales** y sirven para representar vínculos: la carga POST los sustituye por referencias `ObjectId` reales. GET no guarda ningún documento.

### Ejemplos de prueba

```bash
curl 'http://localhost:8080/api/mocks/users?qty=2'
curl 'http://localhost:8080/api/mocks/bundle?qty=2'
curl -i -X POST 'http://localhost:8080/api/mocks/seed' -H 'Content-Type: application/json' -d '{"qty":10}'
```

Respuesta de `POST /api/mocks/seed` (cantidades para `qty=10`; los IDs cambian):

```json
{
  "inserted": { "users": 10, "drivers": 4, "orders": 10, "deliveries": 10 },
  "total": 34,
  "ids": { "users": ["..."], "orders": ["..."], "deliveries": ["..."] }
}
```

La carga utiliza `insertMany` a través del Repository y, en caso de fallo, intenta eliminar los documentos de ese lote. **No es una transacción MongoDB**, así que no ofrece atomicidad completa. Cada ejecución genera emails únicos de ejemplo (`example.test`), crea contraseñas aleatorias hasheadas y no envía emails reales.

## Relaciones y reglas

- `User` usa roles congelados (`USER`, `DRIVER`, `ADMIN`); los repartidores son usuarios con rol `DRIVER`.
- `Order.customer` referencia al cliente y sus campos `status` y `priority` usan constantes compartidas.
- `Delivery.order` referencia un pedido existente. `Delivery.driver` apunta a un usuario `DRIVER` o es `null` para entregas sin asignar.
- `Repository` es el único acceso a Mongoose. `Service` genera y valida datos; `Controller` gestiona HTTP; `Routes` solo conecta paths con controladores.
- Se mantiene la validación de entorno del Módulo 1. No hay llamadas `process.env` fuera de `src/config/env.config.js`.

## Seguridad / alcance

Se trata de un ejercicio educativo. El endpoint seed está bloqueado por defecto y en producción, pero **no incluye autenticación**. No publicar la API con `MOCK_SEED_ENABLED=true` en un servidor accesible a terceros. Usar una base MongoDB de pruebas separada, nunca la de producción. Antes de cargar, asegurarse de apuntar a la base de desarrollo correcta.

Se excluyen de Git `.env`, `node_modules`, archivos de log y coberturas mediante `.gitignore`.
