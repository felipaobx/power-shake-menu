// Power Shake Default Database (List of Categories Schema)
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

// Database State
let MENU_DATA = JSON.parse(localStorage.getItem('power_shake_menu_data'));
let SETTINGS = JSON.parse(localStorage.getItem('power_shake_settings')) || DEFAULT_SETTINGS;

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

// Migration Check: If old data structure doesn't support categories lists, reload
if (MENU_DATA && !MENU_DATA.categories) {
    MENU_DATA = DEFAULT_MENU_DATA;
    localStorage.setItem('power_shake_menu_data', JSON.stringify(DEFAULT_MENU_DATA));
} else if (!MENU_DATA) {
    MENU_DATA = DEFAULT_MENU_DATA;
    localStorage.setItem('power_shake_menu_data', JSON.stringify(DEFAULT_MENU_DATA));
} else {
    MENU_DATA = migrateFruitPrices(MENU_DATA);
}

// Migration Check: Ensure all categories have a required status property
MENU_DATA.categories.forEach(cat => {
    if (cat.required === undefined) {
        cat.required = ['fruits', 'milks'].includes(cat.id);
    }
});

// Temporary file uploader state
let uploadedProductImageBase64 = '';
let uploadedCategoryImageBase64 = '';

// DOM selectors
const dom = {
    // General Settings Inputs
    heroTitle: document.getElementById('hero-title-input'),
    heroSubtitle: document.getElementById('hero-subtitle-input'),
    heroPreview: document.getElementById('hero-image-preview'),
    heroFile: document.getElementById('hero-image-file'),
    
    midTitle: document.getElementById('mid-title-input'),
    midSubtitle: document.getElementById('mid-subtitle-input'),
    midPreview: document.getElementById('mid-image-preview'),
    midFile: document.getElementById('mid-image-file'),

    address: document.getElementById('address-input'),
    subaddress: document.getElementById('subaddress-input'),
    mapUrl: document.getElementById('mapurl-input'),

    // Category Select and Table
    categorySelect: document.getElementById('category-select'),
    categorySelectionType: document.getElementById('category-selection-type'),
    categoryRequiredToggle: document.getElementById('category-required-toggle'),
    tableHeaders: document.getElementById('table-headers'),
    tableBody: document.getElementById('items-table-body'),
    addItemBtn: document.getElementById('add-item-btn'),
    addCategoryBtn: document.getElementById('add-category-btn'),
    deleteCategoryBtn: document.getElementById('delete-category-btn'),

    // Bottom Bar Actions
    saveSettingsBtn: document.getElementById('save-settings-btn'),
    resetDefaultsBtn: document.getElementById('reset-defaults-btn'),

    // Item Form Modal
    itemModal: document.getElementById('editor-modal'),
    modalTitle: document.getElementById('modal-form-title'),
    modalForm: document.getElementById('item-editor-form'),
    editItemId: document.getElementById('edit-item-id'),
    itemName: document.getElementById('item-name-input'),
    itemMediaType: document.getElementById('item-media-type'),
    itemIcon: document.getElementById('item-icon-input'),
    productPreview: document.getElementById('product-image-preview'),
    productFile: document.getElementById('product-image-file'),
    itemKcal: document.getElementById('item-kcal-input'),
    itemProtein: document.getElementById('item-protein-input'),
    itemPrice: document.getElementById('item-price-input'),
    itemDesc: document.getElementById('item-desc-input'),
    itemVersions: document.getElementById('item-versions-input'),
    itemAvailableCheckbox: document.getElementById('item-available-checkbox'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalCancelBtn: document.getElementById('modal-cancel-btn'),

    // Category Form Modal
    catModal: document.getElementById('category-modal'),
    catForm: document.getElementById('category-editor-form'),
    editCategoryBtn: document.getElementById('edit-category-btn'),
    editCategoryId: document.getElementById('edit-category-id'),
    catName: document.getElementById('cat-name-input'),
    catSubtitle: document.getElementById('cat-subtitle-input'),
    catPosition: document.getElementById('cat-position-input'),
    catSelection: document.getElementById('cat-selection-input'),
    catRequired: document.getElementById('cat-required-input'),
    catMediaType: document.getElementById('cat-media-type'),
    catIcon: document.getElementById('cat-icon-input'),
    catImageFile: document.getElementById('cat-image-file'),
    catImagePreview: document.getElementById('cat-image-preview'),
    catCloseBtn: document.getElementById('category-modal-close-btn'),
    catCancelBtn: document.getElementById('category-modal-cancel-btn')
};

// Switch between navigation tabs
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    
    const clickedTab = Array.from(tabs).find(t => t.getAttribute('onclick').includes(tabId));
    if (clickedTab) clickedTab.classList.add('active');

    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(c => c.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');

    if (tabId === 'tab-items') {
        populateCategoryDropdown();
        renderItemsTable();
    }

    if (tabId === 'tab-orders') {
        loadOrders();
        startOrdersPolling();
    } else {
        stopOrdersPolling();
    }
}

// Populate the Category select options dynamically from MENU_DATA.categories
function populateCategoryDropdown(selectedId = null) {
    const activeId = selectedId || dom.categorySelect.value || 'fruits';
    dom.categorySelect.innerHTML = MENU_DATA.categories.map(cat => {
        let suffix = cat.isStep ? ' (Passo)' : ' (Extra)';
        return `<option value="${cat.id}" ${cat.id === activeId ? 'selected' : ''}>${cat.name}${suffix}</option>`;
    }).join('');
}

// Load general text uploader states
function loadGeneralSettings() {
    dom.heroTitle.value = SETTINGS.heroTitle;
    dom.heroSubtitle.value = SETTINGS.heroSubtitle;
    dom.heroPreview.style.backgroundImage = `url('${SETTINGS.heroImage}')`;

    dom.midTitle.value = SETTINGS.midBannerTitle;
    dom.midSubtitle.value = SETTINGS.midBannerSubtitle;
    dom.midPreview.style.backgroundImage = `url('${SETTINGS.midBannerImage}')`;

    dom.address.value = SETTINGS.address;
    dom.subaddress.value = SETTINGS.subAddress;
    dom.mapUrl.value = SETTINGS.mapUrl;
}

// Convert files to Base64 strings
function setupUploaders() {
    dom.heroFile.addEventListener('change', function(e) {
        handleImageUpload(e.target.files[0], 'heroImage', dom.heroPreview);
    });

    dom.midFile.addEventListener('change', function(e) {
        handleImageUpload(e.target.files[0], 'midBannerImage', dom.midPreview);
    });

    dom.productFile.addEventListener('change', function(e) {
        if (e.target.files[0]) {
            if (e.target.files[0].size > 5 * 1024 * 1024) {
                showToast('A imagem é muito grande! Escolha uma foto com tamanho menor que 5MB.', 'warning');
                return;
            }
            resizeProductImage(e.target.files[0], function(resizedBase64) {
                uploadedProductImageBase64 = resizedBase64;
                dom.productPreview.style.backgroundImage = `url('${resizedBase64}')`;
            });
        }
    });
}

// Helper to resize product image to 600x600 pixels (center crop aspect ratio)
function resizeProductImage(file, callback) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');

            const w = img.width;
            const h = img.height;
            let sx = 0, sy = 0, sw = w, sh = h;

            if (w > h) {
                sw = h;
                sx = (w - h) / 2;
            } else {
                sh = w;
                sy = (h - w) / 2;
            }

            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 600, 600);

            const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            const quality = type === 'image/jpeg' ? 0.85 : undefined;
            const resizedBase64 = canvas.toDataURL(type, quality);
            callback(resizedBase64);
        };
        img.onerror = function() {
            showToast('Erro ao processar imagem. Tente outro arquivo.', 'danger');
        };
        img.src = evt.target.result;
    };
    reader.onerror = function() {
        showToast('Erro ao ler arquivo.', 'danger');
    };
    reader.readAsDataURL(file);
}

