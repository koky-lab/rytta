# Rytta · Fase 2 de usabilidad

Mejoras aplicadas a la última versión local, conservando su estética medieval oscura.

## Lectura y controles

Los textos de la interfaz que tenían entre 7 y 11 px pasan a un mínimo de 12 px, con tamaños de 13–14 px para formularios, ayudas, listas y controles frecuentes. Se mejora el espaciado y el contraste. Los textos secundarios representativos se comprueban con una relación de contraste mínima de 4,5:1; esto no constituye una auditoría completa de accesibilidad.

## Atlas adaptable

- Escritorio: mantiene el panel lateral y su control habitual.
- Tableta (hasta 900 px): se abre bajo demanda como panel lateral de 320 px.
- Teléfono (hasta 650 px): aparece como una bandeja inferior de hasta el 42 % de la altura visible, permitiendo seguir viendo e interactuando con el mapa.
- Botones «Abrir atlas» / «Cerrar atlas», cierre mediante Escape, devolución del foco y exclusión del teclado cuando el panel está cerrado.
- Cambiar de módulo cierra el atlas móvil. Cambiar la anchura de pantalla también restablece su presentación.

## Iniciativa

El primer avance con «Siguiente turno» pliega el formulario cuando hay combatientes. «Añadir combatiente» permite abrirlo de nuevo y desplaza la vista hasta el formulario. La barra de combate permanece accesible al desplazarse por la lista. El turno activo y las estadísticas tienen etiquetas más legibles.

## Comerciantes

Se mantiene una sola tabla y los mismos botones y eventos. Por debajo de 800 px, cada fila se presenta como tarjeta con etiquetas explícitas. A 768 px hay dos tarjetas por fila; en teléfono, una. El escritorio conserva la gestión compacta en tabla. Las compras y los descuentos de oro funcionan igual.

## Modo sesión

«Modo sesión» oculta controles secundarios de creación y gestión. Se conservan la navegación, el cambio de rol, los turnos, el acceso al atlas, las compras y la consulta de las pertenencias. «Volver a edición» restaura los controles. Pulsar «Añadir combatiente» durante una sesión vuelve a edición y abre el formulario.

Este modo y el estado del atlas móvil son temporales: no añaden campos de campaña ni escriben preferencias en IndexedDB o localStorage. Se restablecen al recargar. Las transiciones respetan la preferencia del sistema para reducir el movimiento.

## Compatibilidad

No se han modificado `app.js`, `merchants-data.js` ni `backpack.js`, verificado mediante SHA-256. En `merchants.js` solo se han añadido etiquetas y una clase de presentación al catálogo. La lógica de compra, los pagos, el guardado, la importación, la exportación y los esquemas de datos se conservan.

La presentación nueva se carga desde `polish.css` y `usability.js`, sin librerías, fuentes ni servicios externos. Mantén esos archivos junto a `index.html` al usar la app localmente o al publicar en GitHub Pages.

## Validación y alcance

Pruebas automatizadas con datos de ejemplo en un DOM simulado y perfiles de 390, 768, 1440 y 1920 px:

- Atlas, foco, Escape y cambio entre presentación móvil y escritorio.
- Modo sesión reversible sin modificar los datos de campaña.
- Plegado y reapertura del formulario de iniciativa, participantes, orden y turnos.
- Etiquetas de las tarjetas de catálogo, compras, saldo, mochila y equipamiento.
- Navegación, modos DM/jugadores, puntos ocultos, rutas, zoom y submapas.
- Guardado mediante IndexedDB simulado, importación y exportación.
- Integridad de los identificadores y atributos de eventos existentes.
- Estilos, tamaño mínimo de los textos del tema, contraste de muestras y movimiento reducido.

La revisión visual en un navegador real sigue pendiente. El navegador disponible en esta sesión no puede acceder al servidor local y bloquea `file://`. Los perfiles anteriores no equivalen a capturas ni a una comprobación real del diseño renderizado o de los gestos táctiles.

La copia `Rytta-copia-antes-fase2.zip` permite restaurar la versión anterior a estas mejoras.
