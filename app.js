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
                    price2: 25.90,
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

// Migration: Ensure all categories have a required field (fruits and milks true by default)
MENU_DATA.categories.forEach(cat => {
    if (cat.required === undefined) {
        cat.required = ['fruits', 'milks'].includes(cat.id);
    }
});
if (!SETTINGS) {
    SETTINGS = DEFAULT_SETTINGS;
    localStorage.setItem('power_shake_settings', JSON.stringify(DEFAULT_SETTINGS));
}

// Application Selection State
let orderState = {
    selections: {}, // Map of categoryId -> selectedItem (single) OR array of selectedItems (multi)
    milkVersion: 'regular', // Keep Niho/Molico version check
    wheyScoops: 1 // Default to 1 scoop
};

// Initialize selection structures in orderState
MENU_DATA.categories.forEach(cat => {
    orderState.selections[cat.id] = cat.selectionType === 'single' ? null : [];
});

// Navigation Wizard State
let isDashboardMode = true;
let activeCategoryId = 'fruits';

// DOM Elements
const elements = {
    categoryDashboard: document.getElementById('category-dashboard'),
    categorySelectionView: document.getElementById('category-selection-view'),
    backToDashboardBtn: document.getElementById('back-to-dashboard-btn'),
    selectionCategoryTitle: document.getElementById('selection-category-title'),
    selectionCategorySubtitle: document.getElementById('selection-category-subtitle'),
    selectionItemsGrid: document.getElementById('selection-items-grid'),
    prevStepBtn: document.getElementById('prev-step-btn'),
    nextStepBtn: document.getElementById('next-step-btn'),
    promoBanner: document.getElementById('promo-mid-banner'),
    
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
    floatingMobileBar: document.querySelector('.floating-mobile-bar'),
    
    // Name Modal DOM
    nameModal: document.getElementById('name-modal'),
    nameForm: document.getElementById('name-modal-form'),
    clientNameInput: document.getElementById('client-name-input'),
    nameModalCloseBtn: document.getElementById('name-modal-close-btn'),
    nameModalCancelBtn: document.getElementById('name-modal-cancel-btn'),
    receiptSuccessTitle: document.getElementById('receipt-success-title'),
    receiptSuccessMessage: document.getElementById('receipt-success-message')
};

// Format currency
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Custom Toast notification helper
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const card = document.createElement('div');
    card.className = `toast-card ${type}`;
    
    let iconName = 'information-circle-outline';
    if (type === 'success') iconName = 'checkmark-circle-outline';
    else if (type === 'error') iconName = 'alert-circle-outline';
    else if (type === 'warning') iconName = 'warning-outline';
    
    card.innerHTML = `
        <div class="toast-icon">
            <ion-icon name="${iconName}"></ion-icon>
        </div>
        <div class="toast-content">${message}</div>
    `;
    
    container.appendChild(card);
    
    // Automatically remove after 3.5 seconds
    setTimeout(() => {
        card.style.animation = 'toastFadeOut 0.3s ease forwards';
        card.addEventListener('animationend', () => {
            card.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        });
    }, 3500);
}

// Update wizard next step button label dynamically (Avançar vs Pular)
function updateNextStepButtonLabel() {
    if (!elements.nextStepBtn || isDashboardMode) return;
    
    const category = MENU_DATA.categories.find(c => c.id === activeCategoryId);
    if (!category) return;
    
    const catIndex = MENU_DATA.categories.findIndex(c => c.id === activeCategoryId);
    const isLast = catIndex === MENU_DATA.categories.length - 1;
    const selection = orderState.selections[category.id];
    const hasSelection = Array.isArray(selection) ? selection.length > 0 : !!selection;
    
    if (isLast) {
        if (category.required || hasSelection) {
            elements.nextStepBtn.innerHTML = `Concluir <ion-icon name="checkmark-outline"></ion-icon>`;
        } else {
            elements.nextStepBtn.innerHTML = `Pular <ion-icon name="checkmark-outline"></ion-icon>`;
        }
    } else {
        if (category.required || hasSelection) {
            elements.nextStepBtn.innerHTML = `Avançar <ion-icon name="chevron-forward-outline"></ion-icon>`;
        } else {
            elements.nextStepBtn.innerHTML = `Pular <ion-icon name="chevron-forward-outline"></ion-icon>`;
        }
    }
}