function handleImageUpload(file, stateKey, previewEl) {
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
        showToast('A imagem é muito grande! Escolha um arquivo menor que 2.5MB.', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
        SETTINGS[stateKey] = evt.target.result;
        previewEl.style.backgroundImage = `url('${evt.target.result}')`;
    };
    reader.readAsDataURL(file);
}

// Render Category Product list table
function renderItemsTable(resetSearch = false) {
    if (resetSearch) {
        const searchInput = document.getElementById('item-search-input');
        if (searchInput) searchInput.value = '';
    }
    const catId = dom.categorySelect.value || 'fruits';
    const category = MENU_DATA.categories.find(c => c.id === catId);
    
    dom.tableHeaders.innerHTML = '';
    dom.tableBody.innerHTML = '';

    if (!category) return;
    
    // Set selection type select element
    if (dom.categorySelectionType) {
        dom.categorySelectionType.value = category.selectionType || 'single';
    }
    
    // Set required toggle checkbox value
    if (dom.categoryRequiredToggle) {
        dom.categoryRequiredToggle.checked = !!category.required;
    }

    // Headers set
    let headers = ['Imagem / Ícone', 'Nome'];
    const showPrice = true;
    const showMacros = ['fruits', 'milks', 'whey', 'toppings'].includes(category.id);
    const showDesc = category.id === 'supplements' || category.id === 'milks';

    if (showPrice) headers.push('Preço');
    if (showMacros) headers.push('Kcal', 'Proteína');
    if (showDesc) headers.push(category.id === 'milks' ? 'Versões / Desc' : 'Observação');
    headers.push('Disponível');
    headers.push('Ações');

    dom.tableHeaders.innerHTML = headers.map(h => `<th>${h}</th>`).join('');

    let items = category.items || [];
    
    // Search/filter items
    const searchInput = document.getElementById('item-search-input');
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (searchVal) {
        items = items.filter(item => item.name.toLowerCase().includes(searchVal));
    }

    if (items.length === 0) {
        const message = searchVal 
            ? 'Nenhum produto corresponde à sua busca nesta categoria.'
            : 'Nenhum produto cadastrado nesta categoria.';
        dom.tableBody.innerHTML = `<tr><td colspan="${headers.length}" style="text-align:center; color:var(--text-muted); padding: 30px 0;">${message}</td></tr>`;
        return;
    }

    dom.tableBody.innerHTML = items.map(item => {
        // Render either Real Photo thumbnail or Emoji icon
        const mediaHtml = item.image 
            ? `<img src="${item.image}" class="table-item-img" alt="${item.name}">`
            : `<span style="font-size:1.6rem;">${item.icon || '🥤'}</span>`;

        let cols = [
            `<td onclick="openItemEditor('${item.id}')" style="cursor: pointer;" title="Clique para editar mídia">${mediaHtml}</td>`,
            `<td class="item-name-cell" onclick="startInlineEdit(this, '${category.id}', '${item.id}', 'name')" style="cursor: pointer;" title="Clique para editar">${item.name}</td>`
        ];

        if (showPrice) {
            cols.push(`<td class="item-price" onclick="startInlineEdit(this, '${category.id}', '${item.id}', 'price')" style="cursor: pointer;" title="Clique para editar">${formatCurrency(item.price || 0)}</td>`);
        }
        if (showMacros) {
            cols.push(`<td onclick="startInlineEdit(this, '${category.id}', '${item.id}', 'kcal')" style="cursor: pointer;" title="Clique para editar">${item.kcal || 0} kcal</td>`);
            cols.push(`<td onclick="startInlineEdit(this, '${category.id}', '${item.id}', 'protein')" style="cursor: pointer;" title="Clique para editar">${item.protein || 0}g</td>`);
        }
        if (showDesc) {
            if (category.id === 'milks') {
                let vers = item.versions ? item.versions.join(', ') : 'Padrão';
                cols.push(`<td><div class="item-badge">${item.description || '200ml'}</div><div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">Versões: ${vers}</div></td>`);
            } else {
                cols.push(`<td>${item.description || ''}</td>`);
            }
        }

        // Availability checkbox column
        const isOutOfStock = !!item.outOfStock;
        cols.push(`
            <td>
                <label class="availability-switch" style="display: inline-flex; align-items: center; justify-content: center; cursor: pointer; width: 100%;">
                    <input type="checkbox" ${!isOutOfStock ? 'checked' : ''} onchange="toggleItemAvailability('${category.id}', '${item.id}', this)" style="accent-color: var(--accent); width: 18px; height: 18px; cursor: pointer;">
                </label>
            </td>
        `);

        // Action controls
        const isDefaultWhey = category.id === 'whey' && item.id === 'whey_100';
        const deleteBtn = isDefaultWhey
            ? `<button class="action-btn" style="opacity:0.3; cursor:not-allowed;" title="Item padrão Whey não pode ser excluído"><ion-icon name="trash-outline"></ion-icon></button>`
            : `<button class="action-btn delete-btn" onclick="deleteMenuItem('${item.id}')" title="Excluir"><ion-icon name="trash-outline"></ion-icon></button>`;

        const upBtn = `<button class="action-btn move-btn" onclick="moveItemUp('${item.id}')" title="Mover para cima"><ion-icon name="arrow-up-outline"></ion-icon></button>`;
        const downBtn = `<button class="action-btn move-btn" onclick="moveItemDown('${item.id}')" title="Mover para baixo"><ion-icon name="arrow-down-outline"></ion-icon></button>`;

        cols.push(`
            <td>
                <div class="action-buttons">
                    ${upBtn}
                    ${downBtn}
                    <button class="action-btn edit-btn" onclick="openItemEditor('${item.id}')" title="Editar completo"><ion-icon name="create-outline"></ion-icon></button>
                    ${deleteBtn}
                </div>
            </td>
        `);

        return `<tr>${cols.join('')}</tr>`;
    }).join('');
}

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

