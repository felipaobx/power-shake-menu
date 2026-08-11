"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, ChevronRight, Clock3, Flame, MapPin, Minus, Plus, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { Brand } from "./components";
import type { Product } from "./data";
import { money, useStore } from "./store";

export default function MenuPage() {
  const { products, categories: categoryNames, theme, settings, createOrder } = useStore();
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [success, setSuccess] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const categories = ["Todos", ...categoryNames];
  const visible = products.filter((item) => item.available && (category === "Todos" || item.category === category) && item.name.toLowerCase().includes(query.toLowerCase()));
  const cartItems = products.filter((item) => cart[item.id]).map((item) => ({ ...item, quantity: cart[item.id] }));
  const totals = useMemo(() => cartItems.reduce((acc, item) => ({ price: acc.price + item.price * item.quantity, calories: acc.calories + item.calories * item.quantity, carbs: acc.carbs + item.carbs * item.quantity, protein: acc.protein + item.protein * item.quantity }), { price: 0, calories: 0, carbs: 0, protein: 0 }), [cartItems]);
  const quantity = Object.values(cart).reduce((sum, item) => sum + item, 0);

  function change(id: number, amount: number) {
    setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) + amount) }));
  }

  function checkout() {
    if (!cartItems.length) return;
    const name = customerName.trim();
    if (!name) { setCheckoutError("Informe o nome para identificar o pedido."); setCartOpen(true); return; }
    const id = createOrder({ customer: name, items: cartItems.map((item) => ({ name: item.name, quantity: item.quantity })), total: totals.price, type: "Retirada" });
    setSuccess(id); setCart({}); setCustomerName(""); setCheckoutError(""); setCartOpen(false);
  }

  return <main className="menu-page" style={{ "--primary": theme.primary, "--accent": theme.accent, "--power-accent": theme.accent, "--power-bg": theme.background, "--power-card": theme.surface, "--power-text": theme.textColor, "--power-radius": `${theme.cornerRadius}px`, "--hero-image": `url(${theme.heroImage})` } as React.CSSProperties}>
    <header className="menu-header">
      <Brand />
      <div className="header-location"><span><MapPin size={15} /> {settings.address.split("—")[0]}</span><span><Clock3 size={15} /> Aberto agora</span></div>
      <button className="cart-pill" onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span>{quantity}</span><b>{money(totals.price)}</b></button>
    </header>

    <section className="menu-hero">
      <div className="hero-copy">
        <span className="eyebrow hero-brand-badge">
          {theme.logoImage ? <span className="hero-badge-logo"><Image src={theme.logoImage} alt={`Logo ${theme.restaurantName}`} fill unoptimized sizes="32px" /></span> : <Sparkles size={14} />}
          <span>{theme.restaurantName}</span>
        </span>
        <h1>{theme.heroTitle}<br /><em>{theme.heroHighlight}</em></h1>
        <p>{theme.heroDescription}</p>
        <a href="#cardapio" className="primary-button">VER CARDÁPIO <ArrowRight size={17} /></a>
      </div>
      <div className="hero-image"><div className="hero-photo" /><div className="floating-note"><span>★ 4,9</span><small>+2.4 mil avaliações</small></div><div className="hero-stamp">100%<br /><small>ARTESANAL</small></div></div>
    </section>

    <section className="menu-content" id="cardapio">
      <div className="menu-main">
        <div className="section-heading"><div><span className="eyebrow muted">NOSSO CARDÁPIO</span><h2>ESCOLHA O SEU FAVORITO</h2></div><label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar no cardápio" /></label></div>
        <div className="category-row">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="product-grid">{visible.map((product) => <article className="product-card" key={product.id}>
          <div className="product-image"><Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 600px) 120px, (max-width: 1100px) 50vw, 30vw" style={{ objectPosition: `${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%` }} />{product.badge && <span>{product.badge}</span>}</div>
          <div className="product-body"><div><h3>{product.name}</h3><p>{product.description}</p></div>
            <div className="macro-line"><span><Flame size={13} /> {product.calories} kcal</span><span>{product.protein}g prot.</span><span>{product.carbs}g carb.</span></div>
            <div className="product-bottom"><strong>{money(product.price)}</strong>{cart[product.id] ? <div className="quantity-control"><button onClick={() => change(product.id, -1)}><Minus size={14} /></button><b>{cart[product.id]}</b><button onClick={() => change(product.id, 1)}><Plus size={14} /></button></div> : <button className="add-button" onClick={() => change(product.id, 1)}><Plus size={18} /> Adicionar</button>}</div>
          </div>
        </article>)}</div>
      </div>
      <CartPanel className="desktop-cart" items={cartItems} totals={totals} change={change} checkout={checkout} customerName={customerName} setCustomerName={setCustomerName} checkoutError={checkoutError} clearCheckoutError={() => setCheckoutError("")} />
    </section>

    <footer className="menu-footer"><Brand inverse /><p>{settings.address} · {settings.hours}</p><p>{settings.phone} · {settings.instagram}</p></footer>
    {quantity > 0 && <button className="mobile-cart-bar" onClick={() => setCartOpen(true)}><span><ShoppingBag size={18} /> Ver pedido <b>{quantity}</b></span><strong>{money(totals.price)}</strong></button>}
    {cartOpen && <div className="drawer-backdrop" role="button" tabIndex={0} aria-label="Fechar pedido" onClick={(event) => { if (event.currentTarget === event.target) setCartOpen(false); }} onKeyDown={(event) => { if (event.key === "Escape" || event.key === "Enter" || event.key === " ") setCartOpen(false); }}><div className="cart-drawer"><button className="close-button" onClick={() => setCartOpen(false)}><X /></button><CartPanel items={cartItems} totals={totals} change={change} checkout={checkout} customerName={customerName} setCustomerName={setCustomerName} checkoutError={checkoutError} clearCheckoutError={() => setCheckoutError("")} /></div></div>}
    {success && <div className="success-toast"><span><Check size={18} /></span><div><b>Pedido #{success} enviado!</b><small>A cozinha já recebeu seu pedido.</small></div><button onClick={() => setSuccess(null)}><X size={16} /></button></div>}
  </main>;
}