function getCategoryIcon(categoryId) {
    const maps = {
        fruits: '🍌',
        milks: '🥛',
        whey: '💪',
        toppings: '🍫',
        peanutButters: '🥜',
        supplements: '⚡'
    };
    return maps[categoryId] || '✨';
}

function getCategorySelectionSummary(category) {
    const selection = orderState.selections[category.id];
    if (!selection) return 'Pendente';
    
    if (category.selectionType === 'single') {
        let label = selection.name;
        if (category.id === 'milks' && orderState.milkVersion !== 'regular') {
            label += ` (${orderState.milkVersion})`;
        }
        return label;
    } else {
        if (Array.isArray(selection) && selection.length > 0) {
            return selection.map(i => i.name).join(', ');
        }
        return 'Pendente';
    }
}

// Render dynamic sections from categories list
function renderMenuCategories() {
    // Clear DOM containers
    if (elements.categoryDashboard) elements.categoryDashboard.innerHTML = '';
    if (elements.selectionItemsGrid) elements.selectionItemsGrid.innerHTML = '';

    if (isDashboardMode) {
        // Render Category Dashboard (Main Screen)
        if (elements.categorySelectionView) elements.categorySelectionView.style.display = 'none';
        if (elements.categoryDashboard) elements.categoryDashboard.style.display = 'grid';
        if (elements.promoBanner) {
            elements.promoBanner.style.display = 'block';
        }

        MENU_DATA.categories.forEach(category => {
            if (!category.items || category.items.length === 0) return;

            const summary = getCategorySelectionSummary(category);
            const isFilled = summary !== 'Pendente';
            
            // Choose image or icon
            let mediaHtml = '';
            if (category.image) {
                mediaHtml = `<img src="${category.image}" class="category-card-img" alt="${category.name}">`;
            } else {
                const icon = category.icon || getCategoryIcon(category.id);
                mediaHtml = `<div class="category-card-icon">${icon}</div>`;
            }

            const cardHtml = `
                <div class="category-card ${isFilled ? 'filled' : ''}" data-category-id="${category.id}">
                    <div class="category-card-check">✓</div>
                    ${mediaHtml}
                    <div class="category-card-title">${category.name.replace('Escolha a ', '').replace('Escolha o ', '').replace('Adicione ', '')}</div>
                    <div class="category-card-status">${summary}</div>
                </div>
            `;
            if (elements.categoryDashboard) elements.categoryDashboard.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Add event listeners to category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', function() {
                const catId = this.dataset.categoryId;
                isDashboardMode = false;
                activeCategoryId = catId;
                renderMenuCategories();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

    } else {
        // Render Active Step (Wizard Screen)
        if (elements.categoryDashboard) elements.categoryDashboard.style.display = 'none';
        if (elements.promoBanner) {
            elements.promoBanner.style.display = 'none';
        }
        if (elements.categorySelectionView) elements.categorySelectionView.style.display = 'block';

        const category = MENU_DATA.categories.find(c => c.id === activeCategoryId);
        if (!category) return;

        // Render header title & subtitle
        if (elements.selectionCategoryTitle) elements.selectionCategoryTitle.innerText = category.name;
        if (elements.selectionCategorySubtitle) elements.selectionCategorySubtitle.innerText = category.subtitle;

        // Render items inside step (filtering outOfStock items)
        const availableItems = (category.items || []).filter(i => !i.outOfStock);

        if (category.id === 'whey' && availableItems.length === 1) {
            // Whey single layout
            const item = availableItems[0];
            const isSelected = orderState.selections[category.id] !== null;
            
            const mediaHtml = item.image 
                ? `<img src="${item.image}" class="item-card-image" alt="${item.name}">` 
                : `<span class="whey-icon">${item.icon || '💪'}</span>`;

            const scoops = orderState.wheyScoops || 1;
            const currentWheyPrice = (isSelected && scoops === 2 && item.price2 !== undefined && item.price2 > 0) ? item.price2 : (item.price * scoops);
            
            let currentKcal = item.kcal || 0;
            let currentProtein = item.protein || 0;
            if (isSelected && scoops === 2) {
                currentKcal *= 2;
                currentProtein *= 2;
            }
            
            let wheyMacros = '';
            if (currentKcal > 0 && currentProtein > 0) {
                wheyMacros = `${currentKcal} kcal · ${currentProtein}g prot`;
            } else if (currentKcal > 0) {
                wheyMacros = `${currentKcal} kcal`;
            } else if (currentProtein > 0) {
                wheyMacros = `${currentProtein}g prot`;
            }
            const wheyMacrosHtml = wheyMacros ? `<span class="macros">${wheyMacros}</span>` : '';

            const wheyHtml = `
                <div class="whey-toggle-card ${isSelected ? 'selected' : ''}" id="whey-card" data-category="${category.id}" data-id="${item.id}" style="grid-column: 1 / -1;">
                    ${mediaHtml}
                    <div class="whey-info">
                        <h4>${item.name}</h4>
                        <p>${item.description || ''}</p>
                        ${isSelected ? `
                            <div class="sub-options-container" onclick="event.stopPropagation()" style="display: flex; margin-top: 10px; border-top: 1px dashed rgba(255, 255, 255, 0.1); padding-top: 8px;">
                                <div class="segmented-selector">
                                    <label class="segmented-option">
                                        <input type="radio" name="whey-single-scoops" value="1" ${scoops === 1 ? 'checked' : ''}>
                                        <span class="segmented-option-label">1 Scoop (${item.price > 0 ? formatCurrency(item.price) : 'Incluso'})</span>
                                    </label>
                                    <label class="segmented-option">
                                        <input type="radio" name="whey-single-scoops" value="2" ${scoops === 2 ? 'checked' : ''}>
                                        <span class="segmented-option-label">2 Scoops (${(item.price2 > 0) ? formatCurrency(item.price2) : formatCurrency(item.price * 2)})</span>
                                    </label>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="whey-price">
                        <span class="price">${formatCurrency(currentWheyPrice)}</span>
                        ${wheyMacrosHtml}
                    </div>
                </div>
            `;
            if (elements.selectionItemsGrid) elements.selectionItemsGrid.innerHTML = wheyHtml;

            const wheyCard = document.getElementById('whey-card');
            if (wheyCard) {
                wheyCard.addEventListener('click', function() {
                    const catId = this.dataset.category;
                    const itemId = this.dataset.id;
                    const item = category.items.find(i => i.id === itemId);
                    
                    if (orderState.selections[catId]) {
                        orderState.selections[catId] = null;
                    } else {
                        orderState.selections[catId] = item;
                        orderState.wheyScoops = 1;
                    }
                    renderMenuCategories();
                });
            }
        } else {
            // General step card grid
            if (elements.selectionItemsGrid) {
                if (availableItems.length === 0) {
                    elements.selectionItemsGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-secondary); padding:40px 0; font-family:'Outfit',sans-serif;">Nenhum produto disponível nesta categoria no momento.</div>`;
                } else {
                    elements.selectionItemsGrid.innerHTML = renderCards(category, availableItems);
                }
            }
        }

        // Configure step navigation footer buttons
        const catIndex = MENU_DATA.categories.findIndex(c => c.id === activeCategoryId);
        
        // Prev button label & behavior
        if (elements.prevStepBtn) {
            if (catIndex === 0) {
                elements.prevStepBtn.innerHTML = `<ion-icon name="arrow-back-outline"></ion-icon> Início`;
            } else {
                elements.prevStepBtn.innerHTML = `<ion-icon name="chevron-back-outline"></ion-icon> Voltar`;
            }
        }

        // Next button label & behavior
        updateNextStepButtonLabel();

        setupEventListeners();
    }
}

