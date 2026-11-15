import type { Metadata, Viewport } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";

// La letra se descarga al compilar y queda dentro del proyecto: no hace falta
// internet para jugar.
const letra = Baloo_2({ variable: "--font-juego", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Juegos Activos",
  description: "Juegos para moverse frente a la cámara, sin control.",
};

export const viewport: Viewport = { themeColor: "#1e1b4b" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${letra.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
