import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb, hasDatabase } from "../../../db";
import { ensureSeedData } from "../../../db/seed";
import { addonGroups, addonOptions, categories, orderItems, orders, productAddonGroups, products, restaurantSettings } from "../../../db/schema";
import { getSession } from "../../auth";

export const runtime = "nodejs";

function unavailable() {
  return NextResponse.json({ configured: false }, { status: 503 });
}

export async function GET() {
  if (!hasDatabase()) return unavailable();
  await ensureSeedData();
  const db = getDb();
  const session = await getSession();
  const [productRows, categoryRows, addonGroupRows, addonOptionRows, addonProductRows, orderRows, itemRows, settings] = await Promise.all([
    db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      category: categories.name,
      price: products.price,
      calories: products.calories,
      carbs: products.carbs,
      protein: products.protein,
      image: products.imageUrl,
      imagePositionX: products.imagePositionX,
      imagePositionY: products.imagePositionY,
      available: products.available,
      badge: products.badge,
      updatedAt: products.updatedAt,
    }).from(products).leftJoin(categories, eq(products.categoryId, categories.id)),
    db.select({ name: categories.name }).from(categories).orderBy(categories.sortOrder, categories.id),
    db.select().from(addonGroups).orderBy(addonGroups.id),
    db.select().from(addonOptions).orderBy(addonOptions.id),
    db.select().from(productAddonGroups),
    db.select().from(orders).orderBy(desc(orders.id)),
    db.select().from(orderItems),
    db.select().from(restaurantSettings).where(eq(restaurantSettings.id, 1)).limit(1),
  ]);

  const itemsByOrder = new Map<number, { name: string; quantity: number }[]>();
  for (const item of itemRows) {
    const current = itemsByOrder.get(item.orderId) ?? [];
    current.push({ name: item.productName, quantity: item.quantity });
    itemsByOrder.set(item.orderId, current);
  }

  const config = settings[0];
  return NextResponse.json({
    configured: true,
    categories: categoryRows.map((category) => category.name),
    addonGroups: addonGroupRows.map((group) => ({
      id: group.id,
      name: group.name,
      required: group.required,
      maxSelections: group.maxSelections,
      productIds: addonProductRows.filter((link) => link.groupId === group.id).map((link) => link.productId),
      options: addonOptionRows.filter((option) => option.groupId === group.id).map((option) => ({ id: option.id, name: option.name, price: Number(option.price) })),
    })),
    products: productRows.map((product) => ({
      ...product,
      category: product.category ?? "Outros",
      price: Number(product.price),
      image: product.image?.startsWith("data:image/")
        ? `/api/product-images/${product.id}?v=${product.updatedAt.getTime()}`
        : product.image ?? "",
      badge: product.badge ?? undefined,
      updatedAt: undefined,
    })),
    orders: session ? orderRows.map((order) => ({
      id: order.id,
      customer: order.customerName,
      items: itemsByOrder.get(order.id) ?? [],
      total: Number(order.total),
      status: order.status,
      createdAt: order.createdAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      type: order.type,
    })) : undefined,
    theme: config ? {
      primary: config.primaryColor,
      accent: config.accentColor,
      background: config.backgroundColor,
      surface: config.surfaceColor,
      textColor: config.textColor,
      cornerRadius: config.cornerRadius,
      heroImage: config.heroImageUrl ?? "",
      logoImage: config.logoUrl ?? "",
      restaurantName: config.restaurantName,
      slogan: config.slogan ?? "",
      heroTitle: config.heroTitle ?? "MONTE O PEDIDO",
      heroHighlight: config.heroHighlight ?? "PERFEITO.",
      heroDescription: config.heroDescription ?? "Escolha seu burger, adicione acompanhamentos e finalize em poucos toques.",
    } : undefined,
    settings: config ? {
      address: config.address ?? "",
      hours: config.openingHours ?? "",
      phone: config.phone ?? "",
      instagram: config.instagram ?? "",
      deliveryFee: Number(config.deliveryFee ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    } : undefined,
  }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}

export async function POST(request: Request) {
  if (!hasDatabase()) return unavailable();
  const db = getDb();
  const { action, payload } = await request.json();
  const session = await getSession();
  const publicActions = new Set(["createOrder"]);
  const kitchenActions = new Set(["setOrderStatus"]);
  if (!publicActions.has(action) && !session) return NextResponse.json({ error: "Login necessário." }, { status: 401 });
  if (!publicActions.has(action) && !kitchenActions.has(action) && session?.role !== "admin") return NextResponse.json({ error: "Acesso de administrador necessário." }, { status: 403 });

  if (action === "addProduct") {
    let [category] = await db.select().from(categories).where(eq(categories.name, payload.category)).limit(1);
    if (!category) [category] = await db.insert(categories).values({ name: payload.category }).returning();
    const [created] = await db.insert(products).values({
      categoryId: category.id,
      name: payload.name,
      description: payload.description,
      price: Number(payload.price).toFixed(2),
      calories: payload.calories,
      carbs: payload.carbs,
      protein: payload.protein,
      imageUrl: payload.image,
      imagePositionX: payload.imagePositionX ?? 50,
      imagePositionY: payload.imagePositionY ?? 50,
      badge: payload.badge,
      available: payload.available,
    }).returning({ id: products.id });
    return NextResponse.json(created);
  }

  if (action === "addCategory") {
    const existing = await db.select({ id: categories.id }).from(categories).where(eq(categories.name, payload.name)).limit(1);
    if (!existing.length) await db.insert(categories).values({ name: payload.name });
  } else if (action === "addAddonGroup") {
    const [created] = await db.insert(addonGroups).values({ name: payload.name }).returning({ id: addonGroups.id });
    return NextResponse.json(created);
  } else if (action === "updateAddonGroup") {
    await db.update(addonGroups).set({
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.required !== undefined ? { required: payload.required } : {}),
      ...(payload.maxSelections !== undefined ? { maxSelections: payload.maxSelections } : {}),
    }).where(eq(addonGroups.id, payload.id));
  } else if (action === "deleteAddonGroup") {
    await db.delete(addonGroups).where(eq(addonGroups.id, payload.id));
  } else if (action === "addAddonOption") {
    const [created] = await db.insert(addonOptions).values({ groupId: payload.groupId, name: payload.name, price: Number(payload.price).toFixed(2) }).returning({ id: addonOptions.id });
    return NextResponse.json(created);
  } else if (action === "deleteAddonOption") {
    await db.delete(addonOptions).where(eq(addonOptions.id, payload.id));
  } else if (action === "toggleAddonProduct") {
    if (payload.selected) await db.insert(productAddonGroups).values({ groupId: payload.groupId, productId: payload.productId }).onConflictDoNothing();
    else await db.delete(productAddonGroups).where(and(eq(productAddonGroups.groupId, payload.groupId), eq(productAddonGroups.productId, payload.productId)));
  } else if (action === "deleteCategory") {
    const [category] = await db.select({ id: categories.id }).from(categories).where(eq(categories.name, payload.name)).limit(1);
    if (category) {
      const affected = await db.select({ id: products.id }).from(products).where(eq(products.categoryId, category.id)).limit(1);
      if (affected.length) {
        let [fallback] = await db.select({ id: categories.id }).from(categories).where(eq(categories.name, payload.fallbackName)).limit(1);
        if (!fallback) [fallback] = await db.insert(categories).values({ name: payload.fallbackName }).returning({ id: categories.id });
        await db.update(products).set({ categoryId: fallback.id, updatedAt: new Date() }).where(eq(products.categoryId, category.id));
      }
      await db.delete(categories).where(eq(categories.id, category.id));
    }
  } else if (action === "renameCategory") {
    await db.update(categories).set({ name: payload.newName }).where(eq(categories.name, payload.currentName));
  } else if (action === "updateProduct") {
    let [category] = await db.select().from(categories).where(eq(categories.name, payload.category)).limit(1);
    if (!category) [category] = await db.insert(categories).values({ name: payload.category }).returning();
    const keepsStoredInlineImage = typeof payload.image === "string" && payload.image.startsWith("/api/product-images/");
    await db.update(products).set({
      categoryId: category.id,
      name: payload.name,
      description: payload.description,
      price: Number(payload.price).toFixed(2),
      calories: payload.calories,
      carbs: payload.carbs,
      protein: payload.protein,
      ...(!keepsStoredInlineImage ? { imageUrl: payload.image } : {}),
      imagePositionX: payload.imagePositionX ?? 50,
      imagePositionY: payload.imagePositionY ?? 50,
      badge: payload.badge || null,
      available: payload.available,
      updatedAt: new Date(),
    }).where(eq(products.id, payload.id));
  } else if (action === "toggleProduct") {
    await db.update(products).set({ available: payload.available, updatedAt: new Date() }).where(eq(products.id, payload.id));
  } else if (action === "createOrder") {
    const [created] = await db.insert(orders).values({
      id: payload.id,
      customerName: payload.customer,
      type: payload.type,
      status: "new",
      total: Number(payload.total).toFixed(2),
    }).onConflictDoNothing().returning({ id: orders.id });
    if (created) {
      await db.insert(orderItems).values(payload.items.map((item: { name: string; quantity: number }) => ({
        orderId: payload.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: "0",
      })));
    }
  } else if (action === "setOrderStatus") {
    await db.update(orders).set({ status: payload.status, updatedAt: new Date() }).where(eq(orders.id, payload.id));
  } else if (action === "updateTheme") {
    await db.update(restaurantSettings).set({
      restaurantName: payload.restaurantName,
      slogan: payload.slogan,
      heroTitle: payload.heroTitle,
      heroHighlight: payload.heroHighlight,
      heroDescription: payload.heroDescription,
      primaryColor: payload.primary,
      accentColor: payload.accent,
      backgroundColor: payload.background,
      surfaceColor: payload.surface,
      textColor: payload.textColor,
      cornerRadius: payload.cornerRadius,
      heroImageUrl: payload.heroImage,
      logoUrl: payload.logoImage || null,
      updatedAt: new Date(),
    }).where(eq(restaurantSettings.id, 1));
  } else if (action === "updateSettings") {
    const fee = String(payload.deliveryFee).replace(/[^\d,.-]/g, "").replace(",", ".");
    await db.update(restaurantSettings).set({
      address: payload.address,
      openingHours: payload.hours,
      phone: payload.phone,
      instagram: payload.instagram,
      deliveryFee: Number.isFinite(Number(fee)) ? Number(fee).toFixed(2) : "0",
      updatedAt: new Date(),
    }).where(eq(restaurantSettings.id, 1));
  } else {
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
