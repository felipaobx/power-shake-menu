import type { Metadata } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
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
