import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("menu offers complements and complete cart controls", async () => {
  const [page, css, layout] = await Promise.all([
    source("app/page.tsx"),
    source("app/globals.css"),
    source("app/layout.tsx"),
  ]);

  assert.match(page, /Quer algum complemento\?/);
  assert.match(page, /function AddonPicker/);
  assert.match(page, /clear-cart-button/);
  assert.match(page, /remove-cart-item/);
  assert.match(page, /item\.addons\.map/);
  assert.match(css, /\.cart-panel,\.cart-panel \* \{ font-family:"Poppins"/);
  assert.match(layout, /@fontsource\/poppins\/900\.css/);
});

test("dashboard and database persist complement groups", async () => {
  const [dashboard, store, route, schema] = await Promise.all([
    source("app/dashboard/page.tsx"),
    source("app/store.tsx"),
    source("app/api/store/route.ts"),
    source("db/schema.ts"),
  ]);

  assert.match(dashboard, /Grupos de complementos/);
  assert.match(dashboard, /toggleAddonProduct/);
  assert.match(store, /addAddonOption/);
  assert.match(route, /action === "addAddonGroup"/);
  assert.match(schema, /pgTable\("addon_groups"/);
  assert.match(schema, /pgTable\("product_addon_groups"/);
});

test("dashboard metrics come from persisted orders", async () => {
  const [dashboard, route] = await Promise.all([
    source("app/dashboard/page.tsx"),
    source("app/api/store/route.ts"),
  ]);

  assert.doesNotMatch(dashboard, /orders\.length \+ 37|revenue \+ 1784|R\$ 12\.840,60/);
  assert.match(dashboard, /ordersForDay\(orders, now\)/);
  assert.match(dashboard, /averageCompletionMinutes/);
  assert.match(route, /createdAtIso: order\.createdAt\.toISOString\(\)/);
  assert.match(route, /updatedAtIso: order\.updatedAt\.toISOString\(\)/);
});