function CartPanel({ items, totals, change, checkout, customerName, setCustomerName, checkoutError, clearCheckoutError, className = "" }: { items: Array<Product & { quantity: number }>; totals: { price: number; calories: number; carbs: number; protein: number }; change: (id: number, amount: number) => void; checkout: () => void; customerName: string; setCustomerName: (name: string) => void; checkoutError: string; clearCheckoutError: () => void; className?: string }) {
  const { theme } = useStore();
  return <aside className={`cart-panel ${className}`}><div className="cart-title"><div><span className="eyebrow muted">{theme.restaurantName}</span><h3>RESUMO DO PEDIDO</h3></div><ShoppingBag size={22} /></div>
    {!items.length ? <div className="empty-cart"><ShoppingBag size={30} /><b>Nenhum item selecionado</b><p>Comece escolhendo seu burger e os acompanhamentos.</p></div> : <>
      <div className="nutrition-item-list">{items.map((item) => <article className="nutrition-card nutrition-product-summary" key={item.id}><div className="nutrition-product-item"><Image src={item.image} alt="" width={52} height={52} unoptimized style={{ objectPosition: `${item.imagePositionX ?? 50}% ${item.imagePositionY ?? 50}%` }} /><div><b>{item.name}</b><small>{money(item.price)} por unidade</small></div><div className="mini-quantity"><button onClick={() => change(item.id, -1)}><Minus size={12} /></button><span>{item.quantity}</span><button onClick={() => change(item.id, 1)}><Plus size={12} /></button></div></div><div className="nutrition-head"><span>Valores nutricionais por unidade</span><Flame size={16} /></div><div className="nutrition-total"><strong>{item.calories}</strong><span>kcal</span></div><div className="macro-bars"><Macro label="Proteínas" value={item.protein} max={80} color="#f1c86a" /><Macro label="Carboidratos" value={item.carbs} max={110} color="var(--power-accent)" /></div></article>)}</div>
      <label className={`customer-name-field ${checkoutError ? "invalid" : ""}`}><span>Nome para o pedido</span><input value={customerName} maxLength={80} onChange={(event) => { setCustomerName(event.target.value); clearCheckoutError(); }} onKeyDown={(event) => { if (event.key === "Enter") checkout(); }} placeholder="Digite seu nome" autoComplete="name" />{checkoutError && <small>{checkoutError}</small>}</label><div className="cart-total"><span>Total</span><strong>{money(totals.price)}</strong></div><button className="checkout-button" onClick={checkout}>Finalizar pedido <ChevronRight size={18} /></button><small className="cart-disclaimer">Taxa de entrega calculada na próxima etapa</small>
    </>}
  </aside>;
}

function Macro({ label, value, max, color }: { label: string; value: number; max: number; color: string }) { return <div className="macro-bar"><div><span>{label}</span><b>{value}g</b></div><i><span style={{ width: `${Math.min(100, value / max * 100)}%`, background: color }} /></i></div>; }
