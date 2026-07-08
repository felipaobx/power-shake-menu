// Power Shake Default Menu Data (List of Categories Schema)
const DEFAULT_MENU_DATA = {
    categories: [
        {
            id: 'fruits',
            name: 'Escolha a Fruta',
            subtitle: 'Base do Shake (100g)',
            isStep: true,
            selectionType: 'single',
            items: [
                { id: 'mamao', name: 'Mamão', kcal: 43, protein: 0.5, price: 3.50, icon: '🥭', image: '' },
                { id: 'banana', name: 'Banana', kcal: 89, protein: 1.1, price: 3.00, icon: '🍌', image: '' },
                { id: 'morango', name: 'Morango', kcal: 33, protein: 0.7, price: 4.50, icon: '🍓', image: '' },
                { id: 'frutas_vermelhas', name: 'Frutas vermelhas', kcal: 45, protein: 0.5, price: 6.00, icon: '🍒', image: '' },
                { id: 'maracuja', name: 'Maracujá', kcal: 80, protein: 1.8, price: 4.50, icon: '🍋', image: '' },
                { id: 'goiaba', name: 'Goiaba', kcal: 68, protein: 2.6, price: 4.00, icon: '🍑', image: '' },
                { id: 'abacate', name: 'Abacate', kcal: 160, protein: 2.0, price: 5.00, icon: '🥑', image: '' }
            ]
        },
        {
            id: 'milks',
            name: 'Escolha o Leite',
            subtitle: '200ml',
            isStep: true,
            selectionType: 'single',
            items: [
                { id: 'leite_vegetal_barista', name: 'Leite vegetal Barista', kcal: 0, protein: 0, price: 10.90, icon: '🥛', description: '200ml', image: '' },
                { id: 'leite_vegetal', name: 'Leite vegetal', kcal: 0, protein: 0, price: 9.90, icon: '🥛', description: '200ml', image: '' },
                { 
                    id: 'leite_ninho_levinho', 
                    name: 'Leite Ninho levinho', 
                    kcal: 85.5, 
                    protein: 6.4, 
                    price: 6.90, 
                    icon: '🥛', 
                    description: '200ml',
                    versions: ['regular', 'A2', 'zero lactose'],
                    image: ''
                },
                { 
                    id: 'leite_molico', 
                    name: 'Leite Molico', 
                    kcal: 0, 
                    protein: 0, 
                    price: 6.90, 
                    icon: '🥛', 
                    description: '200ml',
                    versions: ['regular', 'zero lactose'],
                    image: ''
                },
                { id: 'leite_camponesa', name: 'Leite Camponesa', kcal: 0, protein: 14.0, price: 8.50, icon: '🥛', description: '200ml', image: '' },
                { id: 'leite_avela', name: 'Leite de Avelã', kcal: 58, protein: 1.0, price: 9.90, icon: '🥛', description: '200ml (Sob Consulta)', image: '' },
                { id: 'leite_amendoas', name: 'Leite de Amêndoas', kcal: 30, protein: 2.0, price: 9.90, icon: '🥛', description: '200ml (Sob Consulta)', image: '' },
                { id: 'leite_desnatado', name: 'Leite Desnatado', kcal: 65, protein: 7.0, price: 6.90, icon: '🥛', description: '200ml (Sob Consulta)', image: '' },
                { id: 'leite_aveia', name: 'Leite de Aveia', kcal: 110, protein: 1.8, price: 9.90, icon: '🥛', description: '200ml (Sob Consulta)', image: '' },
                { id: 'leite_soja', name: 'Leite de Soja', kcal: 95, protein: 7.3, price: 9.90, icon: '🥛', description: '200ml (Sob Consulta)', image: '' },
                { id: 'leite_castanha', name: 'Leite de Castanha', kcal: 85, protein: 1.9, price: 9.90, icon: '🥛', description: '200ml (Sob Consulta)', image: '' }
            ]
        },
        {
            id: 'whey',
            name: 'Adicione Whey Protein',
            subtitle: 'Proteína Pura',
            isStep: true,
            selectionType: 'single',
            items: [
                { 
                    id: 'whey_100', 
                    name: 'Whey 100% Concentrado (40g)', 
                    kcal: 115, 
                    protein: 20.0, 
                    price: 15.90, 
                    icon: '💪', 
                    description: 'Mais performance, recuperação muscular acelerada e ganho de massa.',
                    image: ''
                }
            ]
        },
        {
            id: 'toppings',
            name: 'Toppings & Acompanhamentos',
            subtitle: 'Toque Final',
            isStep: true,
            selectionType: 'multi',
            items: [
                { id: 'hey_mu', name: 'Hey Mu (20g)', kcal: 29, protein: 1.5, price: 5.90, icon: '🐮', image: '' },
                { id: 'sorvete_zero', name: 'Sorvete zero açúcar (60g)', kcal: 60, protein: 2.2, price: 0.0, icon: '🍦', image: '' },
                { id: 'leite_moca_light', name: 'Leite moça Light (20g)', kcal: 56, protein: 1.9, price: 0.0, icon: '🍯', image: '' }
            ]
        },
        {
            id: 'peanutButters',
            name: 'Adicione Pasta Dr. Peanut',
            subtitle: 'Cremosidade (30g)',
            isStep: false,
            selectionType: 'multi',
            items: [
                { id: 'peanut_cookies', name: 'Cookies & Cream', price: 5.90, icon: '🥜', image: '' },
                { id: 'peanut_bombom', name: 'Bombom Italiano', price: 6.90, icon: '🥜', image: '' },
                { id: 'peanut_brownie', name: 'Brownie', price: 6.90, icon: '🥜', image: '' },
                { id: 'peanut_avela', name: 'Avelã', price: 4.99, icon: '🥜', image: '' },
                { id: 'peanut_buenissimo', name: 'Buenissimo', price: 4.99, icon: '🥜', image: '' },
                { id: 'peanut_leite_po', name: 'Leite em pó', price: 4.99, icon: '🥜', image: '' },
                { id: 'peanut_caramelo', name: 'Caramelo salgado', price: 12.50, icon: '🥜', image: '' },
                { id: 'peanut_doce_leite', name: 'Doce de leite', price: 7.90, icon: '🥜', image: '' },
                { id: 'peanut_beijinho', name: 'Beijinho', price: 7.90, icon: '🥜', image: '' },
                { id: 'peanut_pistache', name: 'Pistache', price: 7.90, icon: '🥜', image: '' }
            ]
        },
        {
            id: 'supplements',
            name: 'Suplementos & Extras',
            subtitle: 'Potencialize',
            isStep: false,
            selectionType: 'multi',
            items: [
                { id: 'sup_multivitaminico', name: 'Multivitamínico + Ômega 3 (Max Titanium)', price: 5.99, icon: '💊', description: '2 cáps. de cada', image: '' },
                { id: 'sup_creatina_7belos', name: 'Creatina 7 Belos', price: 3.99, icon: '⚡', image: '' },
                { id: 'sup_creatina_max', name: 'Creatina Max Titanium', price: 2.99, icon: '⚡', image: '' },
                { id: 'sup_pre_horus_7belos', name: 'Pré-Treino Horus 7 Belos', price: 5.90, icon: '🔥', image: '' },
                { id: 'sup_pre_horus_frutas', name: 'Pré-Treino Horus Frutas Vermelhas', price: 5.90, icon: '🔥', image: '' }
            ]
        }
    ]
};

