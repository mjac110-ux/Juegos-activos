import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio estático (carpeta out/): corre en cualquier PC o mini PC con un
  // navegador, incluso sin internet, o en cualquier hosting.
  // Por eso no se activan cacheComponents ni partialPrefetching: necesitan servidor.
  output: "export",
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
