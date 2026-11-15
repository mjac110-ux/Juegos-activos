import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio estático (carpeta out/): corre en cualquier PC o mini PC con un
  // navegador, incluso sin internet, o en cualquier hosting.
  // Por eso no se activan cacheComponents ni partialPrefetching: necesitan servidor.
  output: "export",
  // En GitHub Pages el sitio vive en /Juegos-activos/: el workflow pasa esa
  // ruta en NEXT_PUBLIC_RUTA_BASE. En local queda vacía.
  basePath: process.env.NEXT_PUBLIC_RUTA_BASE ?? "",
  // /juegos/burbujas/index.html en vez de /juegos/burbujas.html: funciona en
  // cualquier hosting estático sin configurar nada.
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