// Power Shake Default Settings
const DEFAULT_SETTINGS = {
    heroTitle: 'Monte o Shake Perfeito',
    heroSubtitle: 'Escolha a fruta, o leite, adicione whey e os toppings ideais para o seu treino e a sua dieta. Sabor, energia e resultado em cada copo.',
    heroImage: 'assets/hero.png',
    midBannerTitle: 'Experimente um novo estilo de vida',
    midBannerSubtitle: 'Venha conhecer a Power Shake! Nossa missão é trazer sabor incomparável alinhado com a sua rotina fitness.',
    midBannerImage: 'assets/fruits.png',
    address: '📍 <strong>Endereço:</strong> Rua Zeferino Galvão, nº 508, 1º andar, sala 01',
    subAddress: 'Em frente ao receptivo de lotação (Acima da Medic Center)',
    mapUrl: 'https://maps.google.com/?q=Rua+Zeferino+Galvão,+508+Caruaru'
};

// Load from LocalStorage or initialize with defaults
let MENU_DATA = JSON.parse(localStorage.getItem('power_shake_menu_data'));
let SETTINGS = JSON.parse(localStorage.getItem('power_shake_settings'));

function migrateFruitPrices(menuData) {
    if (menuData && menuData.categories) {
        const fruitsCat = menuData.categories.find(c => c.id === 'fruits');
        if (fruitsCat && fruitsCat.items) {
            const allZero = fruitsCat.items.every(item => !item.price || item.price === 0);
            if (allZero) {
                fruitsCat.items.forEach(item => {
                    const defaultFruit = DEFAULT_MENU_DATA.categories
                        .find(c => c.id === 'fruits')?.items
                        .find(f => f.id === item.id);
                    if (defaultFruit) {
                        item.price = defaultFruit.price;
                    }
                });
            }
        }
    }
    return menuData;
}

