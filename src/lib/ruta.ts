/**
 * Ruta donde vive el sitio: "" en local, "/Juegos-activos" en GitHub Pages.
 * Los enlaces de next/link ya la agregan solos; esto es para los archivos que
 * se cargan a mano (el motor y el modelo de MediaPipe).
 */
export const RUTA_BASE = process.env.NEXT_PUBLIC_RUTA_BASE ?? "";
