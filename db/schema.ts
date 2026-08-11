import { boolean, integer, numeric, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const orderStatus = pgEnum("order_status", ["new", "preparing", "ready", "done"]);
export const userRole = pgEnum("user_role", ["admin", "kitchen"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 80 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  calories: integer("calories").notNull().default(0),
  carbs: integer("carbs").notNull().default(0),
  protein: integer("protein").notNull().default(0),
  imageUrl: text("image_url"),
  imagePositionX: integer("image_position_x").notNull().default(50),
  imagePositionY: integer("image_position_y").notNull().default(50),
  badge: varchar("badge", { length: 60 }),
  available: boolean("available").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: integer("id").primaryKey(),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 30 }),
  type: varchar("type", { length: 30 }).notNull(),
  status: orderStatus("status").notNull().default("new"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id),
  productName: varchar("product_name", { length: 160 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
});

export const restaurantSettings = pgTable("restaurant_settings", {
  id: integer("id").primaryKey().default(1),
  restaurantName: varchar("restaurant_name", { length: 160 }).notNull(),
  slogan: text("slogan"),
  heroTitle: text("hero_title"),
  heroHighlight: text("hero_highlight"),
  heroDescription: text("hero_description"),
  logoUrl: text("logo_url"),
  primaryColor: varchar("primary_color", { length: 20 }).notNull().default("#18352f"),
  accentColor: varchar("accent_color", { length: 20 }).notNull().default("#e8ff72"),
  backgroundColor: varchar("background_color", { length: 20 }).notNull().default("#080a0b"),
  surfaceColor: varchar("surface_color", { length: 20 }).notNull().default("#12151d"),
  textColor: varchar("text_color", { length: 20 }).notNull().default("#f7f8f6"),
  cornerRadius: integer("corner_radius").notNull().default(18),
  heroImageUrl: text("hero_image_url"),
  address: text("address"),
  openingHours: text("opening_hours"),
  phone: varchar("phone", { length: 30 }),
  instagram: varchar("instagram", { length: 100 }),
  deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 }).default("0"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