// Migration helper (converts old object schema to list schema if needed)
if (MENU_DATA && !MENU_DATA.categories) {
    MENU_DATA = null; // Forces reset to category list schema
}

if (!MENU_DATA) {
    MENU_DATA = DEFAULT_MENU_DATA;
    localStorage.setItem('power_shake_menu_data', JSON.stringify(DEFAULT_MENU_DATA));
} else {
    MENU_DATA = migrateFruitPrices(MENU_DATA);
}
if (!SETTINGS) {
    SETTINGS = DEFAULT_SETTINGS;
    localStorage.setItem('power_shake_settings', JSON.stringify(DEFAULT_SETTINGS));
}

// Application Selection State
let orderState = {
    selections: {}, // Map of categoryId -> selectedItem (single) OR array of selectedItems (multi)
    milkVersion: 'regular' // Keep Niho/Molico version check
};

// Initialize selection structures in orderState
MENU_DATA.categories.forEach(cat => {
    orderState.selections[cat.id] = cat.selectionType === 'single' ? null : [];
});

// DOM Elements
const elements = {
    builderContainer: document.getElementById('builder-steps-container'),
    extrasContainer: document.getElementById('extras-container'),
    
    // Totals DOM
    totalKcal: document.querySelectorAll('.total-kcal-val'),
    totalProtein: document.querySelectorAll('.total-protein-val'),
    totalPrice: document.querySelectorAll('.total-price-val'),
    summaryItems: document.getElementById('summary-items'),
    emptySummary: document.getElementById('empty-summary-msg'),
    clearBtn: document.getElementById('clear-order-btn'),
    scrollToSummaryBtn: document.querySelector('.scroll-to-summary-btn'),
    
    // Checkout Receipt DOM
    checkoutBtn: document.getElementById('checkout-btn'),
    mainGrid: document.querySelector('.main-grid'),
    receiptScreen: document.getElementById('receipt-screen'),
    receiptScreenItems: document.getElementById('receipt-screen-items'),
    receiptKcal: document.getElementById('receipt-kcal'),
    receiptProtein: document.getElementById('receipt-protein'),
    receiptTotalPrice: document.getElementById('receipt-total-price'),
    receiptRedoBtn: document.getElementById('receipt-redo-btn'),
    floatingMobileBar: document.querySelector('.floating-mobile-bar')
};

