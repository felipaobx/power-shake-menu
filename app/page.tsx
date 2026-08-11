"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, ChevronRight, Clock3, Flame, MapPin, Minus, Plus, Search, ShoppingBag, Sparkles, Trash2, X } from "lucide-react";
import { Brand } from "./components";
import type { AddonGroup, AddonOption, Product } from "./data";
import { money, useStore } from "./store";

type CartLine = { key: string; productId: number; quantity: number; addonIds: number[] };
type CartItem = Product & { key: string; quantity: number; addons: AddonOption[]; unitPrice: number };

export default function MenuPage() {
  const { products, categories: categoryNames, addonGroups, theme, settings, createOrder } = useStore();
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customizing, setCustomizing] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [success, setSuccess] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const categories = ["Todos", ...categoryNames];
  const visible = products.filter((item) => item.available && (category === "Todos" || item.category === category) && item.name.toLowerCase().includes(query.toLowerCase()));
  const allOptions = addonGroups.flatMap((group) => group.options);
  const cartItems = cart.map((line) => {
    const product = products.find((item) => item.id === line.productId);
    if (!product) return null;
    const addons = line.addonIds.map((id) => allOptions.find((option) => option.id === id)).filter((option): option is AddonOption => Boolean(option));
    return { ...product, key: line.key, quantity: line.quantity, addons, unitPrice: product.price + addons.reduce((sum, option) => sum + option.price, 0) };
  }).filter((item): item is CartItem => Boolean(item));
  const totals = useMemo(() => cartItems.reduce((acc, item) => ({ price: acc.price + item.unitPrice * item.quantity, calories: acc.calories + item.calories * item.quantity, carbs: acc.carbs + item.carbs * item.quantity, protein: acc.protein + item.protein * item.quantity }), { price: 0, calories: 0, carbs: 0, protein: 0 }), [cartItems]);
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addSelection(product: Product, addonIds: number[]) {
    const sortedIds = [...addonIds].sort((a, b) => a - b);
    const key = `${product.id}:${sortedIds.join("-")}`;
    setCart((current) => current.some((line) => line.key === key) ? current.map((line) => line.key === key ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { key, productId: product.id, quantity: 1, addonIds: sortedIds }]);
    setCustomizing(null);
  }

  function startAdd(product: Product) {
    const groups = addonGroups.filter((group) => group.productIds.includes(product.id) && group.options.length);
    if (groups.length) setCustomizing(product); else addSelection(product, []);
  }

  function change(key: string, amount: number) {
    setCart((current) => current.map((line) => line.key === key ? { ...line, quantity: line.quantity + amount } : line).filter((line) => line.quantity > 0));
  }

  function changeProduct(product: Product, amount: number) {
    if (amount > 0) { startAdd(product); return; }
    const line = [...cart].reverse().find((item) => item.productId === product.id);
    if (line) change(line.key, -1);
  }

  function checkout() {
    if (!cartItems.length) return;
    const name = customerName.trim();
    if (!name) { setCheckoutError("Informe o nome para identificar o pedido."); setCartOpen(true); return; }
    const id = createOrder({ customer: name, items: cartItems.map((item) => ({ name: item.addons.length ? `${item.name} + ${item.addons.map((addon) => addon.name).join(", ")}` : item.name, quantity: item.quantity })), total: totals.price, type: "Retirada" });
    setSuccess(id); setCart([]); setCustomerName(""); setCheckoutError(""); setCartOpen(false);
  }

  const cartPanelProps = { items: cartItems, totals, change, remove: (key: string) => setCart((current) => current.filter((line) => line.key !== key)), clear: () => setCart([]), checkout, customerName, setCustomerName, checkoutError, clearCheckoutError: () => setCheckoutError("") };

  return <main className="menu-page" style={{ "--primary": theme.primary, "--accent": theme.accent, "--power-accent": theme.accent, "--power-bg": theme.background, "--power-card": theme.surface, "--power-text": theme.textColor, "--power-radius": `${theme.cornerRadius}px`, "--hero-image": `url(${theme.heroImage})` } as React.CSSProperties}>
    <header className="menu-header"><Brand /><div className="header-location"><span><MapPin size={15} /> {settings.address.split("—")[0]}</span><span><Clock3 size={15} /> Aberto agora</span></div><button className="cart-pill" onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span>{quantity}</span><b>{money(totals.price)}</b></button></header>

    <section className="menu-hero"><div className="hero-copy"><span className="eyebrow hero-brand-badge">{theme.logoImage ? <span className="hero-badge-logo"><Image src={theme.logoImage} alt={`Logo ${theme.restaurantName}`} fill unoptimized sizes="32px" /></span> : <Sparkles size={14} />}<span>{theme.restaurantName}</span></span><h1>{theme.heroTitle}<br /><em>{theme.heroHighlight}</em></h1><p>{theme.heroDescription}</p><a href="#cardapio" className="primary-button">VER CARDÁPIO <ArrowRight size={17} /></a></div><div className="hero-image"><div className="hero-photo" /><div className="floating-note"><span>★ 4,9</span><small>+2.4 mil avaliações</small></div><div className="hero-stamp">100%<br /><small>ARTESANAL</small></div></div></section>

    <section className="menu-content" id="cardapio"><div className="menu-main"><div className="section-heading"><div><span className="eyebrow muted">NOSSO CARDÁPIO</span><h2>ESCOLHA O SEU FAVORITO</h2></div><label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar no cardápio" /></label></div><div className="category-row">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="product-grid">{visible.map((product) => {
      const productQuantity = cart.filter((line) => line.productId === product.id).reduce((sum, line) => sum + line.quantity, 0);
      return <article className="product-card" key={product.id}><div className="product-image"><Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 600px) 120px, (max-width: 1100px) 50vw, 30vw" style={{ objectPosition: `${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%` }} />{product.badge && <span>{product.badge}</span>}</div><div className="product-body"><div><h3>{product.name}</h3><p>{product.description}</p></div><div className="macro-line"><span><Flame size={14} /> {product.calories} kcal</span><span>{product.protein}g prot.</span><span>{product.carbs}g carb.</span></div><div className="product-bottom"><strong>{money(product.price)}</strong>{productQuantity ? <div className="quantity-control"><button onClick={() => changeProduct(product, -1)}><Minus size={14} /></button><b>{productQuantity}</b><button onClick={() => changeProduct(product, 1)}><Plus size={14} /></button></div> : <button className="add-button" onClick={() => startAdd(product)}><Plus size={18} /> Adicionar</button>}</div></div></article>;
    })}</div></div><CartPanel className="desktop-cart" {...cartPanelProps} /></section>

    <footer className="menu-footer"><Brand inverse /><p>{settings.address} · {settings.hours}</p><p>{settings.phone} · {settings.instagram}</p></footer>
    {quantity > 0 && <button className="mobile-cart-bar" onClick={() => setCartOpen(true)}><span><ShoppingBag size={18} /> Ver pedido <b>{quantity}</b></span><strong>{money(totals.price)}</strong></button>}
    {cartOpen && <div className="drawer-backdrop" role="button" tabIndex={0} aria-label="Fechar pedido" onClick={(event) => { if (event.currentTarget === event.target) setCartOpen(false); }} onKeyDown={(event) => { if (event.key === "Escape" || event.key === "Enter" || event.key === " ") setCartOpen(false); }}><div className="cart-drawer"><button className="close-button" onClick={() => setCartOpen(false)}><X /></button><CartPanel {...cartPanelProps} /></div></div>}
    {customizing && <AddonPicker product={customizing} groups={addonGroups.filter((group) => group.productIds.includes(customizing.id) && group.options.length)} onClose={() => setCustomizing(null)} onAdd={(addonIds) => addSelection(customizing, addonIds)} />}
    {success && <div className="success-toast"><span><Check size={18} /></span><div><b>Pedido #{success} enviado!</b><small>A cozinha já recebeu seu pedido.</small></div><button onClick={() => setSuccess(null)}><X size={16} /></button></div>}
  </main>;
}

