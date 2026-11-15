# Memoria del proyecto

Lo que alguien ya explicó en una conversación con un asistente y no está en
otro documento del repo. Lo lee cualquier asistente al empezar (Claude lo carga
solo desde `CLAUDE.md`; Codex, Cursor y Copilot llegan por `AGENTS.md`) y
cualquier persona del equipo.

## Cómo se escribe

- Una anotación por cosa, con su fecha (día de Venezuela), en una o dos líneas:
  qué es y por qué.
- Si ya hay una que dice otra cosa, se corrige esa (la historia queda en git);
  no se agrega otra que la contradiga.
- Si es de un tema con documento propio, va en ese documento, no acá.
- Nada secreto: ni claves, ni contraseñas, ni datos de clientes.

## Anotaciones

### De dónde salió

- **2026-11-15**: la idea vino de Nex Playground, una consola con cámara de
  EE. UU. (US$299 en Amazon) donde los niños juegan moviéndose. Se buscó algo
  así para Venezuela: Nex sólo se vende oficialmente en EE. UU., Reino Unido e
  Irlanda y el catálogo de juegos se paga aparte con una suscripción (Play
  Pass), así que se decidió hacer uno propio con ayuda de la IA.

### Decisiones

- **2026-11-15**: es una página web (Next.js exportado estático) que detecta el
  cuerpo con MediaPipe en el navegador. Corre en una PC o mini PC con cámara web
  conectada a la TV, sin consola importada, sin suscripción y sin internet una
  vez instalado.
- **2026-11-15**: la imagen de la cámara se procesa sólo en el equipo; no se
  graba ni se envía. Es regla para todos los juegos.
- **2026-11-15**: juegos originales (mecánicas parecidas sí; nombres, arte y
  juegos de Nex u otras marcas no) y sin dinero real.
- **2026-11-15**: el repo es privado, en la organización de la empresa.
- **2026-11-15**: siempre se puede jugar sin cámara, con el ratón o el dedo:
  sirve para probar los juegos y para tablets.
