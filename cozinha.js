function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[char]);
}
// Cozinha Powershake - Kanban & Gestão Operacional
let currentOrders = [];
let menuData = null;
let isSoundEnabled = true;
let knownOrderIds = new Set();
let pollInterval = null;
let audioContext = null;

// Initialize Cozinha App
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    checkAuthSession();

    document.getElementById('pin-submit-btn').addEventListener('click', handlePinLogin);
    document.getElementById('pin-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handlePinLogin();
    });

    document.getElementById('sound-toggle-btn').addEventListener('click', toggleSound);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
});

// Real-time Clock
function initClock() {
    const clockEl = document.getElementById('live-clock');
    const updateTime = () => {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('pt-BR');
    };
    updateTime();
    setInterval(updateTime, 1000);
}

// Authentication Check
async function checkAuthSession() {
    try {
        const response = await fetch('/api/auth-session', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && data.authenticated) {
            startKitchenApp();
            return;
        }
    } catch {}
    showAuthModal(true);
}

function showAuthModal(show) {
    document.getElementById('auth-modal').style.display = show ? 'flex' : 'none';
    document.getElementById('kitchen-app').style.display = show ? 'none' : 'flex';
    if (show) setTimeout(() => document.getElementById('pin-input')?.focus(), 50);
}

function startKitchenApp() {
    showAuthModal(false);
    fetchOrders();
    fetchMenuData();
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(fetchOrders, 8000);
}

async function handlePinLogin() {
    const input = document.getElementById('pin-input');
    const errorEl = document.getElementById('pin-error-msg');
    const button = document.getElementById('pin-submit-btn');
    errorEl.textContent = '';
    if (!input.value.trim()) {
        errorEl.textContent = 'Por favor, insira o PIN.';
        return;
    }

    button.disabled = true;
    try {
        const response = await fetch('/api/auth-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: input.value })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'PIN incorreto.');
        input.value = '';
        startKitchenApp();
    } catch (error) {
        errorEl.textContent = error.message || 'Não foi possível entrar.';
        showAuthModal(true);
    } finally {
        button.disabled = false;
    }
}

async function handleLogout() {
    try { await fetch('/api/auth-logout', { method: 'POST' }); } catch {}
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = null;
    currentOrders = [];
    showAuthModal(true);
}

// Sound Notification Generator using Web Audio API
function playNewOrderSound() {
    if (!isSoundEnabled) return;
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const now = audioContext.currentTime;
        
        // Two-tone chime alert
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc1.frequency.setValueAtTime(880, now + 0.15); // A5
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc1.connect(gain1);
        gain1.connect(audioContext.destination);

        osc1.start(now);
        osc1.stop(now + 0.6);
    } catch (e) {
        console.error('Audio play error:', e);
    }
}

function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    const btn = document.getElementById('sound-toggle-btn');
    const label = document.getElementById('sound-label');
    const icon = document.getElementById('sound-icon');

    if (isSoundEnabled) {
        btn.classList.remove('muted');
        label.textContent = 'Som Ativado';
        icon.setAttribute('name', 'volume-high-outline');
        playNewOrderSound(); // play test chime
    } else {
        btn.classList.add('muted');
        label.textContent = 'Som Muted';
        icon.setAttribute('name', 'volume-mute-outline');
    }
}

// Fetch Orders from Serverless API
async function fetchOrders() {
    try {
        const response = await fetch('/api/get-orders', { cache: 'no-store' });
        if (response.status === 401) {
            handleLogout();
            return;
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.orders)) {
            processOrdersData(data.orders);
        } else {
            console.warn('Pedidos temporariamente indisponíveis.');
        }
    } catch (err) {
        console.warn('Pedidos temporariamente indisponíveis.');
    }
}

function fetchOrdersLocal() {
    try {
        const local = JSON.parse(localStorage.getItem('power_shake_orders')) || [];
        processOrdersData(local);
    } catch (e) {
        processOrdersData([]);
    }
}