// Render product card grid
function renderCards(category, visibleItems) {
    const itemsToRender = (visibleItems || category.items || []).filter(item => !item.outOfStock);
    return itemsToRender.map(item => {
        const isSelected = category.selectionType === 'single'
            ? (orderState.selections[category.id] && orderState.selections[category.id].id === item.id)
            : (orderState.selections[category.id].some(i => i.id === item.id));

        // Sub options render (versions radios for milk / scoops for whey)
        let subOptionsHtml = '';
        if (category.id === 'milks' && item.versions && isSelected) {
            subOptionsHtml = `
                <div class="sub-options-container" onclick="event.stopPropagation()">
                    <div class="segmented-selector">
                        ${item.versions.map(version => `
                            <label class="segmented-option">
                                <input type="radio" name="version-${item.id}" value="${version}" ${version === orderState.milkVersion ? 'checked' : ''}>
                                <span class="segmented-option-label">${version === 'regular' ? 'Padrão' : version}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (category.id === 'whey' && isSelected) {
            const scoops = orderState.wheyScoops || 1;
            subOptionsHtml = `
                <div class="sub-options-container" onclick="event.stopPropagation()">
                    <div class="segmented-selector">
                        <label class="segmented-option">
                            <input type="radio" name="scoops-${item.id}" value="1" ${scoops === 1 ? 'checked' : ''}>
                            <span class="segmented-option-label">1 Scoop (${item.price > 0 ? formatCurrency(item.price) : 'Incluso'})</span>
                        </label>
                        <label class="segmented-option">
                            <input type="radio" name="scoops-${item.id}" value="2" ${scoops === 2 ? 'checked' : ''}>
                            <span class="segmented-option-label">2 Scoops (${item.price2 > 0 ? formatCurrency(item.price2) : formatCurrency(item.price * 2)})</span>
                        </label>
                    </div>
                </div>
            `;
        }

        // Photo vs Emoji render check
        const mediaHtml = item.image 
            ? `<div class="item-card-media"><img src="${item.image}" class="item-card-image" alt="${item.name}"></div>` 
            : `<div class="item-card-media"><span class="item-card-icon">${item.icon || '🥤'}</span></div>`;

        // Price tags: hide or show price
        let displayPrice = item.price || 0;
        if (category.id === 'whey' && isSelected) {
            const scoops = orderState.wheyScoops || 1;
            displayPrice = (scoops === 2 && item.price2 !== undefined && item.price2 > 0) ? item.price2 : (item.price * scoops);
        }
        const priceHtml = `<div class="item-card-price">${displayPrice > 0 ? formatCurrency(displayPrice) : 'Incluso'}</div>`;

        // Macros tag check
        const showMacros = ['fruits', 'milks', 'whey', 'toppings'].includes(category.id);
        let macrosHtml = '';
        if (showMacros) {
            const scoopsMultiplier = (category.id === 'whey' && isSelected) ? (orderState.wheyScoops || 1) : 1;
            const kcalVal = (item.kcal || 0) * scoopsMultiplier;
            const proteinVal = (item.protein || 0) * scoopsMultiplier;
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
                <div>
                    ${mediaHtml}
                    <div class="item-card-title-container">
                        <div class="item-card-title">${item.name}</div>
                        <div class="card-checkbox"></div>
                    </div>
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
                    
                    // Default version/scoops selector
                    const radioChecked = this.querySelector('input[type="radio"]:checked');
                    if (radioChecked) {
                        if (catId === 'milks') {
                            orderState.milkVersion = radioChecked.value;
                        } else if (catId === 'whey') {
                            orderState.wheyScoops = parseInt(radioChecked.value) || 1;
                        }
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
            
            // Re-render to show/hide sub options radios if milk or whey selected
            if (catId === 'milks' || catId === 'whey') {
                renderMenuCategories();
            } else {
                updateTotals();
            }
        });
    });

    // Sub-options radio buttons (Leite versions / Whey scoops)
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function(e) {
            if (this.name.startsWith('version-')) {
                orderState.milkVersion = this.value;
            } else if (this.name.startsWith('scoops-') || this.name === 'whey-single-scoops') {
                orderState.wheyScoops = parseInt(this.value) || 1;
            }
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

    // Wizard navigation button events
    if (elements.backToDashboardBtn) {
        elements.backToDashboardBtn.addEventListener('click', function() {
            isDashboardMode = true;
            renderMenuCategories();
        });
    }

    if (elements.prevStepBtn) {
        elements.prevStepBtn.addEventListener('click', function() {
            const index = MENU_DATA.categories.findIndex(c => c.id === activeCategoryId);
            if (index > 0) {
                activeCategoryId = MENU_DATA.categories[index - 1].id;
                renderMenuCategories();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                isDashboardMode = true;
                renderMenuCategories();
            }
        });
    }

    if (elements.nextStepBtn) {
        elements.nextStepBtn.addEventListener('click', function() {
            const index = MENU_DATA.categories.findIndex(c => c.id === activeCategoryId);
            const category = MENU_DATA.categories[index];
            
            // Check if current category is required and has no selection
            if (category && category.required) {
                const selection = orderState.selections[category.id];
                const hasSelection = Array.isArray(selection) ? selection.length > 0 : !!selection;
                if (!hasSelection) {
                    showToast('Selecione pelo menos um item!', 'warning');
                    return;
                }
            }

            if (index < MENU_DATA.categories.length - 1) {
                activeCategoryId = MENU_DATA.categories[index + 1].id;
                renderMenuCategories();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                isDashboardMode = true;
                renderMenuCategories();
                // Scroll to checkout sidebar so they see totals and checkout button
                const summaryCard = document.querySelector('.summary-card');
                if (summaryCard) {
                    summaryCard.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // Finalize order click
    if (elements.checkoutBtn) {
        elements.checkoutBtn.addEventListener('click', finalizeOrder);
    }

    // Name Modal events
    if (elements.nameModalCloseBtn) {
        elements.nameModalCloseBtn.addEventListener('click', function () {
            elements.nameModal.style.display = 'none';
        });
    }
    if (elements.nameModalCancelBtn) {
        elements.nameModalCancelBtn.addEventListener('click', function () {
            elements.nameModal.style.display = 'none';
        });
    }
    window.addEventListener('click', function (e) {
        if (e.target === elements.nameModal) {
            elements.nameModal.style.display = 'none';
        }
    });
    if (elements.nameForm) {
        elements.nameForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = elements.clientNameInput.value.trim();
            if (name) {
                elements.nameModal.style.display = 'none';
                submitOrder(name);
            }
        });
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
            let itemPrice = selection.price || 0;
            let itemKcal = selection.kcal || 0;
            let itemProtein = selection.protein || 0;
            
            let label = `${category.name.replace('Escolha o ', '').replace('Escolha a ', '').replace('Adicione ', '')}: ${selection.name}`;
            if (category.id === 'milks' && orderState.milkVersion !== 'regular') {
                label += ` (${orderState.milkVersion})`;
            } else if (category.id === 'whey') {
                const scoops = orderState.wheyScoops || 1;
                itemPrice = (scoops === 2 && selection.price2 !== undefined && selection.price2 > 0) ? selection.price2 : (selection.price * scoops);
                itemKcal = (selection.kcal || 0) * scoops;
                itemProtein = (selection.protein || 0) * scoops;
                label += ` (${scoops} scoop${scoops > 1 ? 's' : ''})`;
            }

            kcal += itemKcal;
            protein += itemProtein;
            price += itemPrice;

            receiptItems.push({
                categoryId: category.id,
                itemId: selection.id,
                name: label,
                price: itemPrice,
                details: (itemKcal > 0 || itemProtein > 0) ? `${itemKcal || 0} kcal | ${itemProtein || 0}g Prot` : 'Extra'
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
    updateNextStepButtonLabel();
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
    orderState.wheyScoops = 1;
    isDashboardMode = true;
    activeCategoryId = 'fruits';
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
    // Check all required categories dynamically
    const missingRequired = [];
    MENU_DATA.categories.forEach(category => {
        if (category.required) {
            const selection = orderState.selections[category.id];
            const hasSelection = Array.isArray(selection) ? selection.length > 0 : !!selection;
            if (!hasSelection) {
                // Get clean category name
                const cleanName = category.name.replace('Escolha a ', '').replace('Escolha o ', '').replace('Adicione ', '');
                missingRequired.push(cleanName);
            }
        }
    });
    
    if (missingRequired.length > 0) {
        showToast(`Por favor, selecione os itens obrigatórios: ${missingRequired.join(', ')} para finalizar seu shake!`, 'warning');
        return;
    }

    // Open name modal
    if (elements.nameModal) {
        elements.clientNameInput.value = '';
        elements.nameModal.style.display = 'flex';
        elements.clientNameInput.focus();
    }
}

function submitOrder(clientName) {
    // Build the list of chosen items (exactly as we calculate in updateTotals)
    let kcal = 0;
    let protein = 0;
    let price = 0;
    let receiptItems = [];

    MENU_DATA.categories.forEach(category => {
        const selection = orderState.selections[category.id];
        if (!selection) return;

        if (category.selectionType === 'single') {
            let itemPrice = selection.price || 0;
            let itemKcal = selection.kcal || 0;
            let itemProtein = selection.protein || 0;
            
            let label = `${category.name.replace('Escolha o ', '').replace('Escolha a ', '').replace('Adicione ', '')}: ${selection.name}`;
            let details = '';
            if (category.id === 'milks' && orderState.milkVersion !== 'regular') {
                label += ` (${orderState.milkVersion})`;
                details = `(${orderState.milkVersion})`;
            } else if (category.id === 'whey') {
                const scoops = orderState.wheyScoops || 1;
                itemPrice = (scoops === 2 && selection.price2 !== undefined && selection.price2 > 0) ? selection.price2 : (selection.price * scoops);
                itemKcal = (selection.kcal || 0) * scoops;
                itemProtein = (selection.protein || 0) * scoops;
                label += ` (${scoops} scoop${scoops > 1 ? 's' : ''})`;
                details = `(${scoops} scoop${scoops > 1 ? 's' : ''})`;
            }

            kcal += itemKcal;
            protein += itemProtein;
            price += itemPrice;

            receiptItems.push({
                name: label,
                categoryName: category.name,
                categoryId: category.id,
                itemName: selection.name,
                itemDetails: details,
                price: itemPrice
            });
        } else {
            selection.forEach(item => {
                kcal += item.kcal || 0;
                protein += item.protein || 0;
                price += item.price || 0;
                receiptItems.push({
                    name: `${category.name.replace('Adicione ', '').replace('Toppings & ', '')}: ${item.name}`,
                    categoryName: category.name,
                    categoryId: category.id,
                    itemName: item.name,
                    itemDetails: '',
                    price: item.price
                });
            });
        }
    });

    const orderId = 'PS-' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
        id: orderId,
        clientName: clientName,
        items: receiptItems,
        totalKcal: kcal,
        totalProtein: protein,
        totalPrice: price,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // 1. Save to backend API (fails silently/logged if backend offline)
    fetch('/api/save-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    }).then(res => res.json())
      .then(data => {
          if (!data.success) {
              console.warn('API save-order returned false:', data.error);
          }
      })
      .catch(err => console.error('Error saving order to backend:', err));

    // 2. Save to LocalStorage as secondary store/fallback
    try {
        let localOrders = JSON.parse(localStorage.getItem('power_shake_orders') || '[]');
        localOrders.unshift(orderData);
        localStorage.setItem('power_shake_orders', JSON.stringify(localOrders));
    } catch (e) {
        console.error('Failed to save order to localStorage:', e);
    }

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

    // Personalize Success message with Customer Name
    if (elements.receiptSuccessTitle) {
        elements.receiptSuccessTitle.innerText = `Obrigado, ${clientName}!`;
    }
    if (elements.receiptSuccessMessage) {
        elements.receiptSuccessMessage.innerHTML = `Seu shake personalizado está sendo preparado na cozinha.<br><strong style="color:var(--accent); font-size:1.1rem;">Código do Pedido: #${orderId}</strong>`;
    }

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