// Format currency
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Render dynamic sections from categories list
function renderMenuCategories() {
    elements.builderContainer.innerHTML = '';
    elements.extrasContainer.innerHTML = '';

    let stepCounter = 1;

    MENU_DATA.categories.forEach(category => {
        // Skip rendering if category has no items
        if (!category.items || category.items.length === 0) return;

        let sectionHtml = '';

        if (category.isStep) {
            // STEP SECTIONS (1, 2, 3...)
            const stepNum = stepCounter++;
            
            // Check if Whey has a special single-toggle card layout
            if (category.id === 'whey' && category.items.length === 1) {
                const item = category.items[0];
                const isSelected = orderState.selections[category.id] !== null;
                
                // Photo vs Emoji icon check
                const mediaHtml = item.image 
                    ? `<img src="${item.image}" class="item-card-image" alt="${item.name}">` 
                    : `<span class="whey-icon">${item.icon || '💪'}</span>`;

                let wheyMacros = '';
                const kcalVal = item.kcal || 0;
                const proteinVal = item.protein || 0;
                if (kcalVal > 0 && proteinVal > 0) {
                    wheyMacros = `${kcalVal} kcal · ${proteinVal}g prot`;
                } else if (kcalVal > 0) {
                    wheyMacros = `${kcalVal} kcal`;
                } else if (proteinVal > 0) {
                    wheyMacros = `${proteinVal}g prot`;
                }
                const wheyMacrosHtml = wheyMacros ? `<span class="macros">${wheyMacros}</span>` : '';

                sectionHtml = `
                    <section class="section-card" id="step-${category.id}">
                        <div class="step-header">
                            <span class="step-number">${stepNum}</span>
                            <h2 class="step-title">${category.name}</h2>
                            <span class="step-subtitle">${category.subtitle}</span>
                        </div>
                        <div class="whey-toggle-card ${isSelected ? 'selected' : ''}" id="whey-card" data-category="${category.id}" data-id="${item.id}">
                            ${mediaHtml}
                            <div class="whey-info">
                                <h4>${item.name}</h4>
                                <p>${item.description || ''}</p>
                            </div>
                            <div class="whey-price">
                                <span class="price">${formatCurrency(item.price)}</span>
                                ${wheyMacrosHtml}
                            </div>
                        </div>
                    </section>
                `;
            } else {
                // GENERAL STEP GRID
                sectionHtml = `
                    <section class="section-card" id="step-${category.id}">
                        <div class="step-header">
                            <span class="step-number">${stepNum}</span>
                            <h2 class="step-title">${category.name}</h2>
                            <span class="step-subtitle">${category.subtitle}</span>
                        </div>
                        <div class="cards-grid">
                            ${renderCards(category)}
                        </div>
                    </section>
                `;
            }
            elements.builderContainer.insertAdjacentHTML('beforeend', sectionHtml);
        } else {
            // EXTRAS SECTIONS (Peanut, Supplements, and Custom additions)
            sectionHtml = `
                <section class="section-card" id="extra-${category.id}">
                    <div class="step-header">
                        <span class="step-number">+</span>
                        <h2 class="step-title">${category.name}</h2>
                        <span class="step-subtitle">${category.subtitle}</span>
                    </div>
                    <div class="cards-grid">
                        ${renderCards(category)}
                    </div>
                </section>
            `;
            elements.extrasContainer.insertAdjacentHTML('beforeend', sectionHtml);
        }
    });

    // Re-bind click handler on the Whey toggle card
    const wheyCard = document.getElementById('whey-card');
    if (wheyCard) {
        wheyCard.addEventListener('click', function() {
            const catId = this.dataset.category;
            const itemId = this.dataset.id;
            const category = MENU_DATA.categories.find(c => c.id === catId);
            const item = category.items.find(i => i.id === itemId);
            
            if (orderState.selections[catId]) {
                orderState.selections[catId] = null;
                this.classList.remove('selected');
            } else {
                orderState.selections[catId] = item;
                this.classList.add('selected');
            }
            updateTotals();
        });
    }

    setupEventListeners();
}

