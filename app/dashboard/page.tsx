"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Download, ExternalLink, Eye, FileText, Image as ImageIcon, LayoutDashboard, MapPin, Menu as MenuIcon, MoreHorizontal, Package, Palette, Pencil, Plus, Search, Settings, ShoppingBag, Trash2, TrendingUp, Upload, Users, X } from "lucide-react";
import { Brand } from "../components";
import { AccountChip } from "../account-controls";
import type { Product } from "../data";
import { money, useStore } from "../store";
import { uploadImage } from "../upload-image";

type Tab = "overview" | "menu" | "customize" | "settings" | "users" | "pdf";

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [adding, setAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { theme } = useStore();
  const restaurantInitials = theme.restaurantName.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "R";
  return <main className="dashboard-shell" style={{ "--primary": theme.primary, "--accent": theme.accent, "--app-bg": theme.background, "--app-surface": theme.surface, "--app-text": theme.textColor, "--app-radius": `${theme.cornerRadius}px` } as React.CSSProperties}>
    <aside className="dashboard-sidebar"><Brand inverse /><div className="workspace-chip"><span>{restaurantInitials}</span><div><small>ESTABELECIMENTO</small><b>{theme.restaurantName}</b></div><ChevronDown size={15} /></div><span className="sidebar-section-label">GESTÃO</span>
      <nav className="dashboard-nav">
        <NavButton active={tab === "overview"} icon={<LayoutDashboard />} label="Visão geral" onClick={() => setTab("overview")} />
        <NavButton active={tab === "menu"} icon={<MenuIcon />} label="Cardápio" onClick={() => setTab("menu")} />
        <NavButton active={tab === "customize"} icon={<Palette />} label="Personalizar" onClick={() => setTab("customize")} />
        <NavButton active={tab === "settings"} icon={<Settings />} label="Configurações" onClick={() => setTab("settings")} />
        <NavButton active={tab === "users"} icon={<Users />} label="Usuários" onClick={() => setTab("users")} />
        <NavButton active={tab === "pdf"} icon={<FileText />} label="Exportar PDF" onClick={() => setTab("pdf")} />
      </nav>
      <div className="sidebar-bottom"><span className="sidebar-section-label">ACESSOS RÁPIDOS</span><Link href="/" target="_blank"><i><Eye size={17} /></i><span>Ver meu cardápio</span><ExternalLink size={13} /></Link><Link href="/cozinha"><i><Package size={17} /></i><span>Abrir cozinha</span><ChevronRight size={13} /></Link><button><i><CircleHelp size={17} /></i><span>Central de ajuda</span><ChevronRight size={13} /></button><AccountChip /></div>
    </aside>
    <section className="dashboard-area"><header className="dashboard-topbar"><div className="mobile-brand"><Brand /></div><label className="global-search"><Search size={17} /><input placeholder="Buscar pedido, produto..." /><kbd>⌘ K</kbd></label><div><button className="icon-button"><Bell size={19} /><i /></button><Link className="visit-button" href="/">Ver cardápio <ExternalLink size={15} /></Link></div></header>
      {tab === "overview" && <Overview />}
      {tab === "menu" && <MenuManagement onAdd={() => setAdding(true)} onEdit={setEditingProduct} />}
      {tab === "customize" && <Customize />}
      {tab === "settings" && <SettingsPage />}
      {tab === "users" && <UsersManagement />}
      {tab === "pdf" && <PdfPage />}
    </section>
    {(adding || editingProduct) && <ProductModal product={editingProduct ?? undefined} onClose={() => { setAdding(false); setEditingProduct(null); }} />}
  </main>;
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) { return <button className={active ? "active" : ""} onClick={onClick}>{icon}<span>{label}</span>{active && <i />}</button>; }

