const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Declare variables to prevent ReferenceErrors and hoisting issues in eval
var MENU_DATA;
var SETTINGS;
var DEFAULT_MENU_DATA;
var DEFAULT_SETTINGS;

// Mock browser objects
global.window = {
    innerWidth: 1024
};
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

// Load app.js, converting block-scoped variables to var to allow hoisting & override
let appCode = fs.readFileSync('./app.js', 'utf8');
appCode = appCode
    .replace(/const /g, 'var ')
    .replace(/let /g, 'var ');

eval(appCode);

const dataToUse = DEFAULT_MENU_DATA;

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

async function startPdfGeneration() {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const outputFilePath = './Power_Shake_Cardapio.pdf';
    const stream = fs.createWriteStream(outputFilePath);
    doc.pipe(stream);

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

    for (const category of dataToUse.categories) {
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
            const kcalVal = item.kcal || 0;
            const proteinVal = item.protein || 0;
            let macrosText = '';
            if (kcalVal > 0 && proteinVal > 0) {
                macrosText = `${kcalVal} kcal · ${proteinVal}g P`;
            } else if (kcalVal > 0) {
                macrosText = `${kcalVal} kcal`;
            } else if (proteinVal > 0) {
                macrosText = `${proteinVal}g P`;
            }

            if (macrosText) {
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
}

startPdfGeneration();
