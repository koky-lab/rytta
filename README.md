# Rytta

App web local para dirigir una campana de D&D con mapas grandes, secretos, rutas e iniciativa.

## Funciones principales

- Mapa principal con imagen propia.
- Submapas para ciudades, zonas o ampliaciones.
- Modo DM y modo jugadores.
- Puntos con titulo, descripcion, icono, color, capa y visibilidad para jugadores.
- Rutas guardadas con distancia, terreno, velocidad y tiempo estimado.
- Terrenos con dificultad: camino, llanura, bosque, montana, pantano y mar.
- Modulo de iniciativa con ronda, turno, PG, CA, motes para enemigos y formulas de vida.
- Personajes jugadores guardados para reutilizarlos en combates futuros.
- Modulo de recursos con tarjetas por PJ, monedas, recursos y movimientos.
- Guardado automatico en IndexedDB del navegador.
- Exportacion e importacion de campana en JSON.

## Como usarla

Abre `index.html` directamente en el navegador.

Tambien puedes abrir la carpeta en Visual Studio Code y usar la extension `Live Server`:

1. Abre Visual Studio Code.
2. Ve a `File > Open Folder`.
3. Selecciona esta carpeta.
4. Abre `index.html`.
5. Clic derecho y `Open with Live Server`.

## Controles utiles

- `Shift + clic`: crear localizacion nueva en modo DM.
- `Ctrl + Z`: deshacer el ultimo cambio.
- Rueda del raton: zoom.
- Rueda pulsada o `Espacio` pulsado: mover el mapa.
- Doble clic en una marca con ampliacion: entrar en su submapa.
- En modo ruta, clic en mapa o marcador: anadir tramos sin abrir descripciones.

## Guardado

La app guarda la campana automaticamente en IndexedDB, una base de datos local del navegador. Para copias de seguridad o cambios de ordenador, usa `Exportar campana`.

## Publicar en GitHub Pages

Este proyecto es una web estatica. Si lo subes a GitHub, puedes publicarlo con GitHub Pages usando:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

La app se servira desde `index.html`.

## Subir a GitHub

El repositorio local ya esta preparado en Git. Para crear el repositorio remoto y subirlo:

```powershell
.\publish-to-github.ps1
```

El script usa GitHub CLI. Si no has iniciado sesion, abrira el login de GitHub en el navegador. Por defecto crea un repositorio publico llamado `rytta`.

Para cambiar el nombre:

```powershell
.\publish-to-github.ps1 -RepoName "mi-atlas-dnd"
```

Para crearlo privado:

```powershell
.\publish-to-github.ps1 -Private
```