function Overview() {
  const { orders } = useStore();
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  return <div className="dashboard-content"><PageTitle eyebrow="DOMINGO, 9 DE AGOSTO" title="Boa noite, Felipe!" text="Aqui está o resumo do seu negócio hoje." action={<><button className="outline-button"><Download size={16} /> Relatório</button><Link className="solid-button" href="/cozinha"><Package size={16} /> Ver cozinha</Link></>} />
    <div className="stats-grid"><StatCard icon={<ShoppingBag />} label="Pedidos hoje" value={String(orders.length + 37)} delta="12,5%" note="vs. ontem" /><StatCard icon={<TrendingUp />} label="Faturamento" value={money(revenue + 1784)} delta="8,2%" note="vs. ontem" /><StatCard icon={<Users />} label="Ticket médio" value={money((revenue + 1784) / (orders.length + 37))} delta="3,1%" note="vs. ontem" /><StatCard icon={<Clock3 />} label="Tempo médio" value="18 min" delta="-2 min" note="mais rápido" good /></div>
    <div className="overview-grid"><section className="panel revenue-panel"><div className="panel-head"><div><h3>Faturamento</h3><p>Movimentação dos últimos 7 dias</p></div><select><option>Últimos 7 dias</option></select></div><div className="chart-summary"><strong>R$ 12.840,60</strong><span><TrendingUp size={14} /> 18,4%</span></div><div className="bar-chart">{[48,62,43,78,67,91,74].map((height, index) => <div key={index}><i style={{ height: `${height}%` }} className={index === 5 ? "highlight" : ""} />{index === 5 && <b>R$ 2.410</b>}<span>{["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"][index]}</span></div>)}</div></section>
      <section className="panel live-orders"><div className="panel-head"><div><h3>Pedidos em andamento</h3><p>Atualizado agora</p></div><Link href="/cozinha">Ver todos <ExternalLink size={13} /></Link></div><div className="live-list">{orders.filter((item) => item.status !== "done").slice(0, 4).map((order) => <div key={order.id}><span className={`order-status-dot ${order.status}`} /><div><b>Pedido #{order.id}</b><small>{order.customer} · {order.items.length} itens</small></div><strong>{money(order.total)}</strong><em className={order.status}>{statusLabel(order.status)}</em></div>)}</div></section></div>
    <section className="panel top-products"><div className="panel-head"><div><h3>Produtos mais vendidos</h3><p>Ranking de hoje por quantidade</p></div><button>Ver relatório <ExternalLink size={13} /></button></div><ProductRanking /></section>
  </div>;
}

function PageTitle({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: React.ReactNode }) { return <div className="page-title"><div><span>{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{action && <div className="page-actions">{action}</div>}</div>; }
function StatCard({ icon, label, value, delta, note, good }: { icon: React.ReactNode; label: string; value: string; delta: string; note: string; good?: boolean }) { return <article className="stat-card"><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small className={good ? "good" : ""}><b>{delta}</b> {note}</small></article>; }
function statusLabel(status: string) { return status === "new" ? "Novo" : status === "preparing" ? "Preparando" : status === "ready" ? "Pronto" : "Finalizado"; }
function ProductRanking() { const { products } = useStore(); return <div className="ranking-list">{products.slice(0, 4).map((product, index) => <div key={product.id}><span>{index + 1}</span><Image src={product.image} alt="" width={40} height={32} /><div><b>{product.name}</b><small>{product.category}</small></div><div className="rank-bar"><i style={{ width: `${92 - index * 14}%` }} /></div><strong>{84 - index * 11} vendas</strong><b>{money(product.price * (84 - index * 11))}</b></div>)}</div>; }

type ManagedUser = { id: number; username: string; role: "admin" | "kitchen"; active: boolean; createdAt?: string };

function UsersManagement() {
  const [usersList, setUsersList] = useState<ManagedUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [configured, setConfigured] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "kitchen">("kitchen");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadUsers() {
    const [usersResponse, sessionResponse] = await Promise.all([fetch("/api/users"), fetch("/api/auth/session")]);
    const data = await usersResponse.json();
    const session = sessionResponse.ok ? await sessionResponse.json() : null;
    if (usersResponse.ok) { setUsersList(data.users); setConfigured(data.configured); }
    setCurrentUserId(session?.user?.id ?? null);
  }

  useEffect(() => {
    let cancelled = false;
    void Promise.all([fetch("/api/users"), fetch("/api/auth/session")]).then(async ([usersResponse, sessionResponse]) => {
      const data = await usersResponse.json();
      const session = sessionResponse.ok ? await sessionResponse.json() : null;
      if (cancelled) return;
      if (usersResponse.ok) { setUsersList(data.users); setConfigured(data.configured); }
      setCurrentUserId(session?.user?.id ?? null);
    }).catch(() => { if (!cancelled) setMessage({ type: "error", text: "Não foi possível carregar os usuários." }); });
    return () => { cancelled = true; };
  }, []);

  async function addUser(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true); setMessage(null);
    const response = await fetch("/api/users", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username, password, role }) });
    const data = await response.json();
    if (!response.ok) { setMessage({ type: "error", text: data.error || "Não foi possível adicionar o usuário." }); setSaving(false); return; }
    setUsername(""); setPassword(""); setRole("kitchen"); setMessage({ type: "success", text: `Usuário ${data.user.username} adicionado.` }); setSaving(false);
    await loadUsers();
  }

  async function removeUser(user: ManagedUser) {
    if (!window.confirm(`Excluir o usuário ${user.username}?`)) return;
    setMessage(null);
    const response = await fetch(`/api/users?id=${user.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) { setMessage({ type: "error", text: data.error || "Não foi possível excluir o usuário." }); return; }
    setMessage({ type: "success", text: `Usuário ${user.username} excluído.` });
    await loadUsers();
  }

  return <div className="dashboard-content"><PageTitle eyebrow="CONTROLE DE ACESSO" title="Usuários" text="Defina quem pode acessar o dashboard e a operação da cozinha." />{!configured && <div className="users-notice">O administrador inicial está disponível. Conecte o banco de dados para cadastrar novos usuários.</div>}<div className="users-layout"><section className="panel users-list-panel"><div className="panel-head"><div><h3>Usuários cadastrados</h3><p>{usersList.length} {usersList.length === 1 ? "acesso ativo" : "acessos ativos"}</p></div></div><div className="users-table">{usersList.map((user) => <article key={user.id}><span className={`user-avatar role-${user.role}`}>{user.username.slice(0, 2).toUpperCase()}</span><div><b>{user.username}</b><small>{user.role === "admin" ? "Administrador · Dashboard e Cozinha" : "Cozinha · Somente Cozinha"}</small></div><em className={`role-badge role-${user.role}`}>{user.role === "admin" ? "Administrador" : "Cozinha"}</em><button disabled={user.id === currentUserId} aria-label={`Excluir ${user.username}`} title={user.id === currentUserId ? "Você não pode excluir seu próprio acesso" : "Excluir usuário"} onClick={() => void removeUser(user)}><Trash2 size={16} /></button></article>)}</div></section><section className="panel add-user-panel"><h3>Adicionar usuário</h3><p>Crie um login e escolha as áreas permitidas.</p><form onSubmit={addUser}><Field label="Usuário"><input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Ex.: maria.cozinha" autoComplete="off" required /></Field><Field label="Senha"><input type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo de 6 caracteres" autoComplete="new-password" required /></Field><Field label="Perfil de acesso"><select value={role} onChange={(event) => setRole(event.target.value as "admin" | "kitchen")}><option value="kitchen">Cozinha — somente Cozinha</option><option value="admin">Administrador — Dashboard e Cozinha</option></select></Field>{message && <p className={`user-form-message ${message.type}`} role="status">{message.text}</p>}<button className="solid-button" disabled={saving || !configured}><Plus size={16} /> {saving ? "Adicionando..." : "Adicionar usuário"}</button></form></section></div></div>;
}

function MenuManagement({ onAdd, onEdit }: { onAdd: () => void; onEdit: (product: Product) => void }) {
  const { products, categories, toggleProduct } = useStore();
  const [filter, setFilter] = useState("Todos");
  const shown = filter === "Todos" ? products : products.filter((item) => item.category === filter);
  return <div className="dashboard-content"><PageTitle eyebrow="GESTÃO DE PRODUTOS" title="Seu cardápio" text={`${products.filter((item) => item.available).length} itens disponíveis no cardápio digital.`} action={<button className="solid-button" onClick={onAdd}><Plus size={17} /> Adicionar item</button>} />
    <CategoryManager activeFilter={filter} onRenameFilter={setFilter} />
    <AddonManager />
    <div className="menu-toolbar"><div className="category-row compact">{["Todos", ...categories].map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><label className="search-box"><Search size={16} /><input placeholder="Buscar item" /></label></div>
    <div className="admin-product-grid">{shown.map((product) => <article className={`admin-product-card ${!product.available ? "disabled" : ""}`} key={product.id}><Image src={product.image} alt={product.name} width={520} height={310} unoptimized style={{ objectPosition: `${product.imagePositionX ?? 50}% ${product.imagePositionY ?? 50}%` }} /><div className="admin-product-body"><div className="admin-product-title"><div><small>{product.category}</small><h3>{product.name}</h3></div><button aria-label={`Opções de ${product.name}`}><MoreHorizontal /></button></div><p>{product.description}</p><div className="admin-macros"><span>{product.calories} kcal</span><span>{product.protein}g proteína</span><span>{product.carbs}g carbo.</span></div><div className="admin-product-bottom"><strong>{money(product.price)}</strong><label className="switch-label"><span>{product.available ? "Disponível" : "Indisponível"}</span><button className={`toggle ${product.available ? "on" : ""}`} onClick={() => toggleProduct(product.id)}><i /></button></label></div><button className="edit-product" onClick={() => onEdit(product)}><Pencil size={14} /> Editar produto</button></div></article>)}</div>
  </div>;
}

function CategoryManager({ activeFilter, onRenameFilter }: { activeFilter: string; onRenameFilter: (name: string) => void }) {
  const { categories, addCategory, renameCategory, deleteCategory } = useStore();
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [categoryMessage, setCategoryMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function createCategory(event: React.FormEvent) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) { setCategoryMessage({ type: "error", text: "Digite um nome para a categoria." }); return; }
    if (!addCategory(name)) { setCategoryMessage({ type: "error", text: "Já existe uma categoria com esse nome." }); return; }
    setNewName("");
    setCategoryMessage({ type: "success", text: `Categoria “${name}” adicionada.` });
  }

  function saveCategory(currentName: string) {
    const name = editName.trim();
    if (!name) { setCategoryMessage({ type: "error", text: "O nome da categoria não pode ficar vazio." }); return; }
    if (!renameCategory(currentName, name)) { setCategoryMessage({ type: "error", text: "Já existe uma categoria com esse nome." }); return; }
    if (activeFilter === currentName) onRenameFilter(name);
    setEditing(null);
    setCategoryMessage({ type: "success", text: `Categoria alterada para “${name}”.` });
  }

  function removeCategory(name: string) {
    if (!window.confirm(`Excluir a categoria “${name}”? Os produtos dela serão movidos para “${name.toLowerCase() === "outros" ? "Geral" : "Outros"}”.`)) return;
    if (!deleteCategory(name)) { setCategoryMessage({ type: "error", text: "Não foi possível excluir a categoria." }); return; }
    if (activeFilter === name) onRenameFilter("Todos");
    setEditing(null);
    setCategoryMessage({ type: "success", text: `Categoria “${name}” excluída.` });
  }

  return <section className="panel category-manager"><div className="category-manager-head"><div><h3>Categorias</h3><p>Crie, renomeie ou exclua as seções exibidas no cardápio.</p></div><form onSubmit={createCategory}><input aria-label="Nova categoria" value={newName} onChange={(event) => { setNewName(event.target.value); setCategoryMessage(null); }} placeholder="Nova categoria" /><button type="submit" className="solid-button"><Plus size={14} /> Adicionar</button></form></div>{categoryMessage && <p className={`category-message ${categoryMessage.type}`} role="status">{categoryMessage.text}</p>}<div className="category-manager-list">{categories.map((category) => editing === category ? <form className="category-edit" key={category} onSubmit={(event) => { event.preventDefault(); saveCategory(category); }}><input aria-label={`Editar ${category}`} value={editName} onChange={(event) => { setEditName(event.target.value); setCategoryMessage(null); }} onKeyDown={(event) => { if (event.key === "Escape") setEditing(null); }} /><button type="submit" aria-label="Salvar categoria"><Check size={14} /> Salvar</button><button type="button" aria-label="Cancelar edição" onClick={() => setEditing(null)}><X size={14} /> Cancelar</button></form> : <div key={category}><span>{category}</span><button type="button" aria-label={`Editar ${category}`} onClick={() => { setEditing(category); setEditName(category); setCategoryMessage(null); }}><Pencil size={13} /> Editar</button><button type="button" className="delete-category" aria-label={`Excluir ${category}`} onClick={() => removeCategory(category)}><Trash2 size={13} /> Excluir</button></div>)}</div></section>;
}

function AddonManager() {
  const { addonGroups, addAddonGroup } = useStore();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function createGroup(event: React.FormEvent) {
    event.preventDefault();
    if (!addAddonGroup(name)) { setMessage("Digite um nome novo para o grupo de complementos."); return; }
    setName("");
    setMessage("");
  }

  return <section className="panel addon-manager"><div className="addon-manager-head"><div><span>COMPLEMENTOS</span><h3>Grupos de complementos</h3><p>Crie grupos, inclua opções e escolha em quais itens eles aparecem.</p></div><form onSubmit={createGroup}><input aria-label="Nome do grupo de complementos" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Adicionais" /><button className="solid-button"><Plus size={14} /> Criar grupo</button></form></div>{message && <p className="category-message error">{message}</p>}{!addonGroups.length ? <div className="addon-empty"><Plus size={20} /><b>Nenhum grupo criado</b><small>Crie o primeiro grupo para oferecer molhos, extras, tamanhos ou outros complementos.</small></div> : <div className="addon-group-list">{addonGroups.map((group) => <AddonGroupCard key={group.id} groupId={group.id} />)}</div>}</section>;
}

function AddonGroupCard({ groupId }: { groupId: number }) {
  const { addonGroups, products, updateAddonGroup, deleteAddonGroup, addAddonOption, deleteAddonOption, toggleAddonProduct } = useStore();
  const group = addonGroups.find((item) => item.id === groupId);
  const [optionName, setOptionName] = useState("");
  const [optionPrice, setOptionPrice] = useState("");
  const [error, setError] = useState("");
  if (!group) return null;

  function createOption(event: React.FormEvent) {
    event.preventDefault();
    if (!addAddonOption(groupId, optionName, Number(optionPrice || 0))) { setError("Informe uma opção com nome diferente das existentes."); return; }
    setOptionName(""); setOptionPrice(""); setError("");
  }

  return <article className="addon-group-card"><header><input aria-label="Nome do grupo" value={group.name} onChange={(event) => updateAddonGroup(group.id, { name: event.target.value })} /><button type="button" aria-label={`Excluir grupo ${group.name}`} onClick={() => { if (window.confirm(`Excluir o grupo “${group.name}”?`)) deleteAddonGroup(group.id); }}><Trash2 size={15} /></button></header><div className="addon-rules"><label><input type="checkbox" checked={group.required} onChange={(event) => updateAddonGroup(group.id, { required: event.target.checked })} /><span>Escolha obrigatória</span></label><label><span>Máximo de escolhas</span><select value={group.maxSelections} onChange={(event) => updateAddonGroup(group.id, { maxSelections: Number(event.target.value) })}>{[1, 2, 3, 4, 5].map((value) => <option key={value}>{value}</option>)}</select></label></div><div className="addon-card-grid"><div className="addon-options"><b>Opções e preços</b>{group.options.map((option) => <div key={option.id}><span>{option.name}</span><strong>{option.price ? `+ ${money(option.price)}` : "Grátis"}</strong><button type="button" aria-label={`Excluir ${option.name}`} onClick={() => deleteAddonOption(group.id, option.id)}><X size={13} /></button></div>)}<form onSubmit={createOption}><input value={optionName} onChange={(event) => setOptionName(event.target.value)} placeholder="Nome da opção" aria-label="Nome da opção" /><input value={optionPrice} onChange={(event) => setOptionPrice(event.target.value)} placeholder="R$ 0,00" aria-label="Preço da opção" type="number" min="0" step="0.01" /><button aria-label="Adicionar opção"><Plus size={15} /></button></form>{error && <small className="addon-error">{error}</small>}</div><div className="addon-products"><b>Aparecer ao adicionar</b><p>Marque os itens que usarão este grupo.</p><div>{products.map((product) => <label key={product.id}><input type="checkbox" checked={group.productIds.includes(product.id)} onChange={() => toggleAddonProduct(group.id, product.id)} /><span>{product.name}</span></label>)}</div></div></div></article>;
}

function ProductModal({ product, onClose }: { product?: Product; onClose: () => void }) {
  const { addProduct, updateProduct, categories } = useStore();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [form, setForm] = useState({
    name: product?.name ?? "",
    category: product?.category ?? categories[0] ?? "Burgers",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    calories: product ? String(product.calories) : "",
    carbs: product ? String(product.carbs) : "",
    protein: product ? String(product.protein) : "",
    image: product?.image ?? "",
    imagePositionX: product?.imagePositionX ?? 50,
    imagePositionY: product?.imagePositionY ?? 50,
    badge: product?.badge ?? "",
  });
  const previewable = /^(https?:\/\/|data:image\/)/.test(form.image);

  async function chooseImage(file?: File) {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const image = await uploadImage(file);
      setForm((current) => ({ ...current, image }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
    }
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    const value = {
      ...form,
      badge: form.badge || undefined,
      price: Number(form.price),
      calories: Number(form.calories),
      carbs: Number(form.carbs),
      protein: Number(form.protein),
      available: product?.available ?? true,
    };
    if (product) updateProduct(product.id, value); else addProduct(value);
    onClose();
  }

  return <div className="modal-backdrop"><form className="product-modal product-editor" onSubmit={save}><div className="modal-head"><div><span>{product ? "EDITAR PRODUTO" : "NOVO PRODUTO"}</span><h2>{product ? product.name : "Adicionar ao cardápio"}</h2><p>{product ? "Atualize foto, enquadramento, informações, preço e categoria." : "Cadastre um item completo com foto e informações nutricionais."}</p></div><button type="button" aria-label="Fechar" onClick={onClose}><X /></button></div><div className="product-editor-grid"><section className="product-editor-media"><div className="product-image-preview">{previewable ? <Image src={form.image} alt="Prévia do produto" fill sizes="360px" unoptimized style={{ objectPosition: `${form.imagePositionX}% ${form.imagePositionY}%` }} /> : <div><ImageIcon size={34} /><b>Prévia da imagem</b><small>Envie uma foto ou informe um endereço.</small></div>}</div>{previewable && <div className="image-focus-controls"><div><b>Enquadramento da foto</b><button type="button" onClick={() => setForm({ ...form, imagePositionX: 50, imagePositionY: 50 })}>Centralizar</button></div><label><span>Horizontal <small>{form.imagePositionX}%</small></span><input aria-label="Posição horizontal da imagem" type="range" min="0" max="100" value={form.imagePositionX} onChange={(event) => setForm({ ...form, imagePositionX: Number(event.target.value) })} /></label><label><span>Vertical <small>{form.imagePositionY}%</small></span><input aria-label="Posição vertical da imagem" type="range" min="0" max="100" value={form.imagePositionY} onChange={(event) => setForm({ ...form, imagePositionY: Number(event.target.value) })} /></label><small>Mova os controles até destacar a parte mais importante da foto.</small></div>}<label className="product-upload-button"><input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void chooseImage(file); }} /><Upload size={17} /> {uploading ? "Enviando..." : "Escolher imagem"}</label><small>Foto de até 20 MB · otimizada automaticamente</small>{uploadError && <p className="upload-error">{uploadError}</p>}<Field label="Ou use o endereço da imagem"><input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://..." /></Field></section><section className="product-editor-fields"><div className="two-fields"><Field label="Nome do item"><input required placeholder="Ex.: Smash Especial" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field><Field label="Categoria"><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></Field></div><Field label="Descrição"><textarea required placeholder="Ingredientes e detalhes do produto" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field><div className="two-fields"><Field label="Preço (R$)"><input required type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></Field><Field label="Selo de destaque"><input placeholder="Ex.: Mais pedido" value={form.badge} onChange={(event) => setForm({ ...form, badge: event.target.value })} /></Field></div><div className="four-fields nutrition-fields"><Field label="Calorias"><input required type="number" min="0" value={form.calories} onChange={(event) => setForm({ ...form, calories: event.target.value })} /></Field><Field label="Carboidratos"><input required type="number" min="0" value={form.carbs} onChange={(event) => setForm({ ...form, carbs: event.target.value })} /></Field><Field label="Proteínas"><input required type="number" min="0" value={form.protein} onChange={(event) => setForm({ ...form, protein: event.target.value })} /></Field></div></section></div><div className="modal-actions"><button type="button" className="outline-button" onClick={onClose}>Cancelar</button><button className="solid-button" disabled={uploading}><Check size={16} /> {product ? "Salvar alterações" : "Criar produto"}</button></div></form></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="form-field"><span>{label}</span>{children}</label>; }

function Customize() {
  const { theme, updateTheme } = useStore();
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState("");
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerError, setBannerError] = useState("");

  async function chooseLogo(file?: File) {
    if (!file) return;
    setLogoUploading(true);
    setLogoError("");
    try {
      const logoImage = await uploadImage(file);
      updateTheme({ logoImage });
    } catch (error) {
      setLogoError(error instanceof Error ? error.message : "Não foi possível enviar a logomarca.");
    } finally {
      setLogoUploading(false);
    }
  }

  async function chooseBanner(file?: File) {
    if (!file) return;
    setBannerUploading(true);
    setBannerError("");
    try {
      const heroImage = await uploadImage(file);
      updateTheme({ heroImage });
    } catch (error) {
      setBannerError(error instanceof Error ? error.message : "Não foi possível enviar a imagem do banner.");
    } finally {
      setBannerUploading(false);
    }
  }

  return <div className="dashboard-content"><PageTitle eyebrow="IDENTIDADE VISUAL" title="Personalizar experiência" text="Deixe o cardápio com a cara da sua marca. As alterações aparecem instantaneamente." action={<Link className="outline-button" href="/" target="_blank"><Eye size={16} /> Ver cardápio</Link>} />
    <section className="panel settings-panel banner-text-settings"><h3>Textos do banner</h3><p>Edite a chamada principal que aparece sobre a imagem do cardápio.</p><div className="two-fields"><Field label="Título principal"><input value={theme.heroTitle} onChange={(event) => updateTheme({ heroTitle: event.target.value })} placeholder="MONTE O PEDIDO" /></Field><Field label="Destaque colorido"><input value={theme.heroHighlight} onChange={(event) => updateTheme({ heroHighlight: event.target.value })} placeholder="PERFEITO." /></Field></div><Field label="Texto de apoio"><textarea value={theme.heroDescription} onChange={(event) => updateTheme({ heroDescription: event.target.value })} placeholder="Descreva a experiência para seus clientes" /></Field></section>
    <div className="customize-grid"><section className="panel settings-panel"><h3>Marca e textos</h3><p>Informações e aparência aplicadas ao cardápio, dashboard e cozinha.</p><Field label="Nome do estabelecimento"><input value={theme.restaurantName} onChange={(e) => updateTheme({ restaurantName: e.target.value })} /></Field><Field label="Frase principal"><textarea value={theme.slogan} onChange={(e) => updateTheme({ slogan: e.target.value })} /></Field><div className="logo-upload"><div className="brand-preview">{theme.logoImage ? <Image src={theme.logoImage} alt="Logomarca" fill sizes="72px" unoptimized /> : theme.restaurantName.slice(0, 2).toUpperCase()}</div><div><b>Logo do negócio</b><small>Foto de até 20 MB · otimizada automaticamente</small><label className="logo-upload-button"><input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void chooseLogo(file); }} /><Upload size={14} /> {logoUploading ? "Enviando..." : "Alterar logo"}</label></div></div>{logoError && <p className="upload-error">{logoError}</p>}<div className="banner-upload"><div className="banner-upload-preview" style={{ backgroundImage: `linear-gradient(90deg,#000b,#0002),url(${theme.heroImage})` }}><span>Imagem do banner</span></div><div><label className="logo-upload-button"><input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void chooseBanner(file); }} /><Upload size={14} /> {bannerUploading ? "Enviando..." : "Trocar banner"}</label><small>Recomendado: imagem horizontal com pelo menos 1600 × 700 px.</small></div><Field label="Ou use um endereço"><input value={theme.heroImage} onChange={(e) => updateTheme({ heroImage: e.target.value })} placeholder="https://..." /></Field></div>{bannerError && <p className="upload-error">{bannerError}</p>}<h3 className="subsection-title">Cores do sistema</h3><div className="color-fields"><label><input aria-label="Fundo principal" type="color" value={theme.background} onChange={(e) => updateTheme({ background: e.target.value, primary: e.target.value })} /><span><b>Fundo principal</b><small>{theme.background}</small></span></label><label><input aria-label="Cor dos painéis" type="color" value={theme.surface} onChange={(e) => updateTheme({ surface: e.target.value })} /><span><b>Cor dos painéis</b><small>{theme.surface}</small></span></label><label><input aria-label="Cor de destaque" type="color" value={theme.accent} onChange={(e) => updateTheme({ accent: e.target.value })} /><span><b>Neon / destaque</b><small>{theme.accent}</small></span></label><label><input aria-label="Cor dos textos" type="color" value={theme.textColor} onChange={(e) => updateTheme({ textColor: e.target.value })} /><span><b>Textos principais</b><small>{theme.textColor}</small></span></label></div><Field label="Arredondamento dos cards"><input type="range" min="4" max="30" value={theme.cornerRadius} onChange={(e) => updateTheme({ cornerRadius: Number(e.target.value) })} /><small>{theme.cornerRadius}px</small></Field></section>
      <section className="phone-preview-wrap"><span>PRÉ-VISUALIZAÇÃO</span><div className="phone-preview" style={{ background: theme.background, borderColor: theme.surface, borderRadius: `${theme.cornerRadius + 16}px`, color: theme.textColor }}><div className="phone-top"><i style={{ background: theme.surface }} /><small>9:41</small><b>•••</b></div><div className="preview-hero" style={{ background: `linear-gradient(#0007,#000b), url(${theme.heroImage}) center/cover` }}><strong>{theme.restaurantName}</strong><span style={{ color: theme.accent }}>ABERTO AGORA</span><h3>{theme.heroTitle}<br /><em style={{ color: theme.accent }}>{theme.heroHighlight}</em></h3><p>{theme.heroDescription}</p></div><div className="preview-body"><div className="preview-chips"><i style={{ background: theme.accent }} /><i style={{ background: theme.surface }} /><i style={{ background: theme.surface }} /></div><b>Os favoritos da casa</b><div className="preview-product" style={{ background: theme.surface, borderColor: theme.surface, borderRadius: `${theme.cornerRadius / 2}px` }}><Image src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80" alt="" width={64} height={56} unoptimized /><div><strong>Smash Trufado</strong><small>Blend, queijo e molho...</small><b>R$ 34,90</b></div><button style={{ background: theme.accent }}>+</button></div></div></div></section></div>
  </div>;
}

function SettingsPage() {
  const { settings, updateSettings } = useStore();
  return <div className="dashboard-content"><PageTitle eyebrow="ESTABELECIMENTO" title="Configurações" text="Mantenha as informações da sua loja sempre atualizadas." />
    <div className="settings-columns"><section className="panel settings-panel"><div className="settings-section-head"><span><MapPin /></span><div><h3>Localização e contato</h3><p>Exibidos no rodapé e na finalização do pedido.</p></div></div><Field label="Endereço completo"><input value={settings.address} onChange={(e) => updateSettings({ address: e.target.value })} /></Field><div className="two-fields"><Field label="Telefone / WhatsApp"><input value={settings.phone} onChange={(e) => updateSettings({ phone: e.target.value })} /></Field><Field label="Instagram"><input value={settings.instagram} onChange={(e) => updateSettings({ instagram: e.target.value })} /></Field></div></section><section className="panel settings-panel"><div className="settings-section-head"><span><Clock3 /></span><div><h3>Funcionamento e entrega</h3><p>Horários e condições gerais da loja.</p></div></div><Field label="Horário de funcionamento"><input value={settings.hours} onChange={(e) => updateSettings({ hours: e.target.value })} /></Field><Field label="Taxa padrão de entrega"><input value={settings.deliveryFee} onChange={(e) => updateSettings({ deliveryFee: e.target.value })} /></Field><div className="open-store"><div><b>Loja aberta</b><small>Clientes podem enviar novos pedidos</small></div><button aria-label="Alterar status da loja" className="toggle on"><i /></button></div></section></div>
  </div>;
}

function PdfPage() {
  const { products, theme, settings } = useStore();
  const pdfRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [title, setTitle] = useState("Cardápio artesanal");
  const [intro, setIntro] = useState(theme.slogan);
  const [showPhotos, setShowPhotos] = useState(true);
  const [showNutrition, setShowNutrition] = useState(true);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const available = products.filter((item) => item.available);
  const categories = Array.from(new Set(available.map((item) => item.category)));

  async function downloadPdf() {
    if (!pdfRef.current || pdfDownloading) return;
    setPdfDownloading(true);
    setPdfError("");
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
      const pageWidth = orientation === "landscape" ? 297 : 210;
      const pageHeight = orientation === "landscape" ? 210 : 297;
      const sheet = pdfRef.current;
      const originalMinHeight = sheet.style.minHeight;
      const pagePixelHeight = sheet.offsetWidth * pageHeight / pageWidth;
      const exportPageCount = Math.max(1, Math.ceil((sheet.scrollHeight - 2) / pagePixelHeight));
      sheet.style.minHeight = `${Math.ceil(exportPageCount * pagePixelHeight)}px`;
      const canvas = await (async () => {
        try {
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          return await html2canvas(sheet, { scale: 4, useCORS: true, backgroundColor: mode === "dark" ? "#0c0f13" : "#f7f7f2", logging: false });
        } finally {
          sheet.style.minHeight = originalMinHeight;
        }
      })();
      const pdf = new jsPDF({ orientation, unit: "mm", format: "a4", compress: true });
      const imageHeight = canvas.height * pageWidth / canvas.width;
      const image = canvas.toDataURL("image/png");
      const pageBackground = mode === "dark" ? "#0c0f13" : "#f7f7f2";
      const paintPageBackground = () => {
        pdf.setFillColor(pageBackground);
        pdf.rect(0, 0, pageWidth, pageHeight, "F");
      };
      let position = 0;
      paintPageBackground();
      pdf.addImage(image, "PNG", 0, position, pageWidth, imageHeight, undefined, "FAST");
      for (let pageIndex = 1; pageIndex < exportPageCount; pageIndex += 1) {
        position = -pageIndex * pageHeight;
        pdf.addPage();
        paintPageBackground();
        pdf.addImage(image, "PNG", 0, position, pageWidth, imageHeight, undefined, "FAST");
      }
      const filename = theme.restaurantName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "cardapio";
      pdf.save(`${filename}-cardapio.pdf`);
    } catch {
      setPdfError("Não foi possível gerar o PDF. Verifique se todas as imagens estão carregadas e tente novamente.");
    } finally {
      setPdfDownloading(false);
    }
  }

  return <div className="dashboard-content"><PageTitle eyebrow="MENU IMPRESSO" title="Exportar cardápio em PDF" text="Geramos um menu elegante usando apenas os itens disponíveis agora." action={<button className="solid-button" disabled={pdfDownloading} onClick={() => void downloadPdf()}><Download size={17} /> {pdfDownloading ? "Gerando PDF..." : "Baixar PDF"}</button>} />{pdfError && <p className="pdf-download-error" role="alert">{pdfError}</p>}
    <div className="pdf-layout"><section className="panel pdf-options"><h3>Personalize seu menu</h3><p>Escolha o tema, a orientação e acompanhe o resultado antes de exportar.</p><div className="pdf-mode-picker"><span>Tema do PDF</span><div><button className={mode === "light" ? "active" : ""} onClick={() => setMode("light")}>Claro</button><button className={mode === "dark" ? "active" : ""} onClick={() => setMode("dark")}>Escuro</button></div></div><div className="pdf-mode-picker"><span>Orientação da página</span><div><button className={orientation === "portrait" ? "active" : ""} onClick={() => setOrientation("portrait")}>Vertical</button><button className={orientation === "landscape" ? "active" : ""} onClick={() => setOrientation("landscape")}>Horizontal</button></div></div><Field label="Título do menu"><input value={title} onChange={(event) => setTitle(event.target.value)} /></Field><Field label="Texto de abertura"><textarea value={intro} onChange={(event) => setIntro(event.target.value)} /></Field><label className="option-check"><span><b>Exibir fotos dos produtos</b><small>Valoriza os itens no menu visual</small></span><input aria-label="Exibir fotos dos produtos" type="checkbox" checked={showPhotos} onChange={(event) => setShowPhotos(event.target.checked)} /></label><label className="option-check"><span><b>Exibir informações nutricionais</b><small>Calorias, proteína e carboidratos</small></span><input aria-label="Exibir informações nutricionais" type="checkbox" checked={showNutrition} onChange={(event) => setShowNutrition(event.target.checked)} /></label><div className="suggestion-box"><SparklesIcon /><div><b>Composição inteligente</b><p>{available.length} itens organizados em {categories.length} seções, prontos para impressão.</p></div></div></section>
      <section className="pdf-preview-area"><span>PRÉ-VISUALIZAÇÃO · A4 · {orientation === "landscape" ? "HORIZONTAL" : "VERTICAL"} · MODO {mode === "dark" ? "ESCURO" : "CLARO"}</span><article ref={pdfRef} className={`pdf-sheet pdf-${mode} pdf-${orientation}`} style={{ "--pdf-accent": theme.accent } as React.CSSProperties}><header style={{ backgroundImage: `linear-gradient(90deg,${theme.background}f2,${theme.background}9c),url(${theme.heroImage})` }}><div className="pdf-brand-row"><Brand inverse /></div><h2>{title}</h2><p>{intro}</p></header><div className="pdf-menu">{categories.map((category) => { const categoryItems = available.filter((item) => item.category === category); if (!categoryItems.length) return null; return <section key={category}><h3><span>{category}</span><small>{categoryItems.length} {categoryItems.length === 1 ? "opção" : "opções"}</small></h3>{categoryItems.slice(0, 4).map((item) => <div className="pdf-item" key={item.id}>{showPhotos && <Image src={item.image} alt="" width={46} height={46} unoptimized />}<div className="pdf-item-copy"><b>{item.name}</b><p>{item.description}</p>{showNutrition && <div className="pdf-nutrition"><span><strong>{item.calories}</strong><small>kcal</small></span><span><strong>{item.protein}g</strong><small>proteínas</small></span><span><strong>{item.carbs}g</strong><small>carboidratos</small></span></div>}</div><strong>{money(item.price)}</strong></div>)}</section>; })}</div><footer><div><b>{theme.restaurantName}</b><small>{theme.slogan}</small></div><span>{settings.address}<br />{settings.phone} · {settings.instagram}</span></footer></article></section></div>
  </div>;
}
function SparklesIcon() { return <span className="sparkles-icon">✦</span>; }