window.startInlineEdit = function(element, categoryId, itemId, field) {
    // Avoid double edit triggering
    if (element.querySelector('input')) return;

    const category = MENU_DATA.categories.find(c => c.id === categoryId);
    if (!category) return;
    const item = category.items.find(i => i.id === itemId);
    if (!item) return;

    // Get current raw value
    let currentVal;
    if (field === 'price') currentVal = item.price || 0;
    else if (field === 'kcal') currentVal = item.kcal || 0;
    else if (field === 'protein') currentVal = item.protein || 0;
    else currentVal = item.name || '';

    const input = document.createElement('input');
    input.type = ['price', 'kcal', 'protein'].includes(field) ? 'number' : 'text';
    if (field === 'price') {
        input.step = '0.01';
    } else if (field === 'protein') {
        input.step = 'any';
    }
    input.className = 'dashboard-inline-input';
    input.value = currentVal;

    element.innerHTML = '';
    element.appendChild(input);
    input.focus();
    input.select();

    const saveChanges = () => {
        let newVal = input.value.trim();
        if (field === 'price') {
            newVal = parseFloat(newVal) || 0;
            item.price = newVal;
            element.innerHTML = formatCurrency(newVal);
        } else if (field === 'kcal') {
            newVal = parseInt(newVal) || 0;
            item.kcal = newVal;
            element.innerHTML = newVal + ' kcal';
        } else if (field === 'protein') {
            newVal = parseFloat(newVal) || 0;
            item.protein = newVal;
            element.innerHTML = newVal + 'g';
        } else {
            if (!newVal) newVal = item.name;
            item.name = newVal;
            element.innerHTML = newVal;
        }
        localStorage.setItem('power_shake_menu_data', JSON.stringify(MENU_DATA));
    };

    input.addEventListener('blur', saveChanges);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            input.blur();
        } else if (e.key === 'Escape') {
            // Restore original formatting
            input.removeEventListener('blur', saveChanges);
            if (field === 'price') {
                element.innerHTML = formatCurrency(item.price || 0);
            } else if (field === 'kcal') {
                element.innerHTML = (item.kcal || 0) + ' kcal';
            } else if (field === 'protein') {
                element.innerHTML = (item.protein || 0) + 'g';
            } else {
                element.innerHTML = item.name || '';
            }
        }
    });
};

