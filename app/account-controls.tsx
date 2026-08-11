"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

type SessionUser = { username: string; role: "admin" | "kitchen" };

export function AccountChip() {
  const [user, setUser] = useState<SessionUser | null>(null);
  useEffect(() => { fetch("/api/auth/session").then((response) => response.ok ? response.json() : null).then((data) => setUser(data?.user ?? null)).catch(() => undefined); }, []);
  return <div className="user-chip"><span>{(user?.username ?? "A").slice(0, 2).toUpperCase()}</span><div><b>{user?.username ?? "Administrador"}</b><small>{user?.role === "kitchen" ? "Cozinha" : "Administrador"}</small></div><LogoutButton iconOnly /></div>;
}

export function LogoutButton({ iconOnly = false }: { iconOnly?: boolean }) {
  const [loading, setLoading] = useState(false);
  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    window.location.assign("/login");
  }
  return <button type="button" className={iconOnly ? "account-logout-icon" : "logout-button"} onClick={() => void logout()} disabled={loading} aria-label="Sair do sistema"><LogOut size={18} />{!iconOnly && <span>{loading ? "Saindo..." : "Sair"}</span>}</button>;
}