function CartPanel({ items, totals, change, remove, clear, checkout, customerName, setCustomerName, checkoutError, clearCheckoutError, className = "" }: { items: CartItem[]; totals: { price: number; calories: number; carbs: number; protein: number }; change: (key: string, amount: number) => void; remove: (key: string) => void; clear: () => void; checkout: () => void; customerName: string; setCustomerName: (name: string) => void; checkoutError: string; clearCheckoutError: () => void; className?: string }) {
  const { theme } = useStore();
  return <aside className={`cart-panel ${className}`}><div className="cart-title"><div><span className="eyebrow muted">{theme.restaurantName}</span><h3>RESUMO DO PEDIDO</h3></div>{items.length ? <button className="clear-cart-button" onClick={clear}><Trash2 size={14} /> Limpar</button> : <ShoppingBag size={22} />}</div>{!items.length ? <div className="empty-cart"><ShoppingBag size={30} /><b>Nenhum item selecionado</b><p>Comece escolhendo seu burger e os acompanhamentos.</p></div> : <><div className="nutrition-item-list">{items.map((item) => <article className="nutrition-card nutrition-product-summary" key={item.key}><div className="nutrition-product-item"><Image src={item.image} alt="" width={52} height={52} unoptimized style={{ objectPosition: `${item.imagePositionX ?? 50}% ${item.imagePositionY ?? 50}%` }} /><div><b>{item.name}</b><small>{money(item.unitPrice)} por unidade</small>{item.addons.length > 0 && <em>{item.addons.map((addon) => addon.name).join(" · ")}</em>}</div><div className="mini-quantity"><button onClick={() => change(item.key, -1)}><Minus size={12} /></button><span>{item.quantity}</span><button onClick={() => change(item.key, 1)}><Plus size={12} /></button></div><button className="remove-cart-item" aria-label={`Remover ${item.name}`} onClick={() => remove(item.key)}><Trash2 size={13} /> Remover</button></div><div className="nutrition-head"><span>Valores nutricionais por unidade</span><Flame size={16} /></div><div className="nutrition-total"><strong>{item.calories}</strong><span>kcal</span></div><div className="macro-bars"><Macro label="Proteínas" value={item.protein} max={80} color="#f1c86a" /><Macro label="Carboidratos" value={item.carbs} max={110} color="var(--power-accent)" /></div></article>)}</div><label className={`customer-name-field ${checkoutError ? "invalid" : ""}`}><span>Nome para o pedido</span><input value={customerName} maxLength={80} onChange={(event) => { setCustomerName(event.target.value); clearCheckoutError(); }} onKeyDown={(event) => { if (event.key === "Enter") checkout(); }} placeholder="Digite seu nome" autoComplete="name" />{checkoutError && <small>{checkoutError}</small>}</label><div className="cart-total"><span>Total</span><strong>{money(totals.price)}</strong></div><button className="checkout-button" onClick={checkout}>Finalizar pedido <ChevronRight size={18} /></button><small className="cart-disclaimer">Taxa de entrega calculada na próxima etapa</small></>}</aside>;
}