window.toggleItemAvailability = function(categoryId, itemId, checkbox) {
    const category = MENU_DATA.categories.find(c => c.id === categoryId);
    if (!category) return;
    const item = category.items.find(i => i.id === itemId);
    if (!item) return;

    item.outOfStock = !checkbox.checked;
    localStorage.setItem('power_shake_menu_data', JSON.stringify(MENU_DATA));
    
    const statusText = checkbox.checked ? 'disponível' : 'indisponível (oculto no menu)';
    showToast(`O produto "${item.name}" foi marcado como ${statusText}.`, 'success');
};

// Media type filter handler inside product form modal
function toggleItemMediaFields() {
    const val = dom.itemMediaType.value;
    const iconWrapper = document.getElementById('icon-field-wrapper');
    const photoWrapper = document.getElementById('photo-field-wrapper');

    if (val === 'icon') {
        iconWrapper.style.display = 'flex';
        photoWrapper.style.display = 'none';
        dom.itemIcon.required = true;
    } else {
        iconWrapper.style.display = 'none';
        photoWrapper.style.display = 'flex';
        dom.itemIcon.required = false;
    }
}

// Modal Form Open Logic for Items
window.openItemEditor = function(id = null) {
    const catId = dom.categorySelect.value;
    const category = MENU_DATA.categories.find(c => c.id === catId);
    
    dom.editItemId.value = id || '';
    dom.modalForm.reset();
    uploadedProductImageBase64 = '';
    dom.productPreview.style.backgroundImage = 'none';

    // Show/hide fields
    const macrosWrapper = document.getElementById('macros-fields-wrapper');
    const priceWrapper = document.getElementById('price-field-wrapper');
    const descWrapper = document.getElementById('desc-field-wrapper');
    const versionsWrapper = document.getElementById('versions-field-wrapper');

    macrosWrapper.style.display = ['fruits', 'milks', 'whey', 'toppings'].includes(catId) ? 'flex' : 'none';
    priceWrapper.style.display = 'flex';
    descWrapper.style.display = ['milks', 'supplements'].includes(catId) ? 'flex' : 'none';
    versionsWrapper.style.display = catId === 'milks' ? 'flex' : 'none';

    if (id && category) {
        dom.modalTitle.innerText = 'Editar Item';
        let item = category.items.find(i => i.id === id);

        if (item) {
            dom.itemName.value = item.name;
            
            // Set image uploader vs emoji uploader fields
            if (item.image) {
                dom.itemMediaType.value = 'image';
                uploadedProductImageBase64 = item.image;
                dom.productPreview.style.backgroundImage = `url('${item.image}')`;
                dom.itemIcon.value = '';
            } else {
                dom.itemMediaType.value = 'icon';
                dom.itemIcon.value = item.icon || '';
            }
            
            dom.itemKcal.value = item.kcal || 0;
            dom.itemProtein.value = item.protein || 0;
            dom.itemPrice.value = item.price || 0.00;
            dom.itemDesc.value = item.description || '';
            
            if (dom.itemAvailableCheckbox) {
                dom.itemAvailableCheckbox.checked = !item.outOfStock;
            }
            
            if (item.versions) {
                dom.itemVersions.value = item.versions.join(', ');
            } else {
                dom.itemVersions.value = '';
            }
        }
    } else {
        dom.modalTitle.innerText = 'Novo Item';
        dom.itemMediaType.value = 'icon';
        dom.itemPrice.value = '0.00';
        dom.itemKcal.value = '0';
        dom.itemProtein.value = '0';
        if (dom.itemAvailableCheckbox) {
            dom.itemAvailableCheckbox.checked = true;
        }
    }

    toggleItemMediaFields();
    dom.itemModal.style.display = 'flex';
};

// Item Editor Modal Submit Save
dom.modalForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const catId = dom.categorySelect.value;
    const category = MENU_DATA.categories.find(c => c.id === catId);
    
    if (!category) return;
    
    const id = dom.editItemId.value;
    const name = dom.itemName.value.trim();
    const mediaType = dom.itemMediaType.value;
    
    const icon = mediaType === 'icon' ? dom.itemIcon.value.trim() : '';
    const image = mediaType === 'image' ? uploadedProductImageBase64 : '';

    const kcal = parseFloat(dom.itemKcal.value) || 0;
    const protein = parseFloat(dom.itemProtein.value) || 0;
    const price = parseFloat(dom.itemPrice.value) || 0;
    const description = dom.itemDesc.value.trim();
    const rawVersions = dom.itemVersions.value.trim();

    let versions = undefined;
    if (catId === 'milks' && rawVersions) {
        versions = rawVersions.split(',').map(v => v.trim()).filter(v => v.length > 0);
    }

    const outOfStock = dom.itemAvailableCheckbox ? !dom.itemAvailableCheckbox.checked : false;

    if (id) {
        // EDIT MODE
        const index = category.items.findIndex(i => i.id === id);
        if (index !== -1) {
            category.items[index] = {
                ...category.items[index],
                name, icon, image, kcal, protein, price, description, versions, outOfStock
            };
        }
    } else {
        // ADD NEW ITEM MODE
        const newItem = {
            id: 'item_' + Date.now(),
            name, icon, image, kcal, protein, price, description, versions, outOfStock
        };
        category.items.push(newItem);
    }
    localStorage.setItem('power_shake_menu_data', JSON.stringify(MENU_DATA));

    dom.itemModal.style.display = 'none';
    renderItemsTable();
});