function processOrdersData(orders) {
    let hasNewPendingOrder = false;

    orders.forEach(o => {
        if (!o.status) o.status = 'pending';
        // Detect new incoming pending order
        if (!knownOrderIds.has(o.id)) {
            knownOrderIds.add(o.id);
            if (o.status === 'pending') {
                hasNewPendingOrder = true;
            }
        }
    });

    currentOrders = orders;
    renderKanban();

    if (hasNewPendingOrder) {
        playNewOrderSound();
    }
}

// Render Kanban Board
function renderKanban() {
    const cols = {
        pending: document.getElementById('cards-pending'),
        preparing: document.getElementById('cards-preparing'),
        completed: document.getElementById('cards-completed'),
        cancelled: document.getElementById('cards-cancelled')
    };

    const counts = { pending: 0, preparing: 0, completed: 0, cancelled: 0 };

    Object.keys(cols).forEach(k => cols[k].innerHTML = '');

    currentOrders.forEach(order => {
        const status = order.status || 'pending';
        counts[status] = (counts[status] || 0) + 1;

        const card = createKanbanCard(order);
        if (cols[status]) {
            cols[status].appendChild(card);
        }
    });

    // Update count badges
    document.getElementById('count-pending').textContent = counts.pending;
    document.getElementById('count-preparing').textContent = counts.preparing;
    document.getElementById('count-completed').textContent = counts.completed;
    document.getElementById('count-cancelled').textContent = counts.cancelled;
    document.getElementById('total-pending-badge').textContent = counts.pending;
}

function getCategoryInfo(categoryId, defaultCategoryName = '', rawText = '') {
    const maps = {
        fruits: { label: 'FRUTA', emoji: '🍌', colorClass: 'category-fruits' },
        milks: { label: 'LEITE', emoji: '🥛', colorClass: 'category-milks' },
        whey: { label: 'WHEY', emoji: '💪', colorClass: 'category-whey' },
        toppings: { label: 'TOPPING', emoji: '🍫', colorClass: 'category-toppings' },
        peanutButters: { label: 'PASTA', emoji: '🥜', colorClass: 'category-peanutButters' },
        supplements: { label: 'SUPLEMENTO', emoji: '⚡', colorClass: 'category-supplements' }
    };

    if (categoryId && maps[categoryId]) return maps[categoryId];

    const lower = (defaultCategoryName + ' ' + rawText).toLowerCase();
    if (lower.includes('fruta')) return maps.fruits;
    if (lower.includes('leite')) return maps.milks;
    if (lower.includes('whey')) return maps.whey;
    if (lower.includes('topping') || lower.includes('acompanhamento')) return maps.toppings;
    if (lower.includes('pasta') || lower.includes('peanut')) return maps.peanutButters;
    if (lower.includes('suplemento')) return maps.supplements;

    let cleanLabel = (defaultCategoryName || 'ITEM')
        .toUpperCase()
        .replace('ESCOLHA O ', '')
        .replace('ESCOLHA A ', '')
        .replace('ADICIONE ', '')
        .replace('TOPPINGS & ', '');

    return {
        label: cleanLabel || 'ITEM',
        emoji: '✨',
        colorClass: 'category-default'
    };
}

