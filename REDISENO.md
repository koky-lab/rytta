# Rytta · Rediseño de la mesa de campaña

Este documento describe la primera fase. Las mejoras posteriores de legibilidad y usabilidad, y sus comprobaciones, se describen en [FASE2.md](FASE2.md).

Se ha actualizado la versión del proyecto que incluye comerciantes, compras con descuento de oro y mochila editable.

## Qué cambia

- Cabecera global con navegación por módulos y cambio de rol siempre accesibles.
- Atlas lateral dedicado a mapa, puntos, rutas y campaña.
- Mapa con herramientas agrupadas, cabecera de contexto y panel de detalles.
- Módulos de iniciativa, personajes y comerciantes que aprovechan todo el ancho disponible.
- Iniciativa con turno activo destacado, estadísticas legibles y formulario de participantes plegable.
- Fichas de personaje con bolsa, agua, recursos, mochila y equipo visualmente diferenciados.
- Comerciantes con navegación de tiendas, precios destacados, búsqueda y compra por personaje.
- Sistema visual común en `theme.css`: carbón, bronce, oro envejecido, pergamino en equipamiento y tipografía local.
- Iconos SVG integrados en CSS, estados de foco, movimiento reducido y adaptación a móvil, tableta y escritorio.

## Qué se conserva

Los archivos `app.js`, `merchants.js`, `merchants-data.js` y `backpack.js` son idénticos a los anteriores al rediseño, verificado mediante SHA-256. No se cambia el esquema de datos, las claves de IndexedDB, los cálculos, los identificadores ni los atributos que enlazan los eventos. No se añaden librerías ni fuentes remotas.

## Uso

Abre la aplicación en su ubicación habitual y recarga la página. La hoja de estilos nueva se carga desde `theme.css`, junto a `styles.css`; ambos archivos deben permanecer junto a `index.html`. También funciona como sitio estático en GitHub Pages.

En pantallas pequeñas, el atlas se presenta sobre el mapa y se puede cerrar con «Ocultar panel». Los módulos restantes utilizan el espacio completo. Las tablas de tiendas permiten desplazamiento horizontal cuando no cabe todo el contenido.

## Comprobaciones

- HTML y jerarquía de los módulos; 93 identificadores y todos los atributos de eventos conservados.
- Integridad de los cuatro archivos de lógica y presencia de todos los recursos locales.
- Pruebas automatizadas de los eventos de navegación, rol, panel lateral, turnos e iniciativa.
- Pruebas de personajes, equipo, compras, saldo de oro, mochila y edición de objetos.
- Pruebas de puntos visibles/ocultos, rutas, zoom, entrada y salida de submapas.
- Guardado y recuperación con una simulación de IndexedDB; importación y exportación de campañas.
- Reglas de adaptación a distintas anchuras, iconos locales y opción de reducir animaciones.

Estas pruebas usan un DOM y una base de datos simulados. La revisión visual y de gestos reales en navegador queda pendiente: el navegador de esta sesión no puede acceder al servidor local y no permite abrir archivos `file://`.

## Copia de seguridad

Se creó un ZIP de los archivos actuales antes de modificar el proyecto. Para restaurarlo, extrae esa copia sobre la carpeta de la aplicación. No es necesario modificar ni convertir las campañas exportadas.