// Delete Menu Item
window.deleteMenuItem = function(id) {
    const catId = dom.categorySelect.value;
    const category = MENU_DATA.categories.find(c => c.id === catId);
    if (!category) return;

    if (confirm('Tem certeza que deseja remover este item de forma permanente?')) {
        category.items = category.items.filter(i => i.id !== id);
        renderItemsTable();
    }
};

// Move Menu Item Up
window.moveItemUp = function(id) {
    const catId = dom.categorySelect.value;
    const category = MENU_DATA.categories.find(c => c.id === catId);
    if (!category) return;

    const index = category.items.findIndex(i => i.id === id);
    if (index > 0) {
        // Swap items
        const temp = category.items[index];
        category.items[index] = category.items[index - 1];
        category.items[index - 1] = temp;
        renderItemsTable();
    }
};

// Move Menu Item Down
window.moveItemDown = function(id) {
    const catId = dom.categorySelect.value;
    const category = MENU_DATA.categories.find(c => c.id === catId);
    if (!category) return;

    const index = category.items.findIndex(i => i.id === id);
    if (index !== -1 && index < category.items.length - 1) {
        // Swap items
        const temp = category.items[index];
        category.items[index] = category.items[index + 1];
        category.items[index + 1] = temp;
        renderItemsTable();
    }
};

// Change Category Selection Mode (single/multi) on dropdown selection change
window.changeCategorySelectionType = function() {
    const catId = dom.categorySelect.value || 'fruits';
    const category = MENU_DATA.categories.find(c => c.id === catId);
    if (category && dom.categorySelectionType) {
        category.selectionType = dom.categorySelectionType.value;
    }
};

// Change Category Required Status (true/false) on toggle switch change
window.changeCategoryRequiredStatus = function() {
    const catId = dom.categorySelect.value || 'fruits';
    const category = MENU_DATA.categories.find(c => c.id === catId);
    if (category && dom.categoryRequiredToggle) {
        category.required = dom.categoryRequiredToggle.checked;
    }
};

// Setup dynamic category modal actions
// Toggle category media fields based on selection
window.toggleCategoryMediaFields = function() {
    if (!dom.catMediaType) return;
    const val = dom.catMediaType.value;
    const iconWrapper = document.getElementById('cat-icon-wrapper');
    const imageWrapper = document.getElementById('cat-image-wrapper');
    
    if (val === 'icon') {
        if (iconWrapper) iconWrapper.style.display = 'block';
        if (imageWrapper) imageWrapper.style.display = 'none';
        if (dom.catIcon) dom.catIcon.required = true;
    } else {
        if (iconWrapper) iconWrapper.style.display = 'none';
        if (imageWrapper) imageWrapper.style.display = 'block';
        if (dom.catIcon) dom.catIcon.required = false;
    }
};

