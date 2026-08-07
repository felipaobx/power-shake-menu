const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

var MENU_DATA;
var SETTINGS;
var DEFAULT_MENU_DATA;
var DEFAULT_SETTINGS;

global.window = { innerWidth: 1920 };
global.document = {
    addEventListener: () => {},
    getElementById: () => ({ href: '' }),
    querySelector: () => null,
    querySelectorAll: () => []
};
global.localStorage = {
    getItem: (key) => null,
    setItem: (key, val) => {}
};

let appCode = fs.readFileSync('./app.js', 'utf8');
appCode = appCode
    .replace(/const /g, 'var ')
    .replace(/let /g, 'var ');

eval(appCode);

const settingsToUse = DEFAULT_SETTINGS;

function cleanText(str) {
    if (!str) return '';
    return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F637}\u{1F680}-\u{1F6C5}\u{1F300}-\u{1F53D}]/gu, '').trim();
}

async function getImageBuffer(imageUrl) {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('data:image/')) {
        try {
            const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
            return Buffer.from(base64Data, 'base64');
        } catch (e) {
            return null;
        }
    }
    
    if (imageUrl.startsWith('assets/') || imageUrl.startsWith('./assets/')) {
        const localPath = path.join(process.cwd(), imageUrl.replace(/^\.\//, ''));
        if (fs.existsSync(localPath)) {
            try {
                return fs.readFileSync(localPath);
            } catch (e) {}
        }
    }
    return null;
}

function formatPricePill(val) {
    if (typeof val === 'number') {
        return `R$ ${val.toFixed(2).replace('.', ',')}`;
    }
    if (typeof val === 'string' && val.trim()) {
        if (val.includes('R$')) return val;
        const parsed = parseFloat(val.replace(',', '.'));
        if (!isNaN(parsed)) return `R$ ${parsed.toFixed(2).replace('.', ',')}`;
        return val;
    }
    return 'R$ 0,00';
}

function getCategoryItemsForPdf(menuDataObj, categoryIds) {
    if (!menuDataObj || !menuDataObj.categories) return [];
    let items = [];
    const catList = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
    const submenus = menuDataObj.submenus || [];
    
    menuDataObj.categories.forEach(cat => {
        if (cat.hidden) return;
        const parentSub = submenus.find(s => s.id === (cat.submenu || ''));
        if (parentSub && parentSub.hidden) return;

        if (catList.includes(cat.id) || catList.includes(cat.submenu)) {
            if (cat.items) {
                cat.items.forEach(item => {
                    if (!item.outOfStock) {
                        items.push({
                            name: item.name.toUpperCase(),
                            price: formatPricePill(item.price),
                            kcal: item.kcal || 0,
                            carbs: item.carbs || 0,
                            protein: item.protein || 0
                        });
                    }
                });
            }
        }
    });
    return items;
}

function getMacroText(item) {
    if (!item) return '';
    const parts = [];
    if (item.kcal && item.kcal > 0) parts.push(`${item.kcal} kcal`);
    if (item.carbs && item.carbs > 0) parts.push(`${item.carbs}g carb`);
    if (item.protein && item.protein > 0) parts.push(`${item.protein}g prot`);
    return parts.join('  •  ');
}

async function startPdfGeneration() {
    const dataToUse = (typeof MENU_DATA !== 'undefined' && MENU_DATA) ? MENU_DATA : DEFAULT_MENU_DATA;

    // Create 6-Page 1920x1080 Landscape PDF
    const doc = new PDFDocument({ margin: 0, size: [1920, 1080], autoFirstPage: false });
    const outputFilePath = './Power_Shake_Cardapio.pdf';
    const stream = fs.createWriteStream(outputFilePath);
    doc.pipe(stream);

    // Preload Assets
    const logoBuffer = await getImageBuffer('assets/logo.png');
    const heroBuffer = await getImageBuffer('assets/hero.png');
    const fruitsBuffer = await getImageBuffer('assets/fruits.png');
    const complementsBuffer = await getImageBuffer('assets/complements.jpg');
    const combosBuffer = await getImageBuffer('assets/combos.jpg');
    
    let qrBuffer = null;
    try {
        qrBuffer = await QRCode.toBuffer('https://power-shake-menu.vercel.app', {
            width: 300,
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' }
        });
    } catch (e) {}

    function drawPageBackground() {
        doc.addPage({ margin: 0, size: [1920, 1080] });
        doc.rect(0, 0, 1920, 1080).fill('#07090e');
    }

    function drawPricePill(text, x, y, width = 90, height = 28) {
        doc.save();
        doc.roundedRect(x, y, width, height, 8).fill('#8bfc03');
        doc.fillColor('#000000')
           .fontSize(14)
           .font('Helvetica-Bold')
           .text(cleanText(text), x, y + 7, { width: width, align: 'center' });
        doc.restore();
    }

    function drawPdfItemBox(doc, item, x, y, width = 440, height = 64, strokeColor = 'rgba(139, 252, 3, 0.2)', pricePillX = 410) {
        doc.save();
        doc.roundedRect(x, y, width, height, 12).fill('#0e121a');
        doc.strokeColor(strokeColor).lineWidth(1).roundedRect(x, y, width, height, 12).stroke();
        
        const macroText = getMacroText(item);
        if (macroText) {
            doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text(cleanText(item.name), x + 25, y + 14, { width: 240 });
            doc.fillColor('#9aa0a6').fontSize(11).font('Helvetica').text(macroText, x + 25, y + 36, { width: 240 });
        } else {
            doc.fillColor('#ffffff').fontSize(17).font('Helvetica-Bold').text(cleanText(item.name), x + 25, y + Math.floor(height / 2) - 8, { width: 240 });
        }
        drawPricePill(item.price, pricePillX, y + Math.floor(height / 2) - 14, 90, 28);
        doc.restore();
    }

    // ==========================================
    // PAGE 1: CAPA & HERÓI (1920x1080)
    // ==========================================
    drawPageBackground();
    if (logoBuffer) {
        try { doc.image(logoBuffer, 80, 80, { width: 110 }); } catch (e) {}
    }

    doc.fillColor('#8bfc03').fontSize(46).font('Helvetica-Bold').text('POWER SHAKE', 210, 85);
    doc.fillColor('#9aa0a6').fontSize(14).font('Helvetica-Bold').text('- SEU ALIADO NA SUA DIETA -', 210, 135, { characterSpacing: 2 });

    doc.fillColor('#ffffff').fontSize(68).font('Helvetica-Bold').text('CARDÁPIO DIGITAL', 80, 240);
    doc.fillColor('#8bfc03').fontSize(32).font('Helvetica-Bold').text('ENERGIA E SABOR EM CADA GOLE!', 80, 325);

    const badges = [
        'ENERGIA DE VERDADE',
        'SEU ALIADO NA SUA DIETA',
        'DESEMPENHO E FOCO'
    ];

    let badgeY = 410;
    badges.forEach(b => {
        doc.save();
        doc.roundedRect(80, badgeY, 440, 58, 14).fill('rgba(255,255,255,0.04)');
        doc.strokeColor('rgba(139, 252, 3, 0.35)').lineWidth(1.5).roundedRect(80, badgeY, 440, 58, 14).stroke();
        doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold').text(b, 104, badgeY + 19);
        doc.restore();
        badgeY += 76;
    });

    if (heroBuffer) {
        try { doc.image(heroBuffer, 1050, 100, { height: 880 }); } catch (e) {}
    }

    // ==========================================
    // PAGE 2: SHAKES TRADICIONAIS (1920x1080)
    // ==========================================
    drawPageBackground();
    doc.fillColor('#8bfc03').fontSize(44).font('Helvetica-Bold').text('SHAKES TRADICIONAIS', 80, 60);
    doc.fillColor('#9aa0a6').fontSize(16).font('Helvetica-Bold').text('FEITOS COM MUITO SABOR E PROTEÍNA DE VERDADE!', 80, 115);

    const dbPage2Shakes = getCategoryItemsForPdf(dataToUse, ['estilo_shakes', 'milks', 'whey']);
    const defaultShakes = [
        { name: 'CHOCOLATE', price: 'R$ 16,00' },
        { name: 'PAÇOCA', price: 'R$ 17,00' },
        { name: 'MORANGO', price: 'R$ 16,00' },
        { name: 'LEITE NINHO', price: 'R$ 17,00' },
        { name: 'BAUNILHA', price: 'R$ 16,00' },
        { name: 'OVOMALTINE', price: 'R$ 17,00' },
        { name: 'COOKIES', price: 'R$ 17,00' },
        { name: 'CHOCOLATE BRANCO', price: 'R$ 17,00' },
        { name: 'CAFÉ', price: 'R$ 16,00' },
        { name: 'DOCE DE LEITE', price: 'R$ 17,00' }
    ];
    const shakesList = (dbPage2Shakes.length > 0 ? dbPage2Shakes : defaultShakes).slice(0, 10);

    let shakeY = 175;
    for (let i = 0; i < shakesList.length; i += 2) {
        const s1 = shakesList[i];
        const s2 = shakesList[i + 1];

        if (s1) drawPdfItemBox(doc, s1, 80, shakeY, 440, 64, 'rgba(139, 252, 3, 0.2)', 410);
        if (s2) drawPdfItemBox(doc, s2, 550, shakeY, 440, 64, 'rgba(139, 252, 3, 0.2)', 880);

        shakeY += 80;
    }

    doc.save();
    doc.roundedRect(80, 930, 910, 65, 16).fill('rgba(139, 252, 3, 0.1)');
    doc.strokeColor('rgba(139, 252, 3, 0.4)').lineWidth(1.5).roundedRect(80, 930, 910, 65, 16).stroke();
    doc.fillColor('#8bfc03').fontSize(22).font('Helvetica-Bold').text('+ PROTEÍNA     + SABOR     + ENERGIA', 80, 952, { align: 'center', width: 910, characterSpacing: 3 });
    doc.restore();

    if (heroBuffer) {
        try { doc.image(heroBuffer, 1100, 100, { height: 880 }); } catch (e) {}
    }

    // ==========================================
    // PAGE 3: FRUTAS SELECIONADAS (1920x1080)
    // ==========================================
    drawPageBackground();
    doc.fillColor('#8bfc03').fontSize(44).font('Helvetica-Bold').text('FRUTAS SELECIONADAS', 80, 60);
    doc.fillColor('#9aa0a6').fontSize(16).font('Helvetica-Bold').text('MAIS FRESCOR PARA DEIXAR SEU SHAKE AINDA MELHOR!', 80, 115);

    const dbPage3Fruits = getCategoryItemsForPdf(dataToUse, ['fruits']);
    const defaultFruits = [
        { name: 'MORANGO', price: 'R$ 4,50' },
        { name: 'BANANA', price: 'R$ 3,00' },
        { name: 'MAMÃO', price: 'R$ 3,50' },
        { name: 'MANGA', price: 'R$ 3,50' },
        { name: 'GOIABA', price: 'R$ 4,00' },
        { name: 'ABACATE', price: 'R$ 5,00' },
        { name: 'MARACUJÁ', price: 'R$ 4,50' },
        { name: 'FRUTAS VERMELHAS', price: 'R$ 6,00' }
    ];
    const fruitsList = (dbPage3Fruits.length > 0 ? dbPage3Fruits : defaultFruits).slice(0, 10);

    let fruitY = 180;
    for (let i = 0; i < fruitsList.length; i += 2) {
        const f1 = fruitsList[i];
        const f2 = fruitsList[i + 1];

        if (f1) drawPdfItemBox(doc, f1, 80, fruitY, 440, 80, 'rgba(255,255,255,0.08)', 410);
        if (f2) drawPdfItemBox(doc, f2, 550, fruitY, 440, 80, 'rgba(255,255,255,0.08)', 880);

        fruitY += 100;
    }

    doc.save();
    doc.roundedRect(80, 930, 910, 65, 16).fill('rgba(139, 252, 3, 0.1)');
    doc.strokeColor('rgba(139, 252, 3, 0.4)').lineWidth(1.5).roundedRect(80, 930, 910, 65, 16).stroke();
    doc.fillColor('#8bfc03').fontSize(20).font('Helvetica-Bold').text('FRUTAS FRESCA E SELECIONADAS TODOS OS DIAS!', 80, 952, { align: 'center', width: 910 });
    doc.restore();

    if (fruitsBuffer) {
        try { doc.image(fruitsBuffer, 1100, 100, { height: 880 }); } catch (e) {}
    }

    // ==========================================
    // PAGE 4: COMPLEMENTOS (1920x1080)
    // ==========================================
    drawPageBackground();
    doc.fillColor('#8bfc03').fontSize(44).font('Helvetica-Bold').text('COMPLEMENTOS & ADICIONAIS', 80, 60);
    doc.fillColor('#9aa0a6').fontSize(16).font('Helvetica-Bold').text('TURBINE SEU SHAKE DO SEU JEITO!', 80, 115);

    const dbPage4Complements = getCategoryItemsForPdf(dataToUse, ['toppings', 'peanutButters', 'supplements']);
    const defaultComplements = [
        { name: 'NUTELLA', price: 'R$ 4,00' },
        { name: 'CHOCOLATE 70%', price: 'R$ 3,00' },
        { name: 'OREO', price: 'R$ 3,00' },
        { name: 'PASTA DR. PEANUT', price: 'R$ 5,90' },
        { name: 'PASTA DE AMENDOIM', price: 'R$ 3,00' },
        { name: 'COCO RALADO', price: 'R$ 2,00' },
        { name: 'DOCE DE LEITE', price: 'R$ 3,00' },
        { name: 'WHEY PROTEIN', price: 'R$ 15,90' },
        { name: 'GRANOLA', price: 'R$ 3,00' },
        { name: 'LEITE EM PÓ', price: 'R$ 2,00' }
    ];
    const complementList = (dbPage4Complements.length > 0 ? dbPage4Complements : defaultComplements).slice(0, 10);

    let compY = 175;
    for (let i = 0; i < complementList.length; i += 2) {
        const c1 = complementList[i];
        const c2 = complementList[i + 1];

        if (c1) drawPdfItemBox(doc, c1, 80, compY, 440, 64, 'rgba(139, 252, 3, 0.2)', 410);
        if (c2) drawPdfItemBox(doc, c2, 550, compY, 440, 64, 'rgba(139, 252, 3, 0.2)', 880);

        compY += 80;
    }

    doc.save();
    doc.roundedRect(80, 920, 910, 75, 16).fill('rgba(139, 252, 3, 0.08)');
    doc.strokeColor('rgba(139, 252, 3, 0.3)').lineWidth(1.5).roundedRect(80, 920, 910, 75, 16).stroke();
    doc.fillColor('#8bfc03').fontSize(20).font('Helvetica-Bold').text('COBERTURAS', 110, 946);
    doc.fillColor('#ffffff').fontSize(16).font('Helvetica').text('CHOCOLATE  •  MORANGO  •  CARAMELO', 280, 948);
    drawPricePill('R$ 2,00', 880, 943, 90, 30);
    doc.restore();

    if (complementsBuffer) {
        try { doc.image(complementsBuffer, 1100, 100, { height: 880 }); } catch (e) {}
    }

    // ==========================================
    // PAGE 5: COMBOS (1920x1080)
    // ==========================================
    drawPageBackground();
    doc.fillColor('#8bfc03').fontSize(44).font('Helvetica-Bold').text('COMBOS PROMOCIONAIS', 80, 60);
    doc.fillColor('#9aa0a6').fontSize(16).font('Helvetica-Bold').text('MAIS SABOR, MAIS ENERGIA, MAIS ECONOMIA!', 80, 115);

    doc.save();
    doc.roundedRect(80, 175, 440, 260, 20).fill('#0e121a');
    doc.strokeColor('rgba(139, 252, 3, 0.4)').lineWidth(2).roundedRect(80, 175, 440, 260, 20).stroke();
    doc.fillColor('#8bfc03').fontSize(26).font('Helvetica-Bold').text('COMBO POWER', 110, 205);
    doc.fillColor('#9aa0a6').fontSize(16).font('Helvetica').text('1 SHAKE TRADICIONAL\n+ 1 COMPLEMENTO\n+ 1 FRUTA', 110, 245, { lineGap: 8 });
    doc.fillColor('#8bfc03').fontSize(44).font('Helvetica-Bold').text('R$ 24,90', 110, 375);
    doc.restore();

    doc.save();
    doc.roundedRect(550, 175, 440, 260, 20).fill('#0e121a');
    doc.strokeColor('rgba(139, 252, 3, 0.4)').lineWidth(2).roundedRect(550, 175, 440, 260, 20).stroke();
    doc.fillColor('#8bfc03').fontSize(26).font('Helvetica-Bold').text('COMBO TURBO', 580, 205);
    doc.fillColor('#9aa0a6').fontSize(16).font('Helvetica').text('1 SHAKE ESPECIAL\n+ 2 COMPLEMENTOS\n+ 1 FRUTA', 580, 245, { lineGap: 8 });
    doc.fillColor('#8bfc03').fontSize(44).font('Helvetica-Bold').text('R$ 29,90', 580, 375);
    doc.restore();

    doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('MONTE SEU SHAKE DO SEU JEITO!', 80, 480, { align: 'center', width: 910 });

    const steps = [
        { num: '1', title: 'ESCOLHA\nSUA BASE' },
        { num: '2', title: 'ESCOLHA\nSUAS FRUTAS' },
        { num: '3', title: 'ESCOLHA SEUS\nCOMPLEMENTOS' },
        { num: '4', title: 'ESCOLHA\nCOBERTURA' }
    ];

    let stepX = 80;
    steps.forEach(s => {
        doc.save();
        doc.roundedRect(stepX, 530, 205, 110, 16).fill('rgba(255,255,255,0.03)');
        doc.strokeColor('rgba(139, 252, 3, 0.3)').lineWidth(1.5).roundedRect(stepX, 530, 205, 110, 16).stroke();
        doc.fillColor('#8bfc03').fontSize(24).font('Helvetica-Bold').text(s.num, stepX + 20, 568);
        doc.fillColor('#ffffff').fontSize(13).font('Helvetica-Bold').text(s.title, stepX + 55, 565, { lineGap: 4 });
        doc.restore();
        stepX += 235;
    });

    doc.fillColor('#8bfc03').fontSize(22).font('Helvetica-Bold').text('E PRONTO! SEU SHAKE DO SEU JEITO!', 80, 680, { align: 'center', width: 910 });

    if (combosBuffer) {
        try { doc.image(combosBuffer, 1100, 100, { height: 880 }); } catch (e) {}
    }

    // ==========================================
    // PAGE 6: CONTATO, HORÁRIOS & QR CODE (1920x1080)
    // ==========================================
    drawPageBackground();
    if (logoBuffer) {
        try { doc.image(logoBuffer, 80, 60, { width: 90 }); } catch (e) {}
    }

    doc.fillColor('#8bfc03').fontSize(36).font('Helvetica-Bold').text('POWER SHAKE', 195, 70);
    doc.fillColor('#9aa0a6').fontSize(13).font('Helvetica-Bold').text('- SEU ALIADO NA SUA DIETA -', 195, 115, { characterSpacing: 1.5 });

    const contactInfo = [
        { label: 'HORÁRIO DE FUNCIONAMENTO', val: cleanText(settingsToUse.hours || 'SEGUNDA A DOMINGO 10H ÀS 22H') },
        { label: 'PEÇA PELO WHATSAPP', val: cleanText(settingsToUse.phone || '(81) 99999-9999') },
        { label: 'SIGA NOSSO INSTAGRAM', val: cleanText(settingsToUse.instagram || '@powershake.caruaru') }
    ];

    let infoY = 185;
    contactInfo.forEach(info => {
        doc.save();
        doc.roundedRect(80, infoY, 910, 85, 18).fill('#0e121a');
        doc.strokeColor('rgba(255,255,255,0.08)').lineWidth(1).roundedRect(80, infoY, 910, 85, 18).stroke();
        doc.fillColor('#9aa0a6').fontSize(13).font('Helvetica-Bold').text(info.label, 110, infoY + 20);
        doc.fillColor('#8bfc03').fontSize(22).font('Helvetica-Bold').text(info.val, 110, infoY + 44);
        doc.restore();
        infoY += 105;
    });

    doc.save();
    doc.roundedRect(80, 520, 910, 200, 20).fill('rgba(139, 252, 3, 0.08)');
    doc.strokeColor('rgba(139, 252, 3, 0.35)').lineWidth(2).roundedRect(80, 520, 910, 200, 20).stroke();
    
    doc.fillColor('#ffffff').fontSize(26).font('Helvetica-Bold').text('ESCANEIE E PEÇA AGORA!', 120, 580);
    doc.fillColor('#9aa0a6').fontSize(16).font('Helvetica').text('Acesse nosso cardápio digital\ndireto no seu celular.', 120, 620, { lineGap: 6 });

    if (qrBuffer) {
        try { doc.image(qrBuffer, 780, 545, { width: 150 }); } catch (e) {}
    }
    doc.restore();

    doc.fillColor('#9aa0a6').fontSize(18).font('Helvetica-Bold').text('OBRIGADO PELA PREFERÊNCIA!', 80, 950, { align: 'center', width: 910 });

    if (heroBuffer) {
        try { doc.image(heroBuffer, 1100, 100, { height: 880 }); } catch (e) {}
    }

    doc.end();
}

startPdfGeneration();
