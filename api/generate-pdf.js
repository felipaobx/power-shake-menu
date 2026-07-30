// Vercel Serverless Function: Generate Menu Board PDF (1920x1080 Landscape)
// URL: /api/generate-pdf
const { createClient } = require('redis');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

function cleanText(str) {
    if (!str) return '';
    return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F637}\u{1F680}-\u{1F6C5}\u{1F300}-\u{1F53D}]/gu, '').trim();
}

module.exports = async (req, res) => {
    let client;
    let menuData = null;
    let settings = null;

    const { REDIS_URL } = process.env;

    // 1. Try to fetch from Redis database
    if (REDIS_URL) {
        try {
            client = createClient({ url: REDIS_URL });
            await client.connect();

            const [menuRaw, settingsRaw] = await Promise.all([
                client.get('menu_data'),
                client.get('settings')
            ]);

            if (menuRaw) menuData = JSON.parse(menuRaw);
            if (settingsRaw) settings = JSON.parse(settingsRaw);

        } catch (err) {
            console.error('Failed to fetch from Redis, falling back to local files:', err);
        } finally {
            if (client) {
                try { await client.disconnect(); } catch (e) {}
            }
        }
    }

    // 2. Fallback to default menu data defined in app.js
    if (!menuData || !settings) {
        try {
            const mockContext = {
                window: { innerWidth: 1920 },
                document: {
                    addEventListener: () => {},
                    getElementById: () => ({ href: '' }),
                    querySelector: () => null,
                    querySelectorAll: () => []
                },
                localStorage: {
                    getItem: () => null,
                    setItem: () => {}
                }
            };

            const appPath = path.join(process.cwd(), 'app.js');
            let appCode = fs.readFileSync(appPath, 'utf8');
            
            appCode = appCode
                .replace(/const /g, 'var ')
                .replace(/let /g, 'var ');

            const sandbox = new Function('global', 'window', 'document', 'localStorage', `
                var MENU_DATA;
                var SETTINGS;
                var DEFAULT_MENU_DATA;
                var DEFAULT_SETTINGS;

                ${appCode}

                return {
                    DEFAULT_MENU_DATA: DEFAULT_MENU_DATA,
                    DEFAULT_SETTINGS: DEFAULT_SETTINGS,
                    MENU_DATA: MENU_DATA,
                    SETTINGS: SETTINGS
                };
            `);

            const result = sandbox(mockContext, mockContext.window, mockContext.document, mockContext.localStorage);
            
            if (!menuData) menuData = result.MENU_DATA || result.DEFAULT_MENU_DATA;
            if (!settings) settings = result.SETTINGS || result.DEFAULT_SETTINGS;

        } catch (e) {
            console.error('Fatal fallback error:', e);
        }
    }

    const settingsToUse = settings || {};

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

        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);
                const fetchRes = await fetch(imageUrl, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (fetchRes.ok) {
                    const arrayBuffer = await fetchRes.arrayBuffer();
                    return Buffer.from(arrayBuffer);
                }
            } catch (e) {}
        }
        return null;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Power_Shake_Cardapio.pdf"');

    const doc = new PDFDocument({ margin: 0, size: [1920, 1080] });
    doc.pipe(res);

    doc.rect(0, 0, 1920, 1080).fill('#07090e');

    const logoBuffer = await getImageBuffer('assets/logo.png');
    const heroBuffer = await getImageBuffer('assets/hero.png');
    
    let qrBuffer = null;
    try {
        qrBuffer = await QRCode.toBuffer('https://power-shake-menu.vercel.app', {
            width: 260,
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' }
        });
    } catch (e) {
        console.error('Failed to generate QR Code:', e);
    }

    function drawPanelCard(x, y, w, h) {
        doc.save();
        doc.roundedRect(x, y, w, h, 16).fill('#0e121a');
        doc.strokeColor('rgba(139, 252, 3, 0.25)')
           .lineWidth(1.5)
           .roundedRect(x, y, w, h, 16)
           .stroke();
        doc.restore();
    }

    function drawPricePill(text, x, y, width = 72, height = 22) {
        doc.save();
        doc.roundedRect(x, y, width, height, 6).fill('#8bfc03');
        doc.fillColor('#000000')
           .fontSize(11)
           .font('Helvetica-Bold')
           .text(cleanText(text), x, y + 5, { width: width, align: 'center' });
        doc.restore();
    }

    const colW = 605;
    const rowH = 500;
    const col1X = 30;
    const col2X = 655;
    const col3X = 1280;
    const row1Y = 30;
    const row2Y = 550;

    // PANEL 1
    drawPanelCard(col1X, row1Y, colW, rowH);
    if (logoBuffer) {
        try { doc.image(logoBuffer, col1X + 30, row1Y + 30, { width: 90 }); } catch (e) {}
    }
    doc.fillColor('#8bfc03').fontSize(32).font('Helvetica-Bold').text('POWER SHAKE', col1X + 135, row1Y + 35);
    doc.fillColor('#9aa0a6').fontSize(11).font('Helvetica-Bold').text('- SEU ALIADO NA SUA DIETA -', col1X + 135, row1Y + 72, { characterSpacing: 1.5 });
    doc.fillColor('#ffffff').fontSize(44).font('Helvetica-Bold').text('CARDÁPIO', col1X + 30, row1Y + 140);
    doc.fillColor('#8bfc03').fontSize(22).font('Helvetica-Bold').text('ENERGIA E SABOR EM CADA GOLE!', col1X + 30, row1Y + 192);

    const badges = [
        { text: 'ENERGIA DE VERDADE' },
        { text: 'SEU ALIADO NA SUA DIETA' },
        { text: 'DESEMPENHO E FOCO' }
    ];

    let badgeY = row1Y + 250;
    badges.forEach(b => {
        doc.save();
        doc.roundedRect(col1X + 30, badgeY, 260, 42, 10).fill('rgba(255,255,255,0.04)');
        doc.strokeColor('rgba(139, 252, 3, 0.3)').lineWidth(1).roundedRect(col1X + 30, badgeY, 260, 42, 10).stroke();
        doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold').text(b.text, col1X + 45, badgeY + 14);
        doc.restore();
        badgeY += 54;
    });

    if (heroBuffer) {
        try { doc.image(heroBuffer, col1X + 310, row1Y + 110, { width: 275 }); } catch (e) {}
    }

    // PANEL 2
    drawPanelCard(col2X, row1Y, colW, rowH);
    doc.fillColor('#8bfc03').fontSize(26).font('Helvetica-Bold').text('SHAKES TRADICIONAIS', col2X + 30, row1Y + 25);
    doc.fillColor('#9aa0a6').fontSize(11).font('Helvetica-Bold').text('FEITOS COM MUITO SABOR E PROTEÍNA DE VERDADE!', col2X + 30, row1Y + 58);

    const shakesList = [
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

    let itemY = row1Y + 95;
    for (let i = 0; i < shakesList.length; i += 2) {
        const item1 = shakesList[i];
        const item2 = shakesList[i + 1];

        if (item1) {
            doc.save();
            doc.roundedRect(col2X + 30, itemY, 260, 48, 8).fill('rgba(255,255,255,0.03)');
            doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold').text(item1.name, col2X + 42, itemY + 16, { width: 140, ellipsis: true });
            drawPricePill(item1.price, col2X + 210, itemY + 13, 70, 22);
            doc.restore();
        }

        if (item2) {
            doc.save();
            doc.roundedRect(col2X + 310, itemY, 260, 48, 8).fill('rgba(255,255,255,0.03)');
            doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold').text(item2.name, col2X + 322, itemY + 16, { width: 140, ellipsis: true });
            drawPricePill(item2.price, col2X + 490, itemY + 13, 70, 22);
            doc.restore();
        }

        itemY += 56;
    }

    doc.save();
    doc.roundedRect(col2X + 30, row1Y + 430, 540, 42, 10).fill('rgba(139, 252, 3, 0.1)');
    doc.strokeColor('rgba(139, 252, 3, 0.4)').lineWidth(1).roundedRect(col2X + 30, row1Y + 430, 540, 42, 10).stroke();
    doc.fillColor('#8bfc03').fontSize(14).font('Helvetica-Bold').text('+ PROTEÍNA     + SABOR     + ENERGIA', col2X + 30, row1Y + 443, { align: 'center', width: 540, characterSpacing: 2 });
    doc.restore();

    // PANEL 3
    drawPanelCard(col3X, row1Y, colW, rowH);
    doc.fillColor('#8bfc03').fontSize(26).font('Helvetica-Bold').text('FRUTAS', col3X + 30, row1Y + 25);
    doc.fillColor('#9aa0a6').fontSize(11).font('Helvetica-Bold').text('MAIS FRESCOR PARA DEIXAR SEU SHAKE AINDA MELHOR!', col3X + 30, row1Y + 58);

    const fruitsList = [
        { name: 'MORANGO', price: 'R$ 3,00' },
        { name: 'BANANA', price: 'R$ 3,00' },
        { name: 'KIWI', price: 'R$ 3,50' },
        { name: 'MANGA', price: 'R$ 3,50' },
        { name: 'ABACAXI', price: 'R$ 3,00' },
        { name: 'UVA', price: 'R$ 3,00' },
        { name: 'MAÇÃ', price: 'R$ 3,00' },
        { name: 'FRUTAS VERMELHAS', price: 'R$ 4,00' }
    ];

    let fruitY = row1Y + 95;
    for (let i = 0; i < fruitsList.length; i += 2) {
        const f1 = fruitsList[i];
        const f2 = fruitsList[i + 1];

        if (f1) {
            doc.save();
            doc.roundedRect(col3X + 30, fruitY, 260, 68, 10).fill('rgba(255,255,255,0.03)');
            doc.strokeColor('rgba(255,255,255,0.06)').lineWidth(1).roundedRect(col3X + 30, fruitY, 260, 68, 10).stroke();
            doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold').text(f1.name, col3X + 45, fruitY + 26, { width: 140, ellipsis: true });
            drawPricePill(f1.price, col3X + 210, fruitY + 23, 70, 22);
            doc.restore();
        }

        if (f2) {
            doc.save();
            doc.roundedRect(col3X + 310, fruitY, 260, 68, 10).fill('rgba(255,255,255,0.03)');
            doc.strokeColor('rgba(255,255,255,0.06)').lineWidth(1).roundedRect(col3X + 310, fruitY, 260, 68, 10).stroke();
            doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold').text(f2.name, col3X + 325, fruitY + 26, { width: 140, ellipsis: true });
            drawPricePill(f2.price, col3X + 490, fruitY + 23, 70, 22);
            doc.restore();
        }

        fruitY += 76;
    }

    doc.fillColor('#8bfc03').fontSize(11).font('Helvetica-Bold').text('FRUTAS SELECIONADAS TODOS OS DIAS!', col3X + 30, row1Y + 445, { align: 'center', width: 545 });

    // PANEL 4
    drawPanelCard(col1X, row2Y, colW, rowH);
    doc.fillColor('#8bfc03').fontSize(26).font('Helvetica-Bold').text('COMPLEMENTOS', col1X + 30, row2Y + 25);
    doc.fillColor('#9aa0a6').fontSize(11).font('Helvetica-Bold').text('TURBINE SEU SHAKE DO SEU JEITO!', col1X + 30, row2Y + 58);

    const complementList = [
        { name: 'NUTELLA', price: 'R$ 4,00' },
        { name: 'CHOCOLATE 70%', price: 'R$ 3,00' },
        { name: 'OREO', price: 'R$ 3,00' },
        { name: 'FLOCOS DE ARROZ', price: 'R$ 2,00' },
        { name: 'PASTA DE AMENDOIM', price: 'R$ 3,00' },
        { name: 'COCO RALADO', price: 'R$ 2,00' },
        { name: 'DOCE DE LEITE', price: 'R$ 3,00' },
        { name: 'WHEY PROTEIN', price: 'R$ 5,00' },
        { name: 'GRANOLA', price: 'R$ 3,00' },
        { name: 'LEITE EM PÓ', price: 'R$ 2,00' }
    ];

    let compY = row2Y + 95;
    for (let i = 0; i < complementList.length; i += 2) {
        const c1 = complementList[i];
        const c2 = complementList[i + 1];

        if (c1) {
            doc.save();
            doc.roundedRect(col1X + 30, compY, 260, 48, 8).fill('rgba(255,255,255,0.03)');
            doc.fillColor('#ffffff').fontSize(10.5).font('Helvetica-Bold').text(c1.name, col1X + 40, compY + 16, { width: 150, ellipsis: true });
            drawPricePill(c1.price, col1X + 210, compY + 13, 70, 22);
            doc.restore();
        }

        if (c2) {
            doc.save();
            doc.roundedRect(col1X + 310, compY, 260, 48, 8).fill('rgba(255,255,255,0.03)');
            doc.fillColor('#ffffff').fontSize(10.5).font('Helvetica-Bold').text(c2.name, col1X + 320, compY + 16, { width: 150, ellipsis: true });
            drawPricePill(c2.price, col1X + 490, compY + 13, 70, 22);
            doc.restore();
        }

        compY += 56;
    }

    doc.save();
    doc.roundedRect(col1X + 30, row2Y + 415, 540, 56, 10).fill('rgba(139, 252, 3, 0.08)');
    doc.strokeColor('rgba(139, 252, 3, 0.3)').lineWidth(1).roundedRect(col1X + 30, row2Y + 415, 540, 56, 10).stroke();
    doc.fillColor('#8bfc03').fontSize(13).font('Helvetica-Bold').text('COBERTURAS', col1X + 45, row2Y + 433);
    doc.fillColor('#ffffff').fontSize(11).font('Helvetica').text('CHOCOLATE  •  MORANGO  •  CARAMELO', col1X + 165, row2Y + 435);
    drawPricePill('R$ 2,00', col1X + 480, row2Y + 431, 75, 24);
    doc.restore();

    // PANEL 5
    drawPanelCard(col2X, row2Y, colW, rowH);
    doc.fillColor('#8bfc03').fontSize(26).font('Helvetica-Bold').text('COMBOS', col2X + 30, row2Y + 25);
    doc.fillColor('#9aa0a6').fontSize(11).font('Helvetica-Bold').text('MAIS SABOR, MAIS ENERGIA, MAIS ECONOMIA!', col2X + 30, row2Y + 58);

    doc.save();
    doc.roundedRect(col2X + 30, row2Y + 95, 260, 190, 12).fill('rgba(255,255,255,0.03)');
    doc.strokeColor('rgba(139, 252, 3, 0.3)').lineWidth(1.5).roundedRect(col2X + 30, row2Y + 95, 260, 190, 12).stroke();
    doc.fillColor('#8bfc03').fontSize(16).font('Helvetica-Bold').text('COMBO POWER', col2X + 45, row2Y + 112);
    doc.fillColor('#9aa0a6').fontSize(10).font('Helvetica').text('1 SHAKE TRADICIONAL\n+ 1 COMPLEMENTO\n+ 1 FRUTA', col2X + 45, row2Y + 138, { lineGap: 5 });
    doc.fillColor('#8bfc03').fontSize(26).font('Helvetica-Bold').text('R$ 24,90', col2X + 45, row2Y + 240);
    doc.restore();

    doc.save();
    doc.roundedRect(col2X + 310, row2Y + 95, 260, 190, 12).fill('rgba(255,255,255,0.03)');
    doc.strokeColor('rgba(139, 252, 3, 0.3)').lineWidth(1.5).roundedRect(col2X + 310, row2Y + 95, 260, 190, 12).stroke();
    doc.fillColor('#8bfc03').fontSize(16).font('Helvetica-Bold').text('COMBO TURBO', col2X + 325, row2Y + 112);
    doc.fillColor('#9aa0a6').fontSize(10).font('Helvetica').text('1 SHAKE ESPECIAL\n+ 2 COMPLEMENTOS\n+ 1 FRUTA', col2X + 325, row2Y + 138, { lineGap: 5 });
    doc.fillColor('#8bfc03').fontSize(26).font('Helvetica-Bold').text('R$ 29,90', col2X + 325, row2Y + 240);
    doc.restore();

    doc.fillColor('#ffffff').fontSize(15).font('Helvetica-Bold').text('MONTE SEU SHAKE DO SEU JEITO!', col2X + 30, row2Y + 310, { align: 'center', width: 540 });

    const steps = [
        { num: '1', title: 'ESCOLHA\nSUA BASE' },
        { num: '2', title: 'ESCOLHA\nSUAS FRUTAS' },
        { num: '3', title: 'ESCOLHA SEUS\nCOMPLEMENTOS' },
        { num: '4', title: 'ESCOLHA\nCOBERTURA' }
    ];

    let stepX = col2X + 35;
    steps.forEach(s => {
        doc.save();
        doc.roundedRect(stepX, row2Y + 345, 120, 75, 10).fill('rgba(255,255,255,0.02)');
        doc.strokeColor('rgba(139, 252, 3, 0.2)').lineWidth(1).roundedRect(stepX, row2Y + 345, 120, 75, 10).stroke();
        doc.fillColor('#8bfc03').fontSize(14).font('Helvetica-Bold').text(s.num, stepX + 10, row2Y + 355);
        doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica-Bold').text(s.title, stepX + 30, row2Y + 360, { lineGap: 2 });
        doc.restore();
        stepX += 135;
    });

    doc.fillColor('#8bfc03').fontSize(13).font('Helvetica-Bold').text('E PRONTO! SEU SHAKE DO SEU JEITO!', col2X + 30, row2Y + 445, { align: 'center', width: 540 });

    // PANEL 6
    drawPanelCard(col3X, row2Y, colW, rowH);
    if (logoBuffer) {
        try { doc.image(logoBuffer, col3X + 30, row2Y + 30, { width: 75 }); } catch (e) {}
    }
    doc.fillColor('#8bfc03').fontSize(24).font('Helvetica-Bold').text('POWER SHAKE', col3X + 120, row2Y + 35);
    doc.fillColor('#9aa0a6').fontSize(9.5).font('Helvetica-Bold').text('- SEU ALIADO NA SUA DIETA -', col3X + 120, row2Y + 65, { characterSpacing: 1 });

    const contactInfo = [
        { label: 'HORÁRIO DE FUNCIONAMENTO', val: cleanText(settingsToUse.hours || 'SEGUNDA A DOMINGO 10H ÀS 22H') },
        { label: 'PEÇA PELO WHATSAPP', val: cleanText(settingsToUse.phone || '(81) 99999-9999') },
        { label: 'SIGA NOSSO INSTAGRAM', val: cleanText(settingsToUse.instagram || '@powershake.caruaru') }
    ];

    let infoY = row2Y + 115;
    contactInfo.forEach(info => {
        doc.save();
        doc.roundedRect(col3X + 30, infoY, 545, 52, 10).fill('rgba(255,255,255,0.03)');
        doc.strokeColor('rgba(255,255,255,0.06)').lineWidth(1).roundedRect(col3X + 30, infoY, 545, 52, 10).stroke();
        doc.fillColor('#9aa0a6').fontSize(8.5).font('Helvetica-Bold').text(info.label, col3X + 45, infoY + 12);
        doc.fillColor('#8bfc03').fontSize(13).font('Helvetica-Bold').text(info.val, col3X + 45, infoY + 26);
        doc.restore();
        infoY += 62;
    });

    doc.save();
    doc.roundedRect(col3X + 30, row2Y + 310, 545, 125, 12).fill('rgba(139, 252, 3, 0.08)');
    doc.strokeColor('rgba(139, 252, 3, 0.3)').lineWidth(1.5).roundedRect(col3X + 30, row2Y + 310, 545, 125, 12).stroke();
    doc.fillColor('#ffffff').fontSize(14).font('Helvetica-Bold').text('ESCANEIE E PEÇA AGORA!', col3X + 50, row2Y + 355);
    doc.fillColor('#9aa0a6').fontSize(10).font('Helvetica').text('Acesse nosso cardápio digital\ndireto no seu celular.', col3X + 50, row2Y + 380, { lineGap: 4 });

    if (qrBuffer) {
        try { doc.image(qrBuffer, col3X + 440, row2Y + 320, { width: 105 }); } catch (e) {}
    }
    doc.restore();

    doc.fillColor('#9aa0a6').fontSize(11).font('Helvetica-Bold').text('OBRIGADO PELA PREFERÊNCIA!', col3X + 30, row2Y + 455, { align: 'center', width: 545 });

    doc.end();
};
