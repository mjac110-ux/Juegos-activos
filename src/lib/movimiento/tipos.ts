/** Un punto en la pantalla del juego, en píxeles CSS. */
export type Punto = { x: number; y: number };

/** Lo que recibe un juego en cada cuadro (unas 60 veces por segundo). */
export type Cuadro = {
  ctx: CanvasRenderingContext2D;
  ancho: number;
  alto: number;
  /** Segundos desde el cuadro anterior. */
  dt: number;
  /** Manos de todos los jugadores (y el ratón o el dedo, si se usan). */
  manos: Punto[];
  /** Cuerpos completos, por si un juego necesita pies, cabeza, etc. */
  cuerpos: Punto[][];
};

/**
 * Índices de los puntos del cuerpo que entrega MediaPipe (33 en total).
 * https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker
 */
export const PARTE = {
  nariz: 0,
  hombroIzq: 11,
  hombroDer: 12,
  munecaIzq: 15,
  munecaDer: 16,
  indiceIzq: 19,
  indiceDer: 20,
  caderaIzq: 23,
  caderaDer: 24,
  tobilloIzq: 27,
  tobilloDer: 28,
  pieIzq: 31,
  pieDer: 32,
} as const;
