"use client";

import { useCallback, useRef, useState } from "react";
import Escenario from "@/components/Escenario";
import type { Cuadro, Punto } from "@/lib/movimiento/tipos";
import { letraJuego } from "@/lib/letra";
import { pop } from "@/lib/sonido";

/**
 * Burbujas: suben burbujas desde abajo y hay que explotarlas con las manos.
 * Una ronda dura 60 segundos. Las doradas valen 3. No se pierde nada si una
 * se escapa: es para que se muevan, no para frustrarse.
 */

const DURACION = 60;
const COLORES = ["#f472b6", "#60a5fa", "#34d399", "#a78bfa", "#fb923c", "#22d3ee"];

type Fase = "esperando" | "jugando" | "fin";
type Burbuja = { x: number; y: number; r: number; vy: number; t: number; color: string; dorada: boolean };
type Chispa = { x: number; y: number; vx: number; vy: number; vida: number; color: string };

const azar = (min: number, max: number) => min + Math.random() * (max - min);
const toca = (manos: Punto[], x: number, y: number, r: number) =>
  manos.some((m) => Math.hypot(m.x - x, m.y - y) < r);

function dibujarBurbuja(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
  g.addColorStop(0, "rgba(255,255,255,0.95)");
  g.addColorStop(0.25, color);
  g.addColorStop(1, color + "55");
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = Math.max(2, r * 0.06);
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.stroke();
}

export default function Burbujas() {
  const [hud, setHud] = useState({ fase: "esperando" as Fase, puntos: 0, tiempo: DURACION, record: 0 });
  const juego = useRef({
    fase: "esperando" as Fase,
    puntos: 0,
    tiempo: DURACION,
    record: 0,
    espera: 0, // pausa antes de poder volver a empezar
    proxima: 0,
    burbujas: [] as Burbuja[],
    chispas: [] as Chispa[],
    reloj: 0,
  });

  const explotar = (x: number, y: number, color: string, cuantas: number, alto: number) => {
    for (let i = 0; i < cuantas; i++) {
      const ang = azar(0, Math.PI * 2);
      const vel = azar(0.2, 0.6) * alto;
      juego.current.chispas.push({ x, y, vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel, vida: 1, color });
    }
  };

  const alCuadro = useCallback(({ ctx, ancho, alto, dt, dtReal, manos }: Cuadro) => {
    const g = juego.current;
    const radioMano = alto * 0.035;
    g.reloj += dt;

    if (g.fase === "jugando") {
      g.tiempo = Math.max(0, g.tiempo - dtReal); // 60 segundos de verdad
      g.proxima -= dt;
      if (g.proxima <= 0) {
        // Van saliendo un poco más seguido a medida que pasa la ronda.
        const avance = 1 - g.tiempo / DURACION;
        g.proxima = azar(0.5, 0.85) - avance * 0.25;
        const dorada = Math.random() < 0.08;
        const r = alto * (dorada ? azar(0.045, 0.06) : azar(0.06, 0.095));
        g.burbujas.push({
          x: azar(r, ancho - r),
          y: alto + r,
          r,
          vy: alto * (dorada ? azar(0.28, 0.36) : azar(0.13, 0.24)),
          t: azar(0, 10),
          color: dorada ? "#facc15" : COLORES[Math.floor(Math.random() * COLORES.length)],
          dorada,
        });
      }
      g.burbujas = g.burbujas.filter((b) => {
        b.y -= b.vy * dt;
        b.t += dt;
        const x = b.x + Math.sin(b.t * 2.2) * b.r * 0.35;
        if (toca(manos, x, b.y, b.r + radioMano)) {
          g.puntos += b.dorada ? 3 : 1;
          explotar(x, b.y, b.color, b.dorada ? 22 : 12, alto);
          pop(b.dorada ? 1.6 : azar(0.9, 1.2));
          return false;
        }
        return b.y > -b.r;
      });
      if (g.tiempo === 0) {
        g.fase = "fin";
        g.record = Math.max(g.record, g.puntos);
        g.espera = 1.5;
        for (const b of g.burbujas) explotar(b.x, b.y, b.color, 6, alto);
        g.burbujas = [];
      }
    } else {
      // Burbuja grande para empezar: se toca con la mano, sin control ni teclado.
      g.espera = Math.max(0, g.espera - dt);
      if (g.espera === 0) {
        const x = ancho / 2;
        const y = alto * 0.5;
        const r = alto * (0.13 + Math.sin(g.reloj * 3) * 0.008);
        dibujarBurbuja(ctx, x, y, r, "#38bdf8");
        ctx.fillStyle = "white";
        ctx.font = `800 ${Math.round(r * 0.36)}px ${letraJuego()}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("¡Tócala!", x, y);
        if (toca(manos, x, y, r + radioMano)) {
          Object.assign(g, { fase: "jugando", puntos: 0, tiempo: DURACION, proxima: 0.3, burbujas: [] });
          explotar(x, y, "#38bdf8", 30, alto);
          pop(0.8);
        }
      }
    }

    for (const b of g.burbujas) dibujarBurbuja(ctx, b.x + Math.sin(b.t * 2.2) * b.r * 0.35, b.y, b.r, b.color);

    g.chispas = g.chispas.filter((c) => {
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy += alto * 0.8 * dt;
      c.vida -= dt * 1.6;
      ctx.globalAlpha = Math.max(0, c.vida);
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.arc(c.x, c.y, alto * 0.008, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      return c.vida > 0;
    });

    const tiempo = Math.ceil(g.tiempo);
    setHud((h) =>
      h.fase === g.fase && h.puntos === g.puntos && h.tiempo === tiempo && h.record === g.record
        ? h
        : { fase: g.fase, puntos: g.puntos, tiempo, record: g.record },
    );
  }, []);

  return (
    <Escenario alCuadro={alCuadro}>
      {hud.fase === "jugando" ? (
        <div className="absolute right-6 top-4 flex gap-4 text-right">
          <Marcador titulo="Burbujas" valor={hud.puntos} />
          <Marcador titulo="Tiempo" valor={hud.tiempo} alerta={hud.tiempo <= 10} />
        </div>
      ) : (
        <div className="absolute inset-x-0 top-[12%] px-6 text-center drop-shadow-lg">
          {hud.fase === "esperando" ? (
            <>
              <h1 className="text-6xl font-extrabold sm:text-7xl">Burbujas</h1>
              <p className="mt-3 text-2xl sm:text-3xl">Explota todas las que puedas con las manos</p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-extrabold sm:text-6xl">
                ¡Explotaste {hud.puntos} {hud.puntos === 1 ? "burbuja" : "burbujas"}!
              </h1>
              <p className="mt-3 text-2xl sm:text-3xl">
                Récord de hoy: {hud.record} · Toca la burbuja para jugar otra vez
              </p>
            </>
          )}
        </div>
      )}
    </Escenario>
  );
}

function Marcador({ titulo, valor, alerta = false }: { titulo: string; valor: number; alerta?: boolean }) {
  return (
    <div className={`rounded-2xl bg-black/35 px-5 py-2 backdrop-blur ${alerta ? "text-amber-300" : ""}`}>
      <div className="text-base uppercase tracking-wide opacity-80">{titulo}</div>
      <div className="text-5xl font-extrabold tabular-nums" data-marcador={titulo}>
        {valor}
      </div>
    </div>
  );
}