// Create Kanban Card Element (Timeline Styled + Touch Screen Tablet)
function createKanbanCard(order) {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.draggable = true;
    card.dataset.orderId = order.id;

    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', order.id);
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    const dateFormatted = order.timestamp || order.createdAt ? 
        new Date(order.timestamp || order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
    
    const dateFull = order.timestamp || order.createdAt ?
        new Date(order.timestamp || order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + dateFormatted : dateFormatted;

    const totalFormatted = order.totalPrice ? Number(order.totalPrice).toFixed(2).replace('.', ',') : '0,00';
    const clientName = escapeHtml(order.clientName || order.customerName || 'Cliente');
    const currentStatus = order.status || 'pending';

    const statusObj = {
        pending: { label: 'PENDENTE', class: 'badge-status-pending' },
        preparing: { label: 'EM PREPARO', class: 'badge-status-preparing' },
        completed: { label: 'CONCLUÍDO', class: 'badge-status-completed' },
        cancelled: { label: 'CANCELADO', class: 'badge-status-cancelled' }
    }[currentStatus] || { label: currentStatus.toUpperCase(), class: 'badge-status-pending' };

    // Format timeline steps for each ingredient/item
    let itemsHtml = '';
    if (order.items && Array.isArray(order.items)) {
        itemsHtml = order.items.map(item => {
            let rawName = item.itemName || item.name || '';
            let categoryName = item.categoryName || '';
            let categoryId = item.categoryId || '';

            if (rawName.includes(':')) {
                const parts = rawName.split(':');
                categoryName = parts[0].trim();
                rawName = parts.slice(1).join(':').trim();
            }

            const info = getCategoryInfo(categoryId, categoryName, rawName);
            const qtyStr = item.quantity && item.quantity > 1 ? ` (${item.quantity}x)` : '';

            return `
                <div class="timeline-step">
                    <div class="step-marker-node"></div>
                    <span class="step-category-badge ${info.colorClass}">${escapeHtml(info.emoji)} ${escapeHtml(info.label)}</span>
                    <span class="step-item-name">${escapeHtml(rawName)}${escapeHtml(qtyStr)}</span>
                </div>
            `;
        }).join('');
    }

    let actionsHtml = '';
    if (currentStatus === 'pending') {
        actionsHtml = `
            <button class="card-btn prep-btn" onclick="updateOrderStatus('${safeOrderId}', 'preparing')">
                <ion-icon name="flame"></ion-icon>
                <span>Preparar</span>
            </button>
            <button class="card-btn cancel-btn" onclick="updateOrderStatus('${safeOrderId}', 'cancelled')">
                <ion-icon name="close-circle-outline"></ion-icon>
                <span>Cancelar</span>
            </button>
        `;
    } else if (currentStatus === 'preparing') {
        actionsHtml = `
            <button class="card-btn done-btn" onclick="updateOrderStatus('${safeOrderId}', 'completed')">
                <ion-icon name="checkmark-done-circle"></ion-icon>
                <span>Finalizar</span>
            </button>
            <button class="card-btn cancel-btn" onclick="updateOrderStatus('${safeOrderId}', 'cancelled')">
                <ion-icon name="close-circle-outline"></ion-icon>
                <span>Cancelar</span>
            </button>
        `;
    } else if (currentStatus === 'completed' || currentStatus === 'cancelled') {
        actionsHtml = `
            <button class="card-btn prep-btn" onclick="updateOrderStatus('${safeOrderId}', 'pending')">
                <ion-icon name="arrow-undo-circle-outline"></ion-icon>
                <span>Voltar p/ Pendentes</span>
            </button>
        `;
    }

    const rawShortId = order.id.toString().startsWith('#') ? order.id : `#${order.id}`;
    const safeOrderId = escapeHtml(order.id);
    const shortId = escapeHtml(rawShortId);
    const kcalVal = parseFloat(order.totalKcal || 0).toFixed(1);
    const proteinVal = parseFloat(order.totalProtein || 0).toFixed(1);

    card.innerHTML = `
        <div class="card-top-bar">
            <div class="card-id-client">
                <span class="order-id-neon">${shortId}</span>
                <h3 class="customer-name-heading">${clientName}</h3>
            </div>
            <span class="order-status-pill ${statusObj.class}">${escapeHtml(statusObj.label)}</span>
        </div>

        <div class="customer-sub-row">
            <span class="order-timestamp-text">${escapeHtml(dateFull)}</span>
        </div>

        <div class="timeline-container">
            <div class="timeline-line"></div>
            ${itemsHtml}
        </div>

        <div class="card-footer-bar">
            <div class="macros-group">
                <span class="macro-badge">🔥 ${kcalVal} kcal</span>
                <span class="macro-badge">💪 ${proteinVal}g prot</span>
            </div>
            <span class="card-total-price">R$ ${totalFormatted}</span>
        </div>

        <div class="card-actions touch-actions">
            ${actionsHtml}
        </div>
    `;

    return card;
}

// Drag & Drop Column Events
function handleDragOver(e) {
    e.preventDefault();
    const wrapper = e.currentTarget.querySelector('.cards-wrapper');
    if (wrapper) wrapper.classList.add('drag-over');
}

async function handleDrop(e, targetStatus) {
    e.preventDefault();
    document.querySelectorAll('.cards-wrapper').forEach(w => w.classList.remove('drag-over'));

    const orderId = e.dataTransfer.getData('text/plain');
    if (orderId) {
        await updateOrderStatus(orderId, targetStatus);
    }
}

// Update Order Status API Call
async function updateOrderStatus(orderId, newStatus) {
    // Optimistic UI update
    currentOrders = currentOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    renderKanban();

    try {
        const res = await fetch('/api/update-order-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status: newStatus })
        });

        if (res.status === 401) {
            await handleLogout();
            return;
        }
        if (!res.ok) throw new Error('Falha ao atualizar pedido.');
    } catch (error) {
        console.warn(error.message);
        await fetchOrders();
    }
}

function saveOrdersLocal() {
    localStorage.setItem('power_shake_orders', JSON.stringify(currentOrders));
}

// Switch Kitchen Tabs
function switchKitchenTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    if (tabId === 'tab-kanban') {
        document.getElementById('tab-kanban-btn').classList.add('active');
        document.getElementById('tab-kanban').classList.add('active');
    } else {
        document.getElementById('tab-items-btn').classList.add('active');
        document.getElementById('tab-items').classList.active ? null : document.getElementById('tab-items').classList.add('active');
        renderKitchenItemsManager();
    }
}

