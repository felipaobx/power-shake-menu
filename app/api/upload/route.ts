import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getSession } from "../../auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSession();
  if (session?.role !== "admin") return NextResponse.json({ error: "Acesso de administrador necessário." }, { status: 403 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Vercel Blob ainda não configurado" }, { status: 503 });
  }

  const data = await request.formData();
  const file = data.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Imagem inválida" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Imagem acima de 5 MB" }, { status: 413 });
  }

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const blob = await put(`cardapio/${safeName}`, file, { access: "public", addRandomSuffix: true });
  return NextResponse.json({ url: blob.url });
}
