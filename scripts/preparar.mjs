// Deja en public/ lo que el navegador necesita para reconocer el cuerpo sin
// depender de internet mientras se juega:
//   - public/mediapipe/wasm: el motor de MediaPipe (viene en node_modules)
//   - public/modelos/pose_landmarker_lite.task: el modelo de pose (se baja una vez)
// Corre solo antes de `npm run dev` y `npm run build`.
import { cp, mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const MODELO_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
const modelo = join(raiz, "public/modelos/pose_landmarker_lite.task");

await cp(
  join(raiz, "node_modules/@mediapipe/tasks-vision/wasm"),
  join(raiz, "public/mediapipe/wasm"),
  { recursive: true },
);

const yaEsta = await stat(modelo).then((s) => s.size > 1_000_000).catch(() => false);
if (!yaEsta) {
  console.log("Bajando el modelo de pose (unos 5 MB, sólo la primera vez)…");
  const res = await fetch(MODELO_URL);
  if (!res.ok) throw new Error(`No se pudo bajar el modelo: HTTP ${res.status}`);
  await mkdir(dirname(modelo), { recursive: true });
  await writeFile(modelo, Buffer.from(await res.arrayBuffer()));
}
console.log("Listo: motor y modelo de movimiento en public/.");
