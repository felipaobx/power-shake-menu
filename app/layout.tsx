import type { Metadata } from "next";
import { StoreProvider } from "./store";
import "./globals.css";

export const metadata: Metadata = {
  title: "Power Shake — Cardápio Digital",
  description: "Cardápio digital, gestão de pedidos e operação da cozinha Power Shake.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><StoreProvider>{children}</StoreProvider></body></html>;
}
