// Vercel Serverless Function: Generate Menu PDF
// URL: /api/generate-pdf
const { createClient } = require('redis');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

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
            // Mock browser context for eval
            const mockContext = {
                window: {},
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
            
            // Convert appCode to use var instead of const/let to allow hoisting & redeclaration
            appCode = appCode
                .replace(/const /g, 'var ')
                .replace(/let /g, 'var ');

            // Wrap inside a function execution context to avoid leaking variables
            const sandbox = new Function('global', 'window', 'document', 'localStorage', `
                var MENU_DATA;
                var SETTINGS;
                var DEFAULT_MENU_DATA;
                var DEFAULT_SETTINGS;
                var orderState = { selections: {} };
                var elements = {};

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

    // Ensure menuData is valid
    if (!menuData) {
        res.status(500).send('Error: Could not retrieve menu data.');
        return;
    }

    // Async function to load image to buffer
    async function getImageBuffer(imageUrl) {
        if (!imageUrl) return null;
        
        if (imageUrl.startsWith('data:image/')) {
            try {
                const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
                return Buffer.from(base64Data, 'base64');
            } catch (e) {
                console.error('Failed to parse base64 image:', e.message);
                return null;
            }
        }
        
        if (imageUrl.startsWith('assets/') || imageUrl.startsWith('./assets/')) {
            const localPath = path.join(process.cwd(), imageUrl.replace(/^\.\//, ''));
            if (fs.existsSync(localPath)) {
                try {
                    return fs.readFileSync(localPath);
                } catch (e) {
                    console.error('Failed to read local image file:', localPath, e.message);
                }
            }
        }

        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout
                const res = await fetch(imageUrl, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (res.ok) {
                    const arrayBuffer = await res.arrayBuffer();
                    return Buffer.from(arrayBuffer);
                }
            } catch (e) {
                console.error('Failed to fetch remote image URL:', imageUrl, e.message);
            }
        }
        return null;
    }

    // 3. Generate PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Power_Shake_Cardapio.pdf"');

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(res);

    // Paint Background function
    function drawBackground() {
        doc.save();
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0c0d14');
        doc.restore();
    }

    // Paint background on subsequent pages automatically
    doc.on('pageAdded', () => {
        drawBackground();
    });

    // Paint background on first page
    drawBackground();

    // Draw Header
    doc.moveDown(1.5);
    doc.fillColor('#8bfc03')
       .fontSize(26)
       .font('Helvetica-Bold')
       .text('POWER SHAKE', { align: 'center', characterSpacing: 1 });

    doc.moveDown(0.15);

    doc.fillColor('#ffffff')
       .fontSize(9)
       .font('Helvetica')
       .text('CARDÁPIO OFICIAL E TABELA NUTRICIONAL', { align: 'center', characterSpacing: 2 });

    doc.moveDown(0.6);

    // Draw a neon green divider line
    doc.strokeColor('#8bfc03')
       .lineWidth(1.5)
       .moveTo(40, doc.y)
       .lineTo(doc.page.width - 40, doc.y)
       .stroke();

    doc.moveDown(1.2);

    // Helper to check if page break is needed
    function checkPageBreak(neededHeight) {
        if (doc.y + neededHeight > doc.page.height - 70) {
            doc.addPage();
            doc.y = 50; // top padding on new pages
        }
    }

    const cardWidth = 250;
    const cardHeight = 55;
    const gapX = 15;
    const gapY = 10;
    let col = 0;
    let rowY = doc.y;

    for (const category of menuData.categories) {
        const items = category.items || [];
        if (items.length === 0) continue;

        // If currently in the middle of a row, complete the row before printing a new header
        if (col === 1) {
            rowY += cardHeight + gapY;
            col = 0;
        }

        doc.y = rowY;
        
        // Category header height (roughly 45 points)
        checkPageBreak(45);

        // Section title
        doc.fillColor('#8bfc03')
           .fontSize(12)
           .font('Helvetica-Bold')
           .text(category.name.toUpperCase(), 50, doc.y);
        
        doc.fillColor('#9aa0a6')
           .fontSize(8)
           .font('Helvetica-Oblique')
           .text(category.subtitle || '', 50, doc.y, { paragraphGap: 10 });

        doc.moveDown(0.1);
        rowY = doc.y;

        for (const item of items) {
            // Check if we need a page break for the next row of cards
            if (col === 0) {
                if (rowY + cardHeight > doc.page.height - 70) {
                    doc.addPage();
                    rowY = 50; // reset to top of page
                }
            }

            let cardX = col === 0 ? 50 : 50 + cardWidth + gapX;
            let cardY = rowY;

            // Fetch image buffer
            let imageBuffer = null;
            if (item.image) {
                imageBuffer = await getImageBuffer(item.image);
            }

            // Draw Card background & Image (clipped)
            doc.save();
            doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 8).clip();
            doc.rect(cardX, cardY, cardWidth, cardHeight).fill('#13141f');
            
            // Draw image inside a neat left square
            const imgSize = 43;
            const imgPadding = 6;
            
            doc.save();
            doc.roundedRect(cardX + imgPadding, cardY + imgPadding, imgSize, imgSize, 6).clip();
            if (imageBuffer) {
                try {
                    doc.image(imageBuffer, cardX + imgPadding, cardY + imgPadding, {
                        width: imgSize,
                        height: imgSize,
                        fit: [imgSize, imgSize],
                        align: 'center',
                        valign: 'center'
                    });
                } catch (err) {
                    console.error('Error drawing image inside PDF:', err);
                    doc.fillColor('#8bfc03')
                       .fontSize(16)
                       .text(item.icon || '🥤', cardX + imgPadding, cardY + imgPadding + 6, { align: 'center', width: imgSize });
                }
            } else {
                doc.fillColor('#8bfc03')
                   .fontSize(16)
                   .text(item.icon || '🥤', cardX + imgPadding, cardY + imgPadding + 6, { align: 'center', width: imgSize });
            }
            doc.restore();
            doc.restore();

            // Draw card border
            doc.strokeColor('rgba(255,255,255,0.03)')
               .lineWidth(1)
               .roundedRect(cardX, cardY, cardWidth, cardHeight, 8)
               .stroke();

            // Text coordinates
            const textX = cardX + 58;
            
            // Item Name
            doc.fillColor('#ffffff')
               .fontSize(9.5)
               .font('Helvetica-Bold')
               .text(item.name, textX, cardY + 8, { width: 125, height: 11, ellipsis: true });

            // Item Price
            let priceText = item.price > 0 
                ? item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : 'Incluso';
                
            doc.fillColor('#8bfc03')
               .fontSize(9.5)
               .font('Helvetica-Bold')
               .text(priceText, cardX + 185, cardY + 8, { align: 'right', width: 54 });

            // Item Description
            let descText = item.description || '';
            if (descText) {
                doc.fillColor('#9aa0a6')
                   .fontSize(7.5)
                   .font('Helvetica')
                   .text(descText, textX, cardY + 22, { width: 180, height: 18, ellipsis: true });
            }

            // Macros Info
            let hasMacros = item.kcal > 0 || item.protein > 0;
            if (hasMacros) {
                let macrosText = `${item.kcal || 0} kcal · ${item.protein || 0}g P`;
                doc.fillColor('rgba(139, 252, 3, 0.75)')
                   .fontSize(7)
                   .font('Helvetica-Bold')
                   .text(macrosText, textX, cardY + 41);
            }

            // Toggle column pointer
            if (col === 0) {
                col = 1;
            } else {
                col = 0;
                rowY += cardHeight + gapY; // advance to next row
            }
        }

        doc.moveDown(0.5);
    }

    if (col === 1) {
        rowY += cardHeight + gapY;
    }

    doc.y = rowY;

    // Footer Address
    checkPageBreak(65);
    doc.moveDown(1);
    doc.strokeColor('#8bfc03')
       .lineWidth(1)
       .moveTo(40, doc.y)
       .lineTo(doc.page.width - 40, doc.y)
       .stroke();

    doc.moveDown(1);
    doc.fillColor('#ffffff')
       .fontSize(8.5)
       .font('Helvetica')
       .text('Rua Zeferino Galvão, nº 508, 1º andar, sala 01 - Caruaru / PE', { align: 'center' });
    doc.fillColor('#9aa0a6')
       .fontSize(8)
       .text('Em frente ao receptivo de lotação (Acima da Medic Center)', { align: 'center' });

    doc.end();
};
