"use client";

import type { NormalizedLandmark, PoseLandmarker } from "@mediapipe/tasks-vision";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cargarDetector } from "@/lib/movimiento/detector";
import { PARTE, type Cuadro, type Punto } from "@/lib/movimiento/tipos";

type Estado = "iniciando" | "camara" | "sin-camara";

/** Líneas del esqueleto que se dibujan suave para que el niño vea que lo sigue. */
const HUESOS: [number, number][] = [
  [PARTE.hombroIzq, PARTE.hombroDer],
  [PARTE.hombroIzq, 13], [13, PARTE.munecaIzq],
  [PARTE.hombroDer, 14], [14, PARTE.munecaDer],
  [PARTE.hombroIzq, PARTE.caderaIzq], [PARTE.hombroDer, PARTE.caderaDer],
  [PARTE.caderaIzq, PARTE.caderaDer],
  [PARTE.caderaIzq, 25], [25, PARTE.tobilloIzq],
  [PARTE.caderaDer, 26], [26, PARTE.tobilloDer],
];

/**
 * Pantalla completa con la cámara como espejo. Detecta los cuerpos, le pasa
 * las manos al juego en cada cuadro y dibuja dónde están.
 * Si no hay cámara, se juega con el ratón o con el dedo.
 */
export default function Escenario({
  alCuadro,
  children,
}: {
  alCuadro: (c: Cuadro) => void;
  children?: ReactNode;
}) {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const alCuadroRef = useRef(alCuadro);
  const [estado, setEstado] = useState<Estado>("iniciando");
  const [jugadores, setJugadores] = useState(0);

  useEffect(() => {
    alCuadroRef.current = alCuadro;
  }, [alCuadro]);

  useEffect(() => {
    const canvas = lienzo.current!;
    const ctx = canvas.getContext("2d")!;
    const vid = video.current!;
    let vivo = true;
    let detector: PoseLandmarker | null = null;
    let flujo: MediaStream | null = null;
    let raf = 0;
    let anterior = performance.now();
    let tiempoVideo = -1;
    let ultimaDeteccion = 0;
    let duracionDeteccion = 0;
    let landmarks: NormalizedLandmark[][] = [];
    let jugadoresAntes = 0;
    const punteros = new Map<number, Punto>();

    const mover = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      punteros.set(e.pointerId, { x: e.clientX - r.left, y: e.clientY - r.top });
    };
    const soltar = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.type === "pointerleave") punteros.delete(e.pointerId);
    };
    canvas.addEventListener("pointermove", mover);
    canvas.addEventListener("pointerdown", mover);
    canvas.addEventListener("pointerup", soltar);
    canvas.addEventListener("pointercancel", soltar);
    canvas.addEventListener("pointerleave", soltar);

    (async () => {
      try {
        flujo = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: false,
        });
        if (!vivo) return flujo.getTracks().forEach((t) => t.stop());
        vid.srcObject = flujo;
        await vid.play();
        detector = await cargarDetector();
        if (vivo) setEstado("camara");
      } catch (error) {
        console.warn("Se juega sin cámara:", error);
        if (vivo) setEstado("sin-camara");
      }
    })();

    const cuadro = (ahora: number) => {
      raf = requestAnimationFrame(cuadro);
      const dtReal = Math.min(1, (ahora - anterior) / 1000);
      const dt = Math.min(0.1, dtReal);
      anterior = ahora;

      const dpr = window.devicePixelRatio || 1;
      const ancho = canvas.clientWidth;
      const alto = canvas.clientHeight;
      if (canvas.width !== Math.round(ancho * dpr) || canvas.height !== Math.round(alto * dpr)) {
        canvas.width = Math.round(ancho * dpr);
        canvas.height = Math.round(alto * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fondo: la cámara en espejo, recortada para llenar la pantalla.
      const hayVideo = vid.readyState >= 2 && vid.videoWidth > 0;
      const escala = hayVideo ? Math.max(ancho / vid.videoWidth, alto / vid.videoHeight) : 1;
      const dw = vid.videoWidth * escala;
      const dh = vid.videoHeight * escala;
      const ox = (ancho - dw) / 2;
      const oy = (alto - dh) / 2;
      if (hayVideo) {
        ctx.save();
        ctx.translate(ancho, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(vid, ox, oy, dw, dh);
        ctx.restore();
        ctx.fillStyle = "rgba(15, 12, 45, 0.45)";
        ctx.fillRect(0, 0, ancho, alto);
      } else {
        const fondo = ctx.createLinearGradient(0, 0, 0, alto);
        fondo.addColorStop(0, "#1e1b4b");
        fondo.addColorStop(1, "#0f766e");
        ctx.fillStyle = fondo;
        ctx.fillRect(0, 0, ancho, alto);
      }

      // Detectar sólo si hay un cuadro nuevo de la cámara y, en equipos lentos,
      // dejando al menos tanto tiempo como tarda la detección: así el juego se
      // sigue dibujando fluido entre una detección y otra.
      if (
        detector &&
        hayVideo &&
        vid.currentTime !== tiempoVideo &&
        ahora - ultimaDeteccion >= duracionDeteccion
      ) {
        tiempoVideo = vid.currentTime;
        ultimaDeteccion = ahora;
        landmarks = detector.detectForVideo(vid, ahora).landmarks;
        duracionDeteccion = performance.now() - ahora;
      }
      const aPantalla = (p: NormalizedLandmark): Punto => ({
        x: ancho - (ox + p.x * dw), // espejo
        y: oy + p.y * dh,
      });
      const cuerpos = landmarks.map((cuerpo) => cuerpo.map(aPantalla));
      const manos: Punto[] = [];
      landmarks.forEach((cuerpo, i) => {
        for (const parte of [PARTE.indiceIzq, PARTE.indiceDer]) {
          if ((cuerpo[parte]?.visibility ?? 1) > 0.3) manos.push(cuerpos[i][parte]);
        }
      });
      manos.push(...punteros.values());

      if (cuerpos.length !== jugadoresAntes) {
        jugadoresAntes = cuerpos.length;
        setJugadores(cuerpos.length);
      }

      ctx.lineCap = "round";
      ctx.lineWidth = Math.max(4, alto * 0.008);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      for (const cuerpo of cuerpos) {
        ctx.beginPath();
        for (const [a, b] of HUESOS) {
          ctx.moveTo(cuerpo[a].x, cuerpo[a].y);
          ctx.lineTo(cuerpo[b].x, cuerpo[b].y);
        }
        ctx.stroke();
      }

      alCuadroRef.current({ ctx, ancho, alto, dt, dtReal, manos, cuerpos });

      const radio = alto * 0.035;
      for (const m of manos) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, radio, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(253, 224, 71, 0.85)";
        ctx.shadowColor = "#fde047";
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };
    raf = requestAnimationFrame(cuadro);

    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      flujo?.getTracks().forEach((t) => t.stop());
      canvas.removeEventListener("pointermove", mover);
      canvas.removeEventListener("pointerdown", mover);
      canvas.removeEventListener("pointerup", soltar);
      canvas.removeEventListener("pointercancel", soltar);
      canvas.removeEventListener("pointerleave", soltar);
    };
  }, []);

  const aviso =
    estado === "iniciando"
      ? "Preparando la cámara…"
      : estado === "sin-camara"
        ? "Sin cámara: juega con el ratón o con el dedo"
        : jugadores === 0
          ? "Ponte frente a la cámara, a unos 2 metros"
          : jugadores === 1
            ? "1 jugador en pantalla"
            : `${jugadores} jugadores en pantalla`;

  return (
    <div className="fixed inset-0 select-none overflow-hidden bg-indigo-950 text-white">
      <video
        ref={video}
        className="pointer-events-none absolute h-px w-px opacity-0"
        playsInline
        muted
      />
      <canvas ref={lienzo} className="absolute inset-0 h-full w-full touch-none" />
      <div className="pointer-events-none absolute inset-0">{children}</div>
      <div className="absolute left-4 top-4 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-white/15 px-5 py-2 text-lg font-bold backdrop-blur hover:bg-white/25"
        >
          ← Menú
        </Link>
        <span
          data-estado={estado}
          className="rounded-full bg-black/30 px-4 py-2 text-base backdrop-blur"
        >
          {aviso}
        </span>
      </div>
    </div>
  );
}
