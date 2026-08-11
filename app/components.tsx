"use client";

import Link from "next/link";
import Image from "next/image";
import { ChefHat, LayoutDashboard, UtensilsCrossed } from "lucide-react";
import { useStore } from "./store";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  const { theme } = useStore();
  return <Link href="/" className={`brand ${inverse ? "brand-inverse" : ""} ${theme.logoImage ? "brand-has-logo" : ""}`}><span className="brand-mark">{theme.logoImage ? <Image src={theme.logoImage} alt="" fill sizes="48px" unoptimized /> : <ChefHat size={18} />}</span><span>{theme.restaurantName}</span></Link>;
}

export function AppSwitcher({ active }: { active: "menu" | "dashboard" | "kitchen" }) {
  return <nav className="app-switcher" aria-label="Áreas do sistema">
    <Link className={active === "menu" ? "active" : ""} href="/"><UtensilsCrossed size={16} /> Cardápio</Link>
    <Link className={active === "dashboard" ? "active" : ""} href="/dashboard"><LayoutDashboard size={16} /> Dashboard</Link>
    <Link className={active === "kitchen" ? "active" : ""} href="/cozinha"><ChefHat size={16} /> Cozinha</Link>
  </nav>;
}
