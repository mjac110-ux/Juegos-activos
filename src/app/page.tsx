import Link from "next/link";

const JUEGOS = [
  {
    nombre: "Burbujas",
    href: "/juegos/burbujas",
    emoji: "🫧",
    texto: "Explota burbujas con las manos antes de que se escapen.",
    color: "from-sky-400 to-indigo-500",
  },
  {
    nombre: "Esquiva",
    emoji: "🏃",
    texto: "Agáchate y salta para que no te toquen.",
    color: "from-emerald-400 to-teal-600",
  },
  {
    nombre: "Estatuas",
    emoji: "🗿",
    texto: "Baila con la música y quédate quieto cuando pare.",
    color: "from-fuchsia-400 to-pink-600",
  },
];

export default function Menu() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
      <h1 className="text-5xl font-extrabold sm:text-6xl">Juegos Activos</h1>
      <p className="mt-2 text-xl opacity-80 sm:text-2xl">
        Párate frente a la cámara y juega con todo el cuerpo.
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {JUEGOS.map((j) => {
          const tarjeta = (
            <div
              className={`h-full rounded-3xl bg-gradient-to-br ${j.color} p-6 shadow-xl ${
                j.href ? "transition hover:scale-[1.03]" : "opacity-45"
              }`}
            >
              <div className="text-6xl" aria-hidden>
                {j.emoji}
              </div>
              <h2 className="mt-3 text-3xl font-extrabold">{j.nombre}</h2>
              <p className="mt-1 text-lg leading-snug">{j.texto}</p>
              {!j.href && <p className="mt-3 text-sm font-bold uppercase">Pronto</p>}
            </div>
          );
          return (
            <li key={j.nombre}>
              {j.href ? <Link href={j.href}>{tarjeta}</Link> : tarjeta}
            </li>
          );
        })}
      </ul>

      <p className="mt-auto pt-10 text-base opacity-70">
        La cámara se usa sólo en este equipo: la imagen no se graba ni se envía a ningún lado.
      </p>
    </main>
  );
}
