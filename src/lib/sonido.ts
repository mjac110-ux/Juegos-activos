let audio: AudioContext | null = null;

/** Un "pop" corto hecho con el sintetizador del navegador (sin archivos). */
export function pop(agudo = 1) {
  try {
    audio ??= new AudioContext();
    if (audio.state === "suspended") void audio.resume();
    const t = audio.currentTime;
    const osc = audio.createOscillator();
    const vol = audio.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(500 * agudo, t);
    osc.frequency.exponentialRampToValueAtTime(1100 * agudo, t + 0.08);
    vol.gain.setValueAtTime(0.25, t);
    vol.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(vol).connect(audio.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  } catch {
    // Sin sonido no pasa nada.
  }
}
