let familia = "";

/**
 * La letra del juego para escribir en el lienzo (canvas). El lienzo no entiende
 * variables CSS como `var(--font-juego)`, así que se lee el nombre real una vez.
 */
export function letraJuego(): string {
  familia ||=
    getComputedStyle(document.documentElement).getPropertyValue("--font-juego").trim() ||
    "system-ui, sans-serif";
  return familia;
}
