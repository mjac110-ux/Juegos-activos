import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

let pendiente: Promise<PoseLandmarker> | null = null;

/**
 * Carga (una sola vez) el detector de cuerpos. Todo corre en el navegador:
 * la imagen de la cámara no sale del equipo.
 */
export function cargarDetector(): Promise<PoseLandmarker> {
  pendiente ??= (async () => {
    const motor = await FilesetResolver.forVisionTasks("/mediapipe/wasm");
    const opciones = (delegate: "GPU" | "CPU") => ({
      baseOptions: { modelAssetPath: "/modelos/pose_landmarker_lite.task", delegate },
      runningMode: "VIDEO" as const,
      numPoses: 2, // dos jugadores a la vez
      minPoseDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    try {
      return await PoseLandmarker.createFromOptions(motor, opciones("GPU"));
    } catch {
      // Equipos sin aceleración gráfica: más lento, pero funciona.
      return await PoseLandmarker.createFromOptions(motor, opciones("CPU"));
    }
  })();
  pendiente.catch(() => {
    pendiente = null; // permitir reintentar
  });
  return pendiente;
}
