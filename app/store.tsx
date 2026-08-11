"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { initialOrders, initialProducts, type AddonGroup, type Order, type OrderStatus, type Product } from "./data";

type Theme = {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  textColor: string;
  cornerRadius: number;
  heroImage: string;
  logoImage: string;
  restaurantName: string;
  slogan: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
};
type Settings = { address: string; hours: string; phone: string; instagram: string; deliveryFee: string };
type Store = {
  products: Product[];
  categories: string[];
  addonGroups: AddonGroup[];
  orders: Order[];
  theme: Theme;
  settings: Settings;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, product: Omit<Product, "id">) => void;
  addCategory: (name: string) => boolean;
  renameCategory: (currentName: string, newName: string) => boolean;
  deleteCategory: (name: string) => boolean;
  addAddonGroup: (name: string) => boolean;
  updateAddonGroup: (id: number, value: Partial<Pick<AddonGroup, "name" | "required" | "maxSelections">>) => void;
  deleteAddonGroup: (id: number) => void;
  addAddonOption: (groupId: number, name: string, price: number) => boolean;
  deleteAddonOption: (groupId: number, optionId: number) => void;
  toggleAddonProduct: (groupId: number, productId: number) => void;
  toggleProduct: (id: number) => void;
  updateTheme: (value: Partial<Theme>) => void;
  updateSettings: (value: Partial<Settings>) => void;
  createOrder: (order: Omit<Order, "id" | "status" | "createdAt">) => number;
  setOrderStatus: (id: number, status: OrderStatus) => void;
};

const defaultTheme: Theme = {
  primary: "#0a0c0d",
  accent: "#82ff00",
  background: "#080a0b",
  surface: "#12151d",
  textColor: "#f7f8f6",
  cornerRadius: 18,
  heroImage: "https://images.unsplash.com/photo-1549611016-3a70d82b5040?auto=format&fit=crop&w=1800&q=92",
  logoImage: "",
  restaurantName: "Power Shake",
  slogan: "Sabor, energia e resultado em cada pedido.",
  heroTitle: "MONTE O PEDIDO",
  heroHighlight: "PERFEITO.",
  heroDescription: "Escolha seu burger, adicione acompanhamentos e finalize em poucos toques.",
};
const defaultSettings: Settings = { address: "Rua das Palmeiras, 248 — Centro", hours: "Ter–Dom, 18h às 23h30", phone: "(11) 99842-1122", instagram: "@powershake", deliveryFee: "R$ 6,00" };
const StoreContext = createContext<Store | null>(null);
const defaultCategories = [...new Set(initialProducts.map((product) => product.category))];