// Render product card grid
function renderCards(category, visibleItems) {
    const itemsToRender = visibleItems || category.items;
    return itemsToRender.map(item => {
        const isSelected = category.selectionType === 'single'
            ? (orderState.selections[category.id] && orderState.selections[category.id].id === item.id)
            : (orderState.selections[category.id].some(i => i.id === item.id));

        // Sub options render (versions radios for milk)
        let subOptionsHtml = '';
        if (category.id === 'milks' && item.versions && isSelected) {
            subOptionsHtml = `
                <div class="sub-options-container" onclick="event.stopPropagation()">
                    ${item.versions.map(version => `
                        <label class="sub-option-label">
                            <input type="radio" name="version-${item.id}" value="${version}" ${version === orderState.milkVersion ? 'checked' : ''}>
                            <span>${version === 'regular' ? 'Padrão' : version}</span>
                        </label>
                    `).join('')}
                </div>
            `;
        }

        // Photo vs Emoji render check
        const mediaHtml = item.image 
            ? `<div class="item-card-media"><img src="${item.image}" class="item-card-image" alt="${item.name}"></div>` 
            : `<div class="item-card-media"><span class="item-card-icon">${item.icon || '🥤'}</span></div>`;

        // Price tags: hide or show price
        const priceHtml = `<div class="item-card-price">${item.price > 0 ? formatCurrency(item.price) : 'Incluso'}</div>`;

        // Macros tag check
        const showMacros = ['fruits', 'milks', 'toppings'].includes(category.id);
        let macrosHtml = '';
        if (showMacros) {
            const kcalVal = item.kcal || 0;
            const proteinVal = item.protein || 0;
            const kcalHtml = kcalVal > 0 ? `<span class="item-card-macro">${kcalVal} kcal</span>` : '';
            const proteinHtml = proteinVal > 0 ? `<span class="item-card-macro">${proteinVal}g P</span>` : '';
            if (kcalHtml || proteinHtml) {
                macrosHtml = `
                <div class="item-card-macros">
                    ${kcalHtml}
                    ${proteinHtml}
                </div>`;
            }
        }

        const descHtml = item.description 
            ? `<div style="font-size:0.72rem; color:var(--text-secondary); margin-bottom:5px; line-height:1.2;">${item.description}</div>`
            : '';

        return `
            <div class="item-card ${isSelected ? 'selected' : ''}" data-category="${category.id}" data-id="${item.id}">
                <div class="card-checkbox"></div>
                <div>
                    ${mediaHtml}
                    <div class="item-card-title">${item.name}</div>
                    ${descHtml}
                </div>
                <div>
                    ${priceHtml}
                    ${macrosHtml}
                    ${subOptionsHtml}
                </div>
            </div>
        `;
    }).join('');
}

// Bind interaction listeners
function setupEventListeners() {
    // Card Clicks delegation
    document.querySelectorAll('.item-card').forEach(card => {
        // Prevent duplicate listener registration
        card.replaceWith(card.cloneNode(true));
    });

    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const catId = this.dataset.category;
            const itemId = this.dataset.id;
            const category = MENU_DATA.categories.find(c => c.id === catId);
            const item = category.items.find(i => i.id === itemId);

            if (category.selectionType === 'single') {
                const isSelected = this.classList.contains('selected');
                
                // Clear all cards in this category
                document.querySelectorAll(`.item-card[data-category="${catId}"]`).forEach(c => c.classList.remove('selected'));

                if (isSelected) {
                    orderState.selections[catId] = null;
                } else {
                    this.classList.add('selected');
                    orderState.selections[catId] = item;
                    
                    // Default version selector
                    const radioChecked = this.querySelector('input[type="radio"]:checked');
                    if (radioChecked) {
                        orderState.milkVersion = radioChecked.value;
                    }
                }
            } else {
                // MULTI SELECT
                const isSelected = this.classList.contains('selected');
                if (isSelected) {
                    this.classList.remove('selected');
                    orderState.selections[catId] = orderState.selections[catId].filter(i => i.id !== itemId);
                } else {
                    this.classList.add('selected');
                    orderState.selections[catId].push(item);
                }
            }
            
            // Re-render to show/hide sub options radios if milk selected
            if (catId === 'milks') {
                renderMenuCategories();
            } else {
                updateTotals();
            }
        });
    });

    // Milk version radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function(e) {
            orderState.milkVersion = this.value;
            updateTotals();
        });
    });
}