// Fetch Menu Data for Items Manager
async function fetchMenuData() {
    try {
        const res = await fetch('/api/get-menu');
        const data = await res.json();
        if (data.success && data.menuData) {
            menuData = data.menuData;
        } else {
            fetchMenuLocal();
        }
    } catch (e) {
        fetchMenuLocal();
    }
}

function fetchMenuLocal() {
    try {
        const cached = localStorage.getItem('power_shake_menu_data');
        if (cached) menuData = JSON.parse(cached);
    } catch (e) {}
}

// Render Kitchen Menu Items Manager
function renderKitchenItemsManager() {
    const container = document.getElementById('kitchen-categories-container');
    if (!container) return;

    if (!menuData || !menuData.categories) {
        container.innerHTML = '<p style="color: var(--text-muted);">Carregando itens do cardápio...</p>';
        return;
    }

    container.innerHTML = menuData.categories.map(cat => `
        <div class="kitchen-cat-block">
            <h3 class="kitchen-cat-title">${escapeHtml(cat.name)}</h3>
            <div class="kitchen-items-list">
                ${cat.items.map(item => `
                    <div class="kitchen-item-row" id="item-row-${escapeHtml(item.id)}">
                        <div class="kitchen-item-info">
                            <span class="kitchen-item-icon">${escapeHtml(item.icon || '🥤')}</span>
                            <div>
                                <div class="kitchen-item-name">${escapeHtml(item.name)}</div>
                                <div class="kitchen-item-price">R$ ${Number(item.price || 0).toFixed(2).replace('.', ',')}</div>
                            </div>
                        </div>
                        <label class="switch-toggle" title="Disponível no Cardápio">
                            <input type="checkbox" ${!item.outOfStock ? 'checked' : ''} onchange="toggleItemAvailability('${escapeHtml(cat.id)}', '${escapeHtml(item.id)}', this.checked)">
                            <span class="slider"></span>
                        </label>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Toggle Item Availability in Menu Data
async function toggleItemAvailability(catId, itemId, isAvailable) {
    if (!menuData) return;

    const cat = menuData.categories.find(c => c.id === catId);
    if (cat) {
        const item = cat.items.find(i => i.id === itemId);
        if (item) {
            item.outOfStock = !isAvailable;
        }
    }

    // Save menu data
    localStorage.setItem('power_shake_menu_data', JSON.stringify(menuData));

    try {
        const response = await fetch('/api/update-item-availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryId: catId, itemId, available: isAvailable })
        });
        if (response.status === 401) {
            await handleLogout();
            return;
        }
        if (!response.ok) throw new Error('Falha ao sincronizar disponibilidade.');
    } catch (e) {
        console.warn('Erro ao sincronizar disponibilidade via API');
    }
}

// Filter Items in Manager View
function filterKitchenItems() {
    const term = document.getElementById('item-search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.kitchen-item-row');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? 'flex' : 'none';
    });
}
