# AGENTS.md

Instrucciones para cualquier asistente de código (Codex, Cursor, Copilot,
Gemini, Claude…).

## Idioma: siempre en español

**Las sesiones se manejan únicamente en español.** Todo lo que le escribes a la
persona va en español, tuteando: las respuestas, los avisos cortos entre un paso
y otro, las preguntas con opciones, los planes, los resúmenes y la descripción
de cada comando. Desde el primer mensaje y también después de un resumen de
contexto, aunque el mensaje, el código, un error o un documento estén en
inglés. El código (nombres de variables, comentarios, textos de pantalla)
también va en español.

> **Este repo es PÚBLICO**: lo que se anote acá lo puede leer cualquiera en
> internet. Nada interno que no se pueda mostrar.

1. **Lo primero: leer `README.md`** (qué es el proyecto y cómo se corre) y
   **`docs/memoria.md`** (lo que ya se decidió en una conversación). Lo que
   está escrito ahí no se vuelve a preguntar.
2. **Al trabajar, anotar.** Si en la conversación se explica algo que no está
   escrito (una decisión, una corrección, una preferencia), se anota en el
   mismo commit del trabajo: en el documento de su tema si lo tiene y, si no,
   en `docs/memoria.md`. Nada secreto: ni claves, ni contraseñas, ni datos de
   clientes.

## El proyecto

Juegos para niños y familias que se juegan **moviendo el cuerpo frente a una
cámara**, sin control. Es una página web (Next.js exportado como sitio
estático) que detecta el cuerpo con MediaPipe **dentro del navegador**.

- `src/components/Escenario.tsx`: el motor. Pantalla completa con la cámara
  en espejo, detecta hasta dos cuerpos y, en cada cuadro, le pasa al juego las
  manos (`manos`) y los cuerpos completos (`cuerpos`, 33 puntos cada uno).
  Sin cámara, el ratón o el dedo cuentan como una mano.
- `src/lib/movimiento/`: carga del detector y nombres de las partes del
  cuerpo (`PARTE.munecaIzq`, `PARTE.pieDer`, …).
- `src/juegos/<nombre>/`: cada juego. `burbujas` es el ejemplo a copiar.
- `src/app/`: el menú (`page.tsx`, con la lista `JUEGOS`) y una página por
  juego en `src/app/juegos/<nombre>/page.tsx`.
- `scripts/preparar.mjs`: copia el motor de MediaPipe y baja el modelo de
  pose a `public/` (corre solo antes de `dev` y `build`; no se sube a git).

### Para agregar un juego

1. Crear `src/juegos/<nombre>/<Nombre>.tsx`: un componente `"use client"`
   que devuelve `<Escenario alCuadro={...}>` y dibuja en `ctx` con lo que
   recibe (`ancho`, `alto`, `dt`, `dtReal`, `manos`, `cuerpos`). Medidas
   siempre relativas a `alto`, para que se vea igual en cualquier pantalla.
   Para mover cosas se usa `dt`; para relojes, `dtReal`, así una ronda de
   60 s dura 60 s aunque el equipo vaya lento.
2. Crear `src/app/juegos/<nombre>/page.tsx` y agregarlo a `JUEGOS` en
   `src/app/page.tsx`.
3. Verificar: `npm run build` y `npm run lint` sin errores, y jugarlo sin
   cámara con el ratón (`npm run dev`).

### Reglas de los juegos

- **La cámara no sale del equipo.** Nada de grabar, subir ni mandar imágenes o
  puntos del cuerpo a un servidor. Ningún juego necesita internet para jugarse.
- **Juegos originales.** Se pueden usar mecánicas conocidas (tocar, esquivar,
  saltar, imitar), pero no nombres, personajes, arte, música ni juegos de otras
  marcas (tampoco de Nex Playground, que fue la inspiración).
- **Para niños.** Textos grandes y en español, se empieza tocando algo en
  pantalla (no con teclado), rondas cortas y nada de castigos feos al perder.
- **Sin dinero real ni apuestas.**

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
