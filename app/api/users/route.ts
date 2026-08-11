import { and, count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSession, hashPassword } from "../../auth";
import { getDb, hasDatabase } from "../../../db";
import { users } from "../../../db/schema";

export const runtime = "nodejs";

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "admin" ? session : null;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  if (!hasDatabase()) return NextResponse.json({ configured: false, users: [{ id: 1, username: "admin", role: "admin", active: true }] });
  const rows = await getDb().select({ id: users.id, username: users.username, role: users.role, active: users.active, createdAt: users.createdAt }).from(users).orderBy(users.username);
  return NextResponse.json({ configured: true, users: rows });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  if (!hasDatabase()) return NextResponse.json({ error: "Configure o banco de dados para adicionar usuários." }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = body.role === "admin" || body.role === "kitchen" ? body.role : null;
  if (!/^[a-z0-9._-]{3,80}$/.test(username)) return NextResponse.json({ error: "Use pelo menos 3 caracteres: letras, números, ponto, traço ou sublinhado." }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "A senha precisa ter pelo menos 6 caracteres." }, { status: 400 });
  if (!role) return NextResponse.json({ error: "Escolha um perfil válido." }, { status: 400 });
  const db = getDb();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1);
  if (existing) return NextResponse.json({ error: "Este usuário já existe." }, { status: 409 });
  const [created] = await db.insert(users).values({ username, passwordHash: await hashPassword(password), role }).returning({ id: users.id, username: users.username, role: users.role, active: users.active, createdAt: users.createdAt });
  return NextResponse.json({ user: created }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  if (!hasDatabase()) return NextResponse.json({ error: "O administrador inicial não pode ser excluído neste modo." }, { status: 400 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Usuário inválido." }, { status: 400 });
  if (id === session.userId) return NextResponse.json({ error: "Você não pode excluir seu próprio acesso." }, { status: 400 });
  const db = getDb();
  const [target] = await db.select({ role: users.role }).from(users).where(eq(users.id, id)).limit(1);
  if (!target) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  if (target.role === "admin") {
    const [result] = await db.select({ value: count() }).from(users).where(and(eq(users.role, "admin"), eq(users.active, true)));
    if (result.value <= 1) return NextResponse.json({ error: "É necessário manter pelo menos um administrador." }, { status: 400 });
  }
  await db.delete(users).where(eq(users.id, id));
  return NextResponse.json({ ok: true });
}