async function persist(action: string, payload: unknown) {
  const response = await fetch("/api/store", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  if (!response.ok) throw new Error("Não foi possível salvar no banco");
  return response.json();
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(defaultCategories);
  const [addonGroups, setAddonGroups] = useState<AddonGroup[]>([]);
  const [orders, setOrders] = useState(initialOrders);
  const [theme, setTheme] = useState(defaultTheme);
  const [settings, setSettings] = useState(defaultSettings);
  const [hydrated, setHydrated] = useState(false);
  const databaseConfigured = useRef(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem("brasa-store-v1");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.products) setProducts(parsed.products);
          if (parsed.categories) setCategories(parsed.categories);
          if (parsed.addonGroups) setAddonGroups(parsed.addonGroups);
          if (parsed.orders) setOrders(parsed.orders);
          if (parsed.theme) {
            const isLegacyTheme = !parsed.theme.background;
            setTheme(isLegacyTheme
              ? { ...defaultTheme, restaurantName: parsed.theme.restaurantName ?? defaultTheme.restaurantName, slogan: parsed.theme.slogan ?? defaultTheme.slogan }
              : { ...defaultTheme, ...parsed.theme });
          }
          if (parsed.settings) setSettings(parsed.settings);
        }
      } catch { /* mantém os dados iniciais */ }
      setHydrated(true);
    });

    fetch("/api/store")
      .then((response) => response.ok ? response.json() : null)
      .then((saved) => {
        if (!saved?.configured) return;
        databaseConfigured.current = true;
        if (saved.products) setProducts(saved.products);
        if (saved.categories) setCategories(saved.categories);
        if (saved.addonGroups) setAddonGroups(saved.addonGroups);
        if (saved.orders) setOrders(saved.orders);
        if (saved.theme) setTheme({ ...defaultTheme, ...saved.theme });
        if (saved.settings) setSettings(saved.settings);
      })
      .catch(() => { /* segue com o modo local durante o desenvolvimento */ });
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("brasa-store-v1", JSON.stringify({ products, categories, addonGroups, orders, theme, settings }));
  }, [products, categories, addonGroups, orders, theme, settings, hydrated]);

  useEffect(() => {
    if (!databaseConfigured.current) return;
    const timer = window.setTimeout(() => { void persist("updateTheme", theme).catch(() => undefined); }, 500);
    return () => window.clearTimeout(timer);
  }, [theme]);

  useEffect(() => {
    if (!databaseConfigured.current) return;
    const timer = window.setTimeout(() => { void persist("updateSettings", settings).catch(() => undefined); }, 500);
    return () => window.clearTimeout(timer);
  }, [settings]);

  const value = useMemo<Store>(() => ({
    products,
    categories,
    addonGroups,
    orders,
    theme,
    settings,
    addProduct: (product) => {
      const temporaryId = -Date.now();
      setProducts((current) => [...current, { ...product, id: temporaryId }]);
      if (databaseConfigured.current) {
        void persist("addProduct", product)
          .then(({ id }) => setProducts((current) => current.map((item) => item.id === temporaryId ? { ...item, id } : item)))
          .catch(() => undefined);
      }
    },
    updateProduct: (id, product) => {
      setProducts((current) => current.map((item) => item.id === id ? { ...product, id } : item));
      if (databaseConfigured.current) void persist("updateProduct", { id, ...product }).catch(() => undefined);
    },
    addCategory: (name) => {
      const normalized = name.trim();
      if (!normalized || categories.some((item) => item.toLowerCase() === normalized.toLowerCase())) return false;
      setCategories((current) => [...current, normalized]);
      if (databaseConfigured.current) void persist("addCategory", { name: normalized }).catch(() => undefined);
      return true;
    },
    renameCategory: (currentName, newName) => {
      const normalized = newName.trim();
      if (!normalized || (currentName.toLowerCase() !== normalized.toLowerCase() && categories.some((item) => item.toLowerCase() === normalized.toLowerCase()))) return false;
      setCategories((current) => current.map((item) => item === currentName ? normalized : item));
      setProducts((current) => current.map((product) => product.category === currentName ? { ...product, category: normalized } : product));
      if (databaseConfigured.current) void persist("renameCategory", { currentName, newName: normalized }).catch(() => undefined);
      return true;
    },
    deleteCategory: (name) => {
      if (!categories.includes(name)) return false;
      const hasProducts = products.some((product) => product.category === name);
      const fallbackName = name.toLowerCase() === "outros" ? "Geral" : "Outros";
      setCategories((current) => {
        const remaining = current.filter((item) => item !== name);
        return hasProducts && !remaining.some((item) => item.toLowerCase() === fallbackName.toLowerCase()) ? [...remaining, fallbackName] : remaining;
      });
      if (hasProducts) setProducts((current) => current.map((product) => product.category === name ? { ...product, category: fallbackName } : product));
      if (databaseConfigured.current) void persist("deleteCategory", { name, fallbackName }).catch(() => undefined);
      return true;
    },
    addAddonGroup: (name) => {
      const normalized = name.trim();
      if (!normalized || addonGroups.some((group) => group.name.toLowerCase() === normalized.toLowerCase())) return false;
      const temporaryId = -Date.now();
      setAddonGroups((current) => [...current, { id: temporaryId, name: normalized, required: false, maxSelections: 1, productIds: [], options: [] }]);
      if (databaseConfigured.current) void persist("addAddonGroup", { name: normalized }).then(({ id }) => setAddonGroups((current) => current.map((group) => group.id === temporaryId ? { ...group, id } : group))).catch(() => undefined);
      return true;
    },
    updateAddonGroup: (id, changes) => {
      setAddonGroups((current) => current.map((group) => group.id === id ? { ...group, ...changes } : group));
      if (databaseConfigured.current && id > 0) void persist("updateAddonGroup", { id, ...changes }).catch(() => undefined);
    },
    deleteAddonGroup: (id) => {
      setAddonGroups((current) => current.filter((group) => group.id !== id));
      if (databaseConfigured.current && id > 0) void persist("deleteAddonGroup", { id }).catch(() => undefined);
    },
    addAddonOption: (groupId, name, price) => {
      const normalized = name.trim();
      const group = addonGroups.find((item) => item.id === groupId);
      if (!group || !normalized || group.options.some((option) => option.name.toLowerCase() === normalized.toLowerCase())) return false;
      const temporaryId = -Date.now();
      setAddonGroups((current) => current.map((item) => item.id === groupId ? { ...item, options: [...item.options, { id: temporaryId, name: normalized, price }] } : item));
      if (databaseConfigured.current && groupId > 0) void persist("addAddonOption", { groupId, name: normalized, price }).then(({ id }) => setAddonGroups((current) => current.map((item) => item.id === groupId ? { ...item, options: item.options.map((option) => option.id === temporaryId ? { ...option, id } : option) } : item))).catch(() => undefined);
      return true;
    },
    deleteAddonOption: (groupId, optionId) => {
      setAddonGroups((current) => current.map((group) => group.id === groupId ? { ...group, options: group.options.filter((option) => option.id !== optionId) } : group));
      if (databaseConfigured.current && optionId > 0) void persist("deleteAddonOption", { id: optionId }).catch(() => undefined);
    },
    toggleAddonProduct: (groupId, productId) => {
      const group = addonGroups.find((item) => item.id === groupId);
      if (!group) return;
      const selected = !group.productIds.includes(productId);
      setAddonGroups((current) => current.map((item) => item.id === groupId ? { ...item, productIds: selected ? [...item.productIds, productId] : item.productIds.filter((id) => id !== productId) } : item));
      if (databaseConfigured.current && groupId > 0 && productId > 0) void persist("toggleAddonProduct", { groupId, productId, selected }).catch(() => undefined);
    },
    toggleProduct: (id) => {
      const product = products.find((item) => item.id === id);
      if (!product) return;
      const available = !product.available;
      setProducts((current) => current.map((item) => item.id === id ? { ...item, available } : item));
      if (databaseConfigured.current) void persist("toggleProduct", { id, available }).catch(() => undefined);
    },
    updateTheme: (value) => setTheme((current) => ({ ...current, ...value })),
    updateSettings: (value) => setSettings((current) => ({ ...current, ...value })),
    createOrder: (order) => {
      const id = Math.max(1050, ...orders.map((item) => item.id)) + 1;
      const created = { ...order, id, status: "new" as const, createdAt: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) };
      setOrders((current) => [created, ...current]);
      if (databaseConfigured.current) void persist("createOrder", created).catch(() => undefined);
      return id;
    },
    setOrderStatus: (id, status) => {
      setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
      if (databaseConfigured.current) void persist("setOrderStatus", { id, status }).catch(() => undefined);
    },
  }), [products, categories, addonGroups, orders, theme, settings]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("StoreProvider ausente");
  return store;
}

export const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