function setupCategoryActions() {
    // Media uploader reader for Category
    if (dom.catImageFile) {
        dom.catImageFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    uploadedCategoryImageBase64 = evt.target.result;
                    if (dom.catImagePreview) {
                        dom.catImagePreview.style.backgroundImage = `url('${evt.target.result}')`;
                        dom.catImagePreview.innerText = '';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Open category modal for creating new category
    dom.addCategoryBtn.addEventListener('click', () => {
        dom.catForm.reset();
        dom.editCategoryId.value = '';
        document.getElementById('category-modal-form-title').innerText = 'Nova Categoria';
        uploadedCategoryImageBase64 = '';
        if (dom.catImagePreview) {
            dom.catImagePreview.style.backgroundImage = 'none';
            dom.catImagePreview.innerText = 'Sem Foto';
        }
        toggleCategoryMediaFields();
        dom.catModal.style.display = 'flex';
    });

    // Open category modal for editing existing category
    dom.editCategoryBtn.addEventListener('click', () => {
        const catId = dom.categorySelect.value;
        const category = MENU_DATA.categories.find(c => c.id === catId);
        if (!category) return;
        
        dom.catForm.reset();
        dom.editCategoryId.value = catId;
        document.getElementById('category-modal-form-title').innerText = 'Editar Categoria: ' + category.name;
        dom.catName.value = category.name;
        dom.catSubtitle.value = category.subtitle;
        dom.catPosition.value = category.isStep ? 'step' : 'extra';
        dom.catSelection.value = category.selectionType || 'multi';
        dom.catRequired.value = category.required ? 'true' : 'false';
        
        if (category.image) {
            dom.catMediaType.value = 'image';
            uploadedCategoryImageBase64 = category.image;
            if (dom.catImagePreview) {
                dom.catImagePreview.style.backgroundImage = `url('${category.image}')`;
                dom.catImagePreview.innerText = '';
            }
            dom.catIcon.value = '';
        } else {
            dom.catMediaType.value = 'icon';
            dom.catIcon.value = category.icon || '';
            uploadedCategoryImageBase64 = '';
            if (dom.catImagePreview) {
                dom.catImagePreview.style.backgroundImage = 'none';
                dom.catImagePreview.innerText = 'Sem Foto';
            }
        }
        
        toggleCategoryMediaFields();
        dom.catModal.style.display = 'flex';
    });

    // Close category modal
    const closeCatModal = () => dom.catModal.style.display = 'none';
    dom.catCloseBtn.addEventListener('click', closeCatModal);
    dom.catCancelBtn.addEventListener('click', closeCatModal);
    
    // Save category (Create or Edit)
    dom.catForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = dom.editCategoryId.value;
        const name = dom.catName.value.trim();
        const subtitle = dom.catSubtitle.value.trim();
        const position = dom.catPosition.value;
        const selection = dom.catSelection.value;
        const required = dom.catRequired.value === 'true';
        const mediaType = dom.catMediaType.value;
        
        const icon = mediaType === 'icon' ? dom.catIcon.value.trim() : '';
        const image = mediaType === 'image' ? uploadedCategoryImageBase64 : '';

        if (id) {
            // EDIT CATEGORY
            const category = MENU_DATA.categories.find(c => c.id === id);
            if (category) {
                category.name = name;
                category.subtitle = subtitle;
                category.isStep = position === 'step';
                category.selectionType = selection;
                category.required = required;
                category.icon = icon;
                category.image = image;
            }
            closeCatModal();
            populateCategoryDropdown(id);
            renderItemsTable();
        } else {
            // CREATE CATEGORY
            const newCatId = 'cat_' + Date.now();
            const newCategoryObj = {
                id: newCatId,
                name,
                subtitle,
                isStep: position === 'step',
                selectionType: selection,
                required,
                icon,
                image,
                items: []
            };

            MENU_DATA.categories.push(newCategoryObj);
            closeCatModal();
            populateCategoryDropdown(newCatId);
            renderItemsTable();
        }
        localStorage.setItem('power_shake_menu_data', JSON.stringify(MENU_DATA));
    });

    // Delete category action
    dom.deleteCategoryBtn.addEventListener('click', function() {
        const catId = dom.categorySelect.value;
        
        // Prevent deleting original core categories to keep calculations intact
        const defaultIds = ['fruits', 'milks', 'whey', 'toppings', 'peanutButters', 'supplements'];
        if (defaultIds.includes(catId)) {
            showToast('Categorias padrão do sistema não podem ser excluídas para não quebrar o construtor.', 'warning');
            return;
        }

        const category = MENU_DATA.categories.find(c => c.id === catId);
        if (category && confirm(`Tem certeza que deseja excluir permanentemente a categoria "${category.name}" e todos os seus produtos cadastrados?`)) {
            MENU_DATA.categories = MENU_DATA.categories.filter(c => c.id !== catId);
            populateCategoryDropdown('fruits');
            renderItemsTable();
        }
    });
}

// Setup Event Listeners and Button Actions
function setupDashboardActions() {
    // Switch media type dropdown in modal editor
    dom.itemMediaType.addEventListener('change', toggleItemMediaFields);

    // Add Item click
    dom.addItemBtn.addEventListener('click', () => openItemEditor());

    // Item modal closes
    dom.modalCloseBtn.addEventListener('click', closeModal);
    dom.modalCancelBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === dom.itemModal) closeModal();
        if (e.target === dom.catModal) dom.catModal.style.display = 'none';
    });

    function closeModal() {
        dom.itemModal.style.display = 'none';
    }

    // Save All Changes to database securely using PIN
    dom.saveSettingsBtn.addEventListener('click', async function() {
        SETTINGS.heroTitle = dom.heroTitle.value.trim();
        SETTINGS.heroSubtitle = dom.heroSubtitle.value.trim();
        
        SETTINGS.midBannerTitle = dom.midTitle.value.trim();
        SETTINGS.midBannerSubtitle = dom.midSubtitle.value.trim();

        SETTINGS.address = dom.address.value.trim();
        SETTINGS.subAddress = dom.subaddress.value.trim();
        SETTINGS.mapUrl = dom.mapUrl.value.trim();

        const pin = prompt("Digite o PIN do Administrador para salvar as alterações globalmente (Padrão: 1234):");
        if (pin === null) return;
        if (pin.trim() === '') {
            showToast('Você precisa informar o PIN do Administrador!', 'warning');
            return;
        }

        dom.saveSettingsBtn.disabled = true;
        dom.saveSettingsBtn.innerText = 'Salvando...';

        try {
            const res = await fetch('/api/save-menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    menuData: MENU_DATA,
                    settings: SETTINGS,
                    pin: pin.trim()
                })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                // Cache locally too
                localStorage.setItem('power_shake_menu_data', JSON.stringify(MENU_DATA));
                localStorage.setItem('power_shake_settings', JSON.stringify(SETTINGS));
                showToast('Todas as alterações foram salvas com sucesso globalmente!', 'success');
            } else {
                showToast(`Erro ao salvar: ${data.error || 'Erro desconhecido'}`, 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('Erro de conexão ao salvar no banco de dados. Verifique sua rede.', 'error');
        } finally {
            dom.saveSettingsBtn.disabled = false;
            dom.saveSettingsBtn.innerText = 'Salvar Alterações';
        }
    });

    // Reset Defaults Option globally
    dom.resetDefaultsBtn.addEventListener('click', async function() {
        if (confirm('Atenção: Você tem certeza de que deseja restaurar as configurações originais do cardápio? Todas as alterações personalizadas, novas categorias, fotos e preços serão apagadas globalmente para todos os clientes.')) {
            
            const pin = prompt("Digite o PIN do Administrador para confirmar a restauração global:");
            if (pin === null) return;
            if (pin.trim() === '') {
                showToast('Você precisa informar o PIN do Administrador!', 'warning');
                return;
            }

            dom.resetDefaultsBtn.disabled = true;
            dom.resetDefaultsBtn.innerText = 'Restaurando...';

            try {
                const res = await fetch('/api/save-menu', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        menuData: DEFAULT_MENU_DATA,
                        settings: DEFAULT_SETTINGS,
                        pin: pin.trim()
                    })
                });
                const data = await res.json();

                if (res.ok && data.success) {
                    localStorage.removeItem('power_shake_menu_data');
                    localStorage.removeItem('power_shake_settings');
                    showToast('Padrões restaurados com sucesso globalmente!', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    showToast(`Erro ao restaurar: ${data.error || 'Erro desconhecido'}`, 'error');
                }
            } catch (e) {
                console.error(e);
                showToast('Erro de conexão ao restaurar padrões. Tente novamente.', 'error');
            } finally {
                dom.resetDefaultsBtn.disabled = false;
                dom.resetDefaultsBtn.innerText = 'Restaurar Padrões do Cardápio';
            }
        }
    });
}

