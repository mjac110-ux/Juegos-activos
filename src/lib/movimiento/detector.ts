import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { RUTA_BASE } from "@/lib/ruta";

let pendiente: Promise<PoseLandmarker> | null = null;

/**
 * ¿La "tarjeta gráfica" del navegador es simulada por software? Pasa en equipos
 * sin tarjeta o sin sus drivers (mini PC baratas, Linux sin drivers, máquinas
 * virtuales). Ahí detectar con "GPU" es mucho más lento que con el procesador:
 * en una prueba, 545 ms contra 63 ms por cuadro.
 */
function graficosPorSoftware(): boolean {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return true;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const nombre = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(nombre);
  } catch {
    return true;
  }
}

/**
 * Carga (una sola vez) el detector de cuerpos. Todo corre en el navegador:
 * la imagen de la cámara no sale del equipo.
 */
export function cargarDetector(): Promise<PoseLandmarker> {
  pendiente ??= (async () => {
    const motor = await FilesetResolver.forVisionTasks(`${RUTA_BASE}/mediapipe/wasm`);
    const opciones = (delegate: "GPU" | "CPU") => ({
      baseOptions: { modelAssetPath: `${RUTA_BASE}/modelos/pose_landmarker_lite.task`, delegate },
      runningMode: "VIDEO" as const,
      numPoses: 2, // dos jugadores a la vez
      minPoseDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    if (graficosPorSoftware()) {
      return await PoseLandmarker.createFromOptions(motor, opciones("CPU"));
    }
    try {
      return await PoseLandmarker.createFromOptions(motor, opciones("GPU"));
    } catch {
      return await PoseLandmarker.createFromOptions(motor, opciones("CPU"));
    }
  })();
  pendiente.catch(() => {
    pendiente = null; // permitir reintentar
  });
  return pendiente;
}
