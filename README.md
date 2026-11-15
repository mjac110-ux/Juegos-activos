# Juegos Activos

Juegos para niños y familias que se juegan **moviendo el cuerpo frente a una
cámara**, sin control: la cámara reconoce el cuerpo y las manos explotan
burbujas, esquivan cosas, etc. Hecho para usarse en Venezuela con un equipo
que se consigue allá, sin consola importada ni suscripción.

Juegos disponibles: **Burbujas** (explotar burbujas con las manos, 60 s).
Vienen: Esquiva y Estatuas.

## Lo que hace falta para jugar en la TV

- Una PC, laptop o mini PC con **Chrome o Edge** (Windows o Linux).
- Una **cámara web USB** (720p o 1080p), puesta arriba o abajo de la TV.
- Un cable **HDMI** a la TV y unos 2 metros libres frente a la cámara.

Un equipo sencillo alcanza; antes de comprar varios, conviene probar en uno.

## Cómo correrlo

Hace falta [Node.js](https://nodejs.org) 20 o más nuevo.

```bash
npm install
npm run dev        # para programar: http://localhost:3000
```

Para dejarlo instalado en el equipo de la TV:

```bash
npm run build      # genera la carpeta out/ (el juego completo)
npm run start      # lo sirve en http://localhost:3000
```

Después se abre `http://localhost:3000` en Chrome, se le da permiso a la cámara
y se pone en pantalla completa (F11). La carpeta `out/` también se puede subir
a cualquier hosting con HTTPS (por ejemplo Vercel) para abrirlo desde otro lado.
El navegador sólo deja usar la cámara en `localhost` o en una dirección HTTPS.

Sin cámara se puede jugar con el ratón o tocando la pantalla.

## Privacidad

La imagen de la cámara se procesa **sólo en el equipo**: no se graba, no se
guarda y no se envía a ningún servidor. El reconocimiento del cuerpo corre
dentro del navegador con [MediaPipe](https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker).

## Agregar juegos con la IA

Abre una sesión de Claude Code (o el asistente que uses) en este repo y pídele
el juego en tus palabras, por ejemplo: *"haz un juego donde caen frutas y hay
que atraparlas con las manos"*. Las instrucciones para el asistente están en
`AGENTS.md` y lo que ya se decidió, en `docs/memoria.md`.
