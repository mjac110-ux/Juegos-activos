import type { Metadata } from "next";
import Burbujas from "@/juegos/burbujas/Burbujas";

export const metadata: Metadata = { title: "Burbujas · Juegos Activos" };

export default function Page() {
  return <Burbujas />;
}
