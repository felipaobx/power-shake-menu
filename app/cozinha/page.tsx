"use client";

import { useState } from "react";
import { Check, ChefHat, ChevronRight, Clock3, Flame, PackageCheck, RefreshCw, Timer, Volume2 } from "lucide-react";
import { Brand } from "../components";
import { LogoutButton } from "../account-controls";
import type { Order, OrderStatus } from "../data";
import { money, useStore } from "../store";

export default function KitchenPage() {
  const { orders, setOrderStatus, theme } = useStore();
  const [showDone, setShowDone] = useState(false);
  const active = orders.filter((order) => order.status !== "done");
  const done = orders.filter((order) => order.status === "done");
  return <main className="kitchen-page" style={{ "--primary": theme.primary, "--accent": theme.accent, "--app-bg": theme.background, "--app-surface": theme.surface, "--app-text": theme.textColor, "--app-radius": `${theme.cornerRadius}px` } as React.CSSProperties}>
    <header className="kitchen-header"><Brand inverse /><div className="kitchen-title"><span><i /> COZINHA ONLINE</span><b>Turno da noite</b></div><div className="kitchen-clock"><Clock3 size={17} /><strong>{new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</strong><small>09 AGO 2026</small></div><div className="kitchen-tools"><button><Volume2 size={18} /></button><button><RefreshCw size={18} /></button><LogoutButton /></div></header>
    <div className="kitchen-subnav"><div><button className={!showDone ? "active" : ""} onClick={() => setShowDone(false)}>Pedidos ativos <span>{active.length}</span></button><button className={showDone ? "active" : ""} onClick={() => setShowDone(true)}>Finalizados <span>{done.length}</span></button></div><p><i /> Sincronizado em tempo real</p></div>
    {!showDone ? <section className="kanban"><KitchenColumn title="Novos pedidos" color="#ffb44c" icon={<Flame />} orders={orders.filter((order) => order.status === "new")} setStatus={setOrderStatus} /><KitchenColumn title="Em preparo" color="#67b5ff" icon={<ChefHat />} orders={orders.filter((order) => order.status === "preparing")} setStatus={setOrderStatus} /><KitchenColumn title="Prontos" color="#64d894" icon={<PackageCheck />} orders={orders.filter((order) => order.status === "ready")} setStatus={setOrderStatus} /></section> : <section className="finished-orders"><div className="finished-head"><div><h2>Pedidos finalizados</h2><p>Histórico dos pedidos concluídos neste turno.</p></div><span>{done.length} finalizados</span></div>{done.length ? <div className="finished-grid">{done.map((order) => <OrderCard key={order.id} order={order} setStatus={setOrderStatus} done />)}</div> : <div className="finished-empty"><Check size={30} /><h3>Nenhum pedido finalizado</h3><p>Os pedidos concluídos aparecerão aqui.</p></div>}</section>}
  </main>;
}

function KitchenColumn({ title, color, icon, orders, setStatus }: { title: string; color: string; icon: React.ReactNode; orders: Order[]; setStatus: (id: number, status: OrderStatus) => void }) { return <div className="kanban-column"><div className="column-head" style={{ "--column": color } as React.CSSProperties}><span>{icon}</span><h2>{title}</h2><b>{orders.length}</b></div><div className="column-orders">{orders.map((order) => <OrderCard key={order.id} order={order} setStatus={setStatus} />)}{!orders.length && <div className="empty-column"><Check size={24} /><p>Nenhum pedido por aqui</p></div>}</div></div>; }

function OrderCard({ order, setStatus, done }: { order: Order; setStatus: (id: number, status: OrderStatus) => void; done?: boolean }) {
  const next = order.status === "new" ? "preparing" : order.status === "preparing" ? "ready" : "done";
  const label = order.status === "new" ? "Iniciar preparo" : order.status === "preparing" ? "Marcar como pronto" : "Finalizar pedido";
  return <article className={`kitchen-card status-${order.status}`}><div className="kitchen-card-head"><div><span>#{order.id}</span><b>{order.type}</b></div><time><Timer size={14} /> há {order.status === "new" ? "3" : order.status === "preparing" ? "9" : "16"} min</time></div><div className="customer-row"><span>{order.customer.slice(0, 1).toUpperCase()}</span><div><small>Cliente</small><b>{order.customer}</b><em>{order.createdAt} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} itens</em></div><div className="order-total"><small>Total</small><strong>{money(order.total)}</strong></div></div><div className="kitchen-items"><header><span>Itens do pedido</span><b>{order.items.length}</b></header>{order.items.map((item, index) => <div key={index}><strong>{item.quantity}×</strong><span>{item.name}</span></div>)}</div>{!done ? <button className="advance-button" onClick={() => setStatus(order.id, next)}>{label} {order.status === "ready" ? <Check size={17} /> : <ChevronRight size={17} />}</button> : <button className="restore-button" onClick={() => setStatus(order.id, "ready")}><RefreshCw size={14} /> Reabrir pedido</button>}</article>;
}
