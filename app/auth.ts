import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getDb, hasDatabase } from "../db";
import { users } from "../db/schema";

const scrypt = promisify(scryptCallback);
const COOKIE_NAME = "brasa-session";
const SESSION_SECONDS = 60 * 60 * 8;

export type UserRole = "admin" | "kitchen";
export type AuthSession = { userId: number; username: string; role: UserRole; expiresAt: number };

function secret() {
  const value = process.env.AUTH_SECRET || process.env.DATABASE_URL;
  if (value) return value;
  if (process.env.NODE_ENV !== "production") return "brasa-local-development-only-secret";
  throw new Error("AUTH_SECRET não configurada");
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function encodeSession(session: AuthSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

function decodeSession(value?: string): AuthSession | null {
  if (!value) return null;
  const [payload, supplied] = value.split(".");
  if (!payload || !supplied) return null;
  const expected = signature(payload);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AuthSession;
    if (!session.userId || !session.username || !["admin", "kitchen"].includes(session.role) || session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = await scrypt(password, salt, 64) as Buffer;
  const supplied = Buffer.from(hash, "hex");
  return supplied.length === derived.length && timingSafeEqual(supplied, derived);
}

export async function ensureInitialAdmin() {
  if (!hasDatabase()) return null;
  const db = getDb();
  const [existing] = await db.select().from(users).where(eq(users.username, "admin")).limit(1);
  if (existing) return existing;
  const passwordHash = await hashPassword("admin");
  const [created] = await db.insert(users).values({ username: "admin", passwordHash, role: "admin" }).onConflictDoNothing().returning();
  if (created) return created;
  const [concurrent] = await db.select().from(users).where(eq(users.username, "admin")).limit(1);
  return concurrent ?? null;
}

export async function authenticate(username: string, password: string) {
  const normalized = username.trim().toLowerCase();
  if (!hasDatabase()) {
    return normalized === "admin" && password === "admin" ? { id: 1, username: "admin", role: "admin" as const } : null;
  }
  await ensureInitialAdmin();
  const [user] = await getDb().select().from(users).where(and(eq(users.username, normalized), eq(users.active, true))).limit(1);
  if (!user || !(await verifyPassword(password, user.passwordHash))) return null;
  return { id: user.id, username: user.username, role: user.role };
}

export async function setSession(user: { id: number; username: string; role: UserRole }) {
  const expiresAt = Date.now() + SESSION_SECONDS * 1000;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encodeSession({ userId: user.id, username: user.username, role: user.role, expiresAt }), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}

export async function getSession() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(COOKIE_NAME)?.value);
}

export async function requireRole(roles: UserRole[], returnTo: string) {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  if (!roles.includes(session.role)) redirect("/cozinha");
  return session;
}
