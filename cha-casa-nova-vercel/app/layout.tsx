import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "J & L | Lista de Presentes", description: "Escolha um presente especial para celebrar um novo lar.", icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
