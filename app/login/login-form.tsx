"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, LogIn, UserRound } from "lucide-react";

export function LoginForm({ next }: { next?: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível entrar.");
      const destination = next === "/cozinha" || (next === "/dashboard" && data.user.role === "admin") ? next : data.redirectTo;
      window.location.assign(destination);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível entrar.");
      setLoading(false);
    }
  }

  return <form className="login-form" onSubmit={submit}><label><span>Usuário</span><div><UserRound size={18} /><input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Digite seu usuário" required /></div></label><label><span>Senha</span><div><LockKeyhole size={18} /><input type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" required /><button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>{error && <p className="login-error" role="alert">{error}</p>}<button className="login-submit" disabled={loading}>{loading ? "Entrando..." : <>Entrar <LogIn size={18} /></>}</button></form>;
}