// Global actions listener binding
function setupGlobalActions() {
    // Clear selections
    elements.clearBtn.addEventListener('click', resetOrder);

    // Scroll to summary on mobile
    if (elements.scrollToSummaryBtn) {
        elements.scrollToSummaryBtn.addEventListener('click', function () {
            const summaryCard = document.querySelector('.summary-card');
            if (summaryCard) {
                summaryCard.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Finalize order click
    if (elements.checkoutBtn) {
        elements.checkoutBtn.addEventListener('click', finalizeOrder);
    }

    // Redo click on receipt screen
    if (elements.receiptRedoBtn) {
        elements.receiptRedoBtn.addEventListener('click', function() {
            resetOrder();
            elements.receiptScreen.style.display = 'none';
            elements.mainGrid.style.display = 'grid';
            if (elements.floatingMobileBar) {
                elements.floatingMobileBar.style.display = '';
            }
        });
    }
}

// Calculate totals dynamically and updates DOM
function updateTotals() {
    let kcal = 0;
    let protein = 0;
    let price = 0;
    let receiptItems = [];

    MENU_DATA.categories.forEach(category => {
        const selection = orderState.selections[category.id];
        if (!selection) return;

        if (category.selectionType === 'single') {
            // Single Item selected
            kcal += selection.kcal || 0;
            protein += selection.protein || 0;
            price += selection.price || 0;
            
            let label = `${category.name.replace('Escolha o ', '').replace('Escolha a ', '')}: ${selection.name}`;
            if (category.id === 'milks' && orderState.milkVersion !== 'regular') {
                label += ` (${orderState.milkVersion})`;
            }

            receiptItems.push({
                categoryId: category.id,
                itemId: selection.id,
                name: label,
                price: selection.price,
                details: (selection.kcal > 0 || selection.protein > 0) ? `${selection.kcal || 0} kcal | ${selection.protein || 0}g Prot` : 'Extra'
            });
        } else {
            // Multi items list selected
            selection.forEach(item => {
                kcal += item.kcal || 0;
                protein += item.protein || 0;
                price += item.price || 0;
                receiptItems.push({
                    categoryId: category.id,
                    itemId: item.id,
                    name: `${category.name.replace('Adicione ', '').replace('Toppings & ', '')}: ${item.name}`,
                    price: item.price,
                    details: (item.kcal > 0 || item.protein > 0) ? `${item.kcal || 0} kcal | ${item.protein || 0}g Prot` : 'Extra'
                });
            });
        }
    });

    // Update Totals DOM text
    elements.totalKcal.forEach(el => el.innerText = kcal.toFixed(1));
    elements.totalProtein.forEach(el => el.innerText = protein.toFixed(1) + 'g');
    elements.totalPrice.forEach(el => el.innerText = formatCurrency(price));

    // Update dynamic Receipt panel
    if (receiptItems.length === 0) {
        elements.summaryItems.style.display = 'none';
        elements.emptySummary.style.display = 'block';
    } else {
        elements.emptySummary.style.display = 'none';
        elements.summaryItems.style.display = 'flex';
        elements.summaryItems.innerHTML = receiptItems.map(item => `
            <div class="summary-item">
                <div class="summary-item-left">
                    <span class="item-name">${item.name}</span>
                    <span class="item-details">${item.details}</span>
                </div>
                <div class="summary-item-right">
                    <span class="item-cost">${item.price > 0 ? formatCurrency(item.price) : 'Grátis'}</span>
                    <button class="remove-item-btn" onclick="removeSummaryItem('${item.categoryId}', '${item.itemId}')" title="Remover item">
                        <ion-icon name="close-circle-outline"></ion-icon>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Remove item directly from the summary panel
window.removeSummaryItem = function(catId, itemId) {
    const category = MENU_DATA.categories.find(c => c.id === catId);
    if (!category) return;

    if (category.selectionType === 'single') {
        orderState.selections[catId] = null;
    } else {
        orderState.selections[catId] = orderState.selections[catId].filter(i => i.id !== itemId);
    }
    
    renderMenuCategories();
};

// Reset selections State
function resetOrder() {
    MENU_DATA.categories.forEach(cat => {
        orderState.selections[cat.id] = cat.selectionType === 'single' ? null : [];
    });
    orderState.milkVersion = 'regular';
    renderMenuCategories();
    updateTotals();
}

// Load custom text/banner layouts
function loadSettings() {
    document.getElementById('hero-title').innerText = SETTINGS.heroTitle;
    document.getElementById('hero-subtitle').innerText = SETTINGS.heroSubtitle;
    document.getElementById('mid-banner-title').innerText = SETTINGS.midBannerTitle;
    document.getElementById('mid-banner-subtitle').innerText = SETTINGS.midBannerSubtitle;
    
    document.getElementById('footer-address').innerHTML = SETTINGS.address;
    document.getElementById('footer-subaddress').innerText = SETTINGS.subAddress;
    
    const mapBtn = document.getElementById('footer-map-btn');
    if (mapBtn) {
        mapBtn.href = SETTINGS.mapUrl;
    }

    if (SETTINGS.heroImage) {
        document.documentElement.style.setProperty('--hero-bg-url', `url('${SETTINGS.heroImage}')`);
    }
    if (SETTINGS.midBannerImage) {
        document.documentElement.style.setProperty('--mid-banner-bg-url', `url('${SETTINGS.midBannerImage}')`);
    }
}

// Fetch global settings and menu data asynchronously from Vercel API
async function loadMenuDataAndSettings() {
    try {
        const response = await fetch('/api/get-menu');
        const data = await response.json();
        
        if (data && data.success) {
            // Update local memory and cache if loaded successfully from database
            if (data.menuData) {
                MENU_DATA = migrateFruitPrices(data.menuData);
                localStorage.setItem('power_shake_menu_data', JSON.stringify(MENU_DATA));
            }
            if (data.settings) {
                SETTINGS = data.settings;
                localStorage.setItem('power_shake_settings', JSON.stringify(data.settings));
            }
        }
    } catch (e) {
        console.warn('Backend database offline or failed. Loading from local cache.');
    }
    
    // Refresh dynamic selection lists keys if categories modified
    orderState.selections = {};
    MENU_DATA.categories.forEach(cat => {
        orderState.selections[cat.id] = cat.selectionType === 'single' ? null : [];
    });

    // Execute DOM rendering and settings binding
    loadSettings();
    renderMenuCategories();
    setupGlobalActions();
}


function finalizeOrder() {
    const selectedFruits = orderState.selections['fruits'];
    const selectedMilks = orderState.selections['milks'];
    if (!selectedFruits || !selectedMilks) {
        alert('Por favor, selecione pelo menos uma fruta base e um leite para finalizar seu shake!');
        return;
    }

    // Build the list of chosen items (exactly as we calculate in updateTotals)
    let kcal = 0;
    let protein = 0;
    let price = 0;
    let receiptItems = [];

    MENU_DATA.categories.forEach(category => {
        const selection = orderState.selections[category.id];
        if (!selection) return;

        if (category.selectionType === 'single') {
            kcal += selection.kcal || 0;
            protein += selection.protein || 0;
            price += selection.price || 0;
            
            let label = `${category.name.replace('Escolha o ', '').replace('Escolha a ', '')}: ${selection.name}`;
            if (category.id === 'milks' && orderState.milkVersion !== 'regular') {
                label += ` (${orderState.milkVersion})`;
            }

            receiptItems.push({
                name: label,
                price: selection.price
            });
        } else {
            selection.forEach(item => {
                kcal += item.kcal || 0;
                protein += item.protein || 0;
                price += item.price || 0;
                receiptItems.push({
                    name: `${category.name.replace('Adicione ', '').replace('Toppings & ', '')}: ${item.name}`,
                    price: item.price
                });
            });
        }
    });


    // Render screen
    elements.receiptScreenItems.innerHTML = receiptItems.map(item => `
        <div class="receipt-item-row">
            <span class="receipt-item-name">${item.name}</span>
            <span class="receipt-item-cost">${item.price > 0 ? formatCurrency(item.price) : 'Grátis'}</span>
        </div>
    `).join('');

    elements.receiptKcal.innerText = kcal.toFixed(1);
    elements.receiptProtein.innerText = protein.toFixed(1) + 'g';
    elements.receiptTotalPrice.innerText = formatCurrency(price);

    // Swap views
    elements.mainGrid.style.display = 'none';
    if (elements.floatingMobileBar) {
        elements.floatingMobileBar.style.display = 'none';
    }
    elements.receiptScreen.style.display = 'flex';
    
    // Scroll to top so they see the receipt
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Run initializations
document.addEventListener('DOMContentLoaded', loadMenuDataAndSettings);