// Initializer: load menu database from Vercel API
async function initDashboard() {
    try {
        const response = await fetch('/api/get-menu');
        const data = await response.json();
        if (data && data.success) {
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
        console.warn('Não foi possível carregar os dados do backend. Usando cache local.');
    }

    loadGeneralSettings();
    setupUploaders();
    populateCategoryDropdown();
    setupCategoryActions();
    setupDashboardActions();
    setupOrdersTab();
}

// ==========================================
// RECEBIMENTO DE PEDIDOS - LÓGICA E DADOS
// ==========================================

let ordersPollingInterval = null;

function setupOrdersTab() {
    const refreshBtn = document.getElementById('refresh-orders-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadOrders);
    }
}

function startOrdersPolling() {
    stopOrdersPolling();
    ordersPollingInterval = setInterval(loadOrders, 12000);
}

function stopOrdersPolling() {
    if (ordersPollingInterval) {
        clearInterval(ordersPollingInterval);
        ordersPollingInterval = null;
    }
}

async function loadOrders() {
    const refreshIcon = document.getElementById('refresh-icon');
    if (refreshIcon) {
        refreshIcon.classList.add('spinning');
    }

    let orders = [];
    
    // 1. Try to load from API
    try {
        const response = await fetch('/api/get-orders');
        const data = await response.json();
        if (data.success && Array.isArray(data.orders)) {
            orders = data.orders;
        } else {
            console.warn('API get-orders was unsuccessful. Falling back to local storage.');
            orders = getLocalOrders();
        }
    } catch (e) {
        console.warn('Failed to fetch orders from API, falling back to local storage:', e);
        orders = getLocalOrders();
    }

    renderOrders(orders);

    if (refreshIcon) {
        setTimeout(() => {
            refreshIcon.classList.remove('spinning');
        }, 600);
    }
}

function getLocalOrders() {
    try {
        return JSON.parse(localStorage.getItem('power_shake_orders') || '[]');
    } catch (e) {
        console.error('Failed to load orders from localStorage:', e);
        return [];
    }
}

function getCategoryInfo(categoryId, defaultCategoryName = '') {
    const maps = {
        fruits: { label: 'Fruta', emoji: '🍌', colorClass: 'category-fruits' },
        milks: { label: 'Leite', emoji: '🥛', colorClass: 'category-milks' },
        whey: { label: 'Whey', emoji: '💪', colorClass: 'category-whey' },
        toppings: { label: 'Topping', emoji: '🍫', colorClass: 'category-toppings' },
        peanutButters: { label: 'Pasta', emoji: '🥜', colorClass: 'category-peanutButters' },
        supplements: { label: 'Suplemento', emoji: '⚡', colorClass: 'category-supplements' }
    };
    
    if (maps[categoryId]) return maps[categoryId];
    
    let cleanLabel = (defaultCategoryName || '')
        .replace('Escolha o ', '')
        .replace('Escolha a ', '')
        .replace('Adicione ', '')
        .replace('Toppings & ', '');
    return {
        label: cleanLabel || 'Item',
        emoji: '✨',
        colorClass: 'category-default'
    };
}

function renderOrders(orders) {
    const container = document.getElementById('orders-list-container');
    if (!container) return;

    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders-state">
                <ion-icon name="restaurant-outline" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 15px;"></ion-icon>
                <p>Nenhum pedido recebido ainda.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => {
        const dateFormatted = formatOrderDate(order.createdAt);
        const statusLabel = {
            pending: 'Pendente',
            completed: 'Concluído',
            cancelled: 'Cancelado'
        }[order.status] || order.status;

        const itemsHtml = order.items.map(item => {
            if (item.categoryId && item.itemName) {
                const info = getCategoryInfo(item.categoryId, item.categoryName);
                return `
                    <div class="order-item-badge-row">
                        <span class="order-category-tag ${info.colorClass}">${info.emoji} ${info.label}</span>
                        <span class="order-item-details-text"><strong>${item.itemName}</strong> ${item.itemDetails || ''}</span>
                    </div>
                `;
            } else {
                let guessedCat = 'default';
                let rawText = item.name || '';
                let label = 'Item';
                let emoji = '✨';
                let colorClass = 'category-default';

                if (rawText.toLowerCase().includes('fruta')) {
                    guessedCat = 'fruits';
                } else if (rawText.toLowerCase().includes('leite')) {
                    guessedCat = 'milks';
                } else if (rawText.toLowerCase().includes('whey')) {
                    guessedCat = 'whey';
                } else if (rawText.toLowerCase().includes('topping') || rawText.toLowerCase().includes('acompanhamento')) {
                    guessedCat = 'toppings';
                } else if (rawText.toLowerCase().includes('pasta') || rawText.toLowerCase().includes('peanut')) {
                    guessedCat = 'peanutButters';
                }

                if (guessedCat !== 'default') {
                    const info = getCategoryInfo(guessedCat);
                    label = info.label;
                    emoji = info.emoji;
                    colorClass = info.colorClass;
                }

                const cleanText = rawText.split(':').pop().trim();
                return `
                    <div class="order-item-badge-row">
                        <span class="order-category-tag ${colorClass}">${emoji} ${label}</span>
                        <span class="order-item-details-text"><strong>${cleanText || rawText}</strong></span>
                    </div>
                `;
            }
        }).join('');

        const kcalVal = parseFloat(order.totalKcal || 0).toFixed(1);
        const proteinVal = parseFloat(order.totalProtein || 0).toFixed(1);

        // Action buttons based on current status
        let actionsHtml = '';
        if (order.status === 'pending') {
            actionsHtml = `
                <button class="order-btn order-btn-complete" onclick="updateOrderStatus('${order.id}', 'completed')">
                    <ion-icon name="checkmark-outline"></ion-icon> Concluir
                </button>
                <button class="order-btn order-btn-cancel" onclick="updateOrderStatus('${order.id}', 'cancelled')">
                    <ion-icon name="close-outline"></ion-icon> Cancelar
                </button>
            `;
        } else {
            actionsHtml = `
                <button class="order-btn order-btn-complete" style="opacity: 0.7;" onclick="updateOrderStatus('${order.id}', 'pending')">
                    <ion-icon name="arrow-undo-outline"></ion-icon> Reabrir
                </button>
            `;
        }

        return `
            <div class="order-card ${order.status}">
                <div class="order-card-header">
                    <span class="order-id">#${order.id}</span>
                    <span class="order-date">${dateFormatted}</span>
                </div>
                <div class="order-client-name">${order.clientName}</div>
                
                <div class="order-items-list">
                    ${itemsHtml}
                </div>

                <div class="order-footer-details">
                    <div class="order-macros-summary">
                        <span class="order-macro-pill">🔥 ${kcalVal} kcal</span>
                        <span class="order-macro-pill">💪 ${proteinVal}g prot</span>
                    </div>
                    <div class="order-total-price">${formatCurrency(order.totalPrice || 0)}</div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 8px;">
                    <span style="font-size:0.8rem; color:var(--text-secondary);">Status:</span>
                    <span class="badge badge-${order.status}">${statusLabel}</span>
                </div>

                <div class="order-actions">
                    ${actionsHtml}
                    <button class="order-btn order-btn-delete" title="Excluir do Histórico" onclick="deleteOrder('${order.id}')">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function formatOrderDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Agora mesmo';
        if (diffMins < 60) return `Há ${diffMins} min`;

        if (date.toDateString() === now.toDateString()) {
            return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return dateString;
    }
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function updateOrderStatus(orderId, newStatus) {
    // 1. Update backend
    try {
        await fetch('/api/update-order-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status: newStatus })
        });
    } catch (e) {
        console.warn('Failed to update order status on backend:', e);
    }

    // 2. Update local storage
    try {
        let localOrders = getLocalOrders();
        localOrders = localOrders.map(o => {
            if (o.id === orderId) {
                return { ...o, status: newStatus };
            }
            return o;
        });
        localStorage.setItem('power_shake_orders', JSON.stringify(localOrders));
    } catch (e) {
        console.error(e);
    }

    loadOrders();
}

async function deleteOrder(orderId) {
    if (!confirm('Deseja excluir permanentemente este pedido do histórico?')) return;

    // 1. Update backend
    try {
        await fetch('/api/update-order-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status: 'deleted' })
        });
    } catch (e) {
        console.warn('Failed to delete order from backend:', e);
    }

    // 2. Update local storage
    try {
        let localOrders = getLocalOrders();
        localOrders = localOrders.filter(o => o.id !== orderId);
        localStorage.setItem('power_shake_orders', JSON.stringify(localOrders));
    } catch (e) {
        console.error(e);
    }

    loadOrders();
}

// Bind to window for HTML inline onclick
window.updateOrderStatus = updateOrderStatus;
window.deleteOrder = deleteOrder;

// Run initializations
document.addEventListener('DOMContentLoaded', initDashboard);
