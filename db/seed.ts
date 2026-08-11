import { initialOrders, initialProducts } from "../app/data";
import { categories, orderItems, orders, products, restaurantSettings } from "./schema";
import { getDb } from "./index";

export async function ensureSeedData() {
  const db = getDb();
  const [existingProduct] = await db.select({ id: products.id }).from(products).limit(1);

  if (!existingProduct) {
    const names = [...new Set(initialProducts.map((product) => product.category))];
    const insertedCategories = await db.insert(categories).values(
      names.map((name, index) => ({ name, sortOrder: index }))
    ).returning({ id: categories.id, name: categories.name });
    const categoryIds = new Map(insertedCategories.map((category) => [category.name, category.id]));

    await db.insert(products).values(initialProducts.map((product) => ({
      categoryId: categoryIds.get(product.category),
      name: product.name,
      description: product.description,
      price: product.price.toFixed(2),
      calories: product.calories,
      carbs: product.carbs,
      protein: product.protein,
      imageUrl: product.image,
      imagePositionX: product.imagePositionX ?? 50,
      imagePositionY: product.imagePositionY ?? 50,
      badge: product.badge,
      available: product.available,
    })));
  }

  const [existingOrder] = await db.select({ id: orders.id }).from(orders).limit(1);
  if (!existingOrder) {
    for (const order of initialOrders) {
      await db.insert(orders).values({
        id: order.id,
        customerName: order.customer,
        type: order.type,
        status: order.status,
        total: order.total.toFixed(2),
      });
      await db.insert(orderItems).values(order.items.map((item) => ({
        orderId: order.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: "0",
      })));
    }
  }

  await db.insert(restaurantSettings).values({
    id: 1,
    restaurantName: "Power Shake",
    slogan: "Sabor, energia e resultado em cada pedido.",
    heroTitle: "MONTE O PEDIDO",
    heroHighlight: "PERFEITO.",
    heroDescription: "Escolha seu burger, adicione acompanhamentos e finalize em poucos toques.",
    primaryColor: "#0a0c0d",
    accentColor: "#82ff00",
    backgroundColor: "#080a0b",
    surfaceColor: "#12151d",
    textColor: "#f7f8f6",
    cornerRadius: 18,
    heroImageUrl: "https://images.unsplash.com/photo-1549611016-3a70d82b5040?auto=format&fit=crop&w=1800&q=92",
    address: "Rua das Palmeiras, 248 — Centro",
    openingHours: "Ter–Dom, 18h às 23h30",
    phone: "(11) 99842-1122",
    instagram: "@powershake",
    deliveryFee: "6.00",
  }).onConflictDoNothing();
}
