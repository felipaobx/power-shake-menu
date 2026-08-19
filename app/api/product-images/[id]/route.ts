import { eq } from "drizzle-orm";
import { getDb, hasDatabase } from "../../../../db";
import { products } from "../../../../db/schema";

export const runtime = "nodejs";

const INLINE_IMAGE = /^data:(image\/(?:avif|gif|jpeg|png|webp));base64,([a-z0-9+/=\s]+)$/i;

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) return new Response("Imagem indisponível", { status: 404 });

  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return new Response("Imagem inválida", { status: 400 });

  const [product] = await getDb()
    .select({ image: products.imageUrl })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  const match = product?.image?.match(INLINE_IMAGE);
  if (!match) return new Response("Imagem não encontrada", { status: 404 });

  const bytes = Buffer.from(match[2].replace(/\s/g, ""), "base64");
  return new Response(bytes, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(bytes.length),
      "Content-Type": match[1].toLowerCase(),
    },
  });
}
