export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  calories: number;
  carbs: number;
  protein: number;
  image: string;
  imagePositionX?: number;
  imagePositionY?: number;
  available: boolean;
  badge?: string;
};

export type AddonOption = {
  id: number;
  name: string;
  price: number;
};

export type AddonGroup = {
  id: number;
  name: string;
  required: boolean;
  maxSelections: number;
  productIds: number[];
  options: AddonOption[];
};

export type OrderStatus = "new" | "preparing" | "ready" | "done";
export type Order = {
  id: number;
  customer: string;
  items: { name: string; quantity: number }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  type: "Entrega" | "Retirada";
};

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Smash Trufado",
    description: "Blend 160g, queijo prato, cebola caramelizada e maionese trufada no brioche.",
    category: "Burgers",
    price: 34.9,
    calories: 684,
    carbs: 48,
    protein: 39,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
    available: true,
    badge: "Mais pedido",
  },
  {
    id: 2,
    name: "Duplo Bacon",
    description: "Dois smash 100g, cheddar inglês, bacon crocante e molho da casa.",
    category: "Burgers",
    price: 39.9,
    calories: 812,
    carbs: 45,
    protein: 52,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85",
    available: true,
    badge: "Favorito",
  },
  {
    id: 3,
    name: "Green Crunch",
    description: "Burger vegetal, queijo, rúcula, tomate confit e aioli de ervas.",
    category: "Burgers",
    price: 32.9,
    calories: 528,
    carbs: 61,
    protein: 24,
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=900&q=85",
    available: true,
    badge: "Veggie",
  },
  {
    id: 4,
    name: "Fritas da Casa",
    description: "Fritas crocantes, páprica defumada e maionese de alho assado.",
    category: "Acompanhamentos",
    price: 17.9,
    calories: 392,
    carbs: 51,
    protein: 6,
    image: "https://images.unsplash.com/photo-1639744210631-209fce3e256c?auto=format&fit=crop&w=900&q=85",
    available: true,
  },
  {
    id: 5,
    name: "Onion Rings",
    description: "Anéis de cebola super crocantes com barbecue de rapadura.",
    category: "Acompanhamentos",
    price: 19.9,
    calories: 448,
    carbs: 56,
    protein: 7,
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=85",
    available: true,
  },
  {
    id: 6,
    name: "Shake de Pistache",
    description: "Sorvete artesanal, pasta de pistache e chantilly fresco.",
    category: "Bebidas",
    price: 22.9,
    calories: 476,
    carbs: 62,
    protein: 11,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=85",
    available: true,
    badge: "Novo",
  },
];

export const initialOrders: Order[] = [
  { id: 1048, customer: "Marina", items: [{ name: "Duplo Bacon", quantity: 2 }, { name: "Fritas da Casa", quantity: 1 }], total: 99.7, status: "new", createdAt: "19:42", type: "Entrega" },
  { id: 1047, customer: "Rafael", items: [{ name: "Smash Trufado", quantity: 1 }, { name: "Shake de Pistache", quantity: 1 }], total: 57.8, status: "preparing", createdAt: "19:36", type: "Retirada" },
  { id: 1046, customer: "Beatriz", items: [{ name: "Green Crunch", quantity: 2 }], total: 65.8, status: "preparing", createdAt: "19:31", type: "Entrega" },
  { id: 1045, customer: "Lucas", items: [{ name: "Smash Trufado", quantity: 1 }, { name: "Onion Rings", quantity: 1 }], total: 54.8, status: "ready", createdAt: "19:24", type: "Retirada" },
  { id: 1044, customer: "Camila", items: [{ name: "Duplo Bacon", quantity: 1 }], total: 39.9, status: "done", createdAt: "19:08", type: "Entrega" },
];
