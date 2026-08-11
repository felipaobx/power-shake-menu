import { NextResponse } from "next/server";
import { authenticate, setSession } from "../../../auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";
  const user = await authenticate(username, password);
  if (!user) return NextResponse.json({ error: "Usuário ou senha inválidos." }, { status: 401 });
  await setSession(user);
  return NextResponse.json({ user: { username: user.username, role: user.role }, redirectTo: user.role === "admin" ? "/dashboard" : "/cozinha" });
}