function AddonPicker({ product, groups, onClose, onAdd }: { product: Product; groups: AddonGroup[]; onClose: () => void; onAdd: (ids: number[]) => void }) {
  const [selected, setSelected] = useState<Record<number, number[]>>({});
  const [error, setError] = useState("");
  const selectedOptions = groups.flatMap((group) => group.options.filter((option) => (selected[group.id] ?? []).includes(option.id)));
  const total = product.price + selectedOptions.reduce((sum, option) => sum + option.price, 0);

  function toggle(group: AddonGroup, optionId: number) {
    setError("");
    setSelected((current) => {
      const values = current[group.id] ?? [];
      if (values.includes(optionId)) return { ...current, [group.id]: values.filter((id) => id !== optionId) };
      if (group.maxSelections === 1) return { ...current, [group.id]: [optionId] };
      if (values.length >= group.maxSelections) return current;
      return { ...current, [group.id]: [...values, optionId] };
    });
  }

  function confirm() {
    const missing = groups.find((group) => group.required && !(selected[group.id]?.length));
    if (missing) { setError(`Escolha uma opção em “${missing.name}”.`); return; }
    onAdd(Object.values(selected).flat());
  }

  return <div className="modal-backdrop addon-picker-backdrop"><section className="addon-picker" role="dialog" aria-modal="true" aria-label={`Complementos para ${product.name}`}><header><div><span>PERSONALIZE SEU PEDIDO</span><h2>Quer algum complemento?</h2><p>{product.name} · Escolha abaixo ou continue sem adicionais.</p></div><button onClick={onClose} aria-label="Fechar"><X size={19} /></button></header><div className="addon-picker-groups">{groups.map((group) => <section key={group.id}><div><h3>{group.name}</h3><small>{group.required ? "Obrigatório" : "Opcional"} · escolha até {group.maxSelections}</small></div>{group.options.map((option) => { const checked = (selected[group.id] ?? []).includes(option.id); return <button type="button" className={checked ? "selected" : ""} key={option.id} onClick={() => toggle(group, option.id)}><i>{checked && <Check size={13} />}</i><span>{option.name}</span><strong>{option.price ? `+ ${money(option.price)}` : "Grátis"}</strong></button>; })}</section>)}</div>{error && <p className="addon-picker-error">{error}</p>}<footer><div><span>Total do item</span><strong>{money(total)}</strong></div><button onClick={confirm}><Plus size={17} /> Adicionar ao pedido</button></footer></section></div>;
}

function Macro({ label, value, max, color }: { label: string; value: number; max: number; color: string }) { return <div className="macro-bar"><div><span>{label}</span><b>{value}g</b></div><i><span style={{ width: `${Math.min(100, value / max * 100)}%`, background: color }} /></i></div>; }
