# Rytta · Mesa de campaña en Sites

Esta edición conserva el mapa, submapas, rutas, iniciativa, comerciantes, recursos y mochila de la aplicación local. Añade un portal móvil en `/mesa.html`, acceso nativo con ChatGPT y datos compartidos en D1 y R2 de Sites.

## Primer uso del DM

1. Entra con la misma cuenta de ChatGPT que creó este Site.
2. Importa en el portal un JSON exportado desde tu Rytta actual. Si prefieres comenzar una campaña nueva, abre la app del DM, crea los personajes y usa **Campaña → Mesa online → Compartir campaña local**.
3. Asigna a cada personaje el correo de ChatGPT de su jugador.
4. En **Compartir de Sites**, añade los mismos correos como **lectores**, conservando el acceso privado. Asignar un personaje no envía correos ni modifica por sí solo los permisos de Sites.
5. Facilita a los jugadores la dirección `/mesa.html` de este Site.

Las cuentas de Rytta no tienen contraseñas propias. La autenticación la gestiona ChatGPT. La primera entrada de un jugador vincula su identidad estable de este Site a la invitación por correo; los permisos posteriores se comprueban en el servidor mediante esa identidad.

## Desde el móvil

El jugador puede consultar su bolsa, mochila, equipamiento, raciones y agua; comprar en comerciantes revelados; y usar objetos o recursos propios. Cada compra descuenta el precio real del catálogo y añade el objeto a su mochila de forma atómica. No puede añadir oro, obtener objetos de tiendas ocultas ni modificar otro personaje. Para los precios variables, el DM debe fijar antes un precio de venta.

Los reintentos de una compra conservan su identificador para evitar duplicar cobros. El portal consulta las actualizaciones cada cinco segundos cuando está visible y no se está editando un campo.

## Sincronización de la app del DM

La campaña local de cada navegador sigue guardándose en IndexedDB. La conexión es opcional: usa **Compartir campaña local** o **Abrir campaña compartida**. Al estar conectado, las compras de los jugadores se reflejan en la app y los cambios del DM se comparten.

Si dos dispositivos cambian una misma versión a la vez, se bloquea el guardado de la copia antigua. Se conserva la copia pendiente y se ofrece exportarla antes de abrir la versión compartida; no se sobrescriben silenciosamente las compras. **Desconectar y conservar copia local** incluye las imágenes y mantiene los cambios locales pendientes sin enviarlos al servidor.

La exportación online incluye nuevamente las imágenes en el JSON, conservando el formato importable de Rytta. Las cuentas y los permisos son registros separados: no se incluyen en un archivo de campaña.

## Datos y acceso

- D1: miembros, campaña versionada y registros de operaciones.
- R2: imágenes de mapas y retratos, servidas desde rutas autenticadas.
- El DM ve la campaña completa; el jugador solo recibe sus recursos y los comerciantes visibles.
- El Site se publica inicialmente privado para su propietario. Añade lectores explícitos antes de utilizarlo con los jugadores.
- No se contrata Render ni se añaden servicios externos. Se aplican la disponibilidad y los límites de Sites del plan de ChatGPT.

Se admiten campañas JSON de hasta 40 MB, imágenes de hasta 24 MB y 1,5 MB de datos de texto sin las imágenes. El guardado online separa las imágenes sin modificar la estructura de la campaña exportada.

## Desarrollo

Proyecto Vinext compatible con Sites. `.openai/hosting.json` declara `DB` y `BUCKET`; las migraciones están en `drizzle/`. Publicar mediante las herramientas y el flujo de Sites. No usar credenciales de acceso a las bases de datos en el navegador ni reemplazar las rutas nativas de autenticación de Sites.
