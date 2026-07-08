const fs = require('fs');
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

// Load app.js, converting block-scoped variables to var to allow hoisting and override
let appCode = fs.readFileSync('./app.js', 'utf8');
appCode = appCode
    .replace(/const /g, 'var ')
    .replace(/let /g, 'var ');

eval(appCode);

const dataToUse = DEFAULT_MENU_DATA;

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
doc.moveDown(1);
doc.fillColor('#8bfc03')
   .fontSize(28)
   .font('Helvetica-Bold')
   .text('POWER SHAKE', { align: 'center' });

doc.moveDown(0.2);

doc.fillColor('#ffffff')
   .fontSize(10)
   .font('Helvetica')
   .text('CARDÁPIO OFICIAL INTERATIVO', { align: 'center', characterSpacing: 2 });

doc.moveDown(0.6);

// Draw a neon green divider line
doc.strokeColor('#8bfc03')
   .lineWidth(2)
   .moveTo(40, doc.y)
   .lineTo(doc.page.width - 40, doc.y)
   .stroke();

doc.moveDown(1.5);

// Helper to check if page break is needed
function checkPageBreak(neededHeight) {
    if (doc.y + neededHeight > doc.page.height - 70) {
        doc.addPage();
        doc.y = 50; // top padding on new pages
    }
}

dataToUse.categories.forEach(category => {
    const items = category.items || [];
    if (items.length === 0) return;

    // Category header height (roughly 45 points)
    checkPageBreak(45);

    // Section title
    doc.fillColor('#8bfc03')
       .fontSize(14)
       .font('Helvetica-Bold')
       .text(category.name.toUpperCase(), 50, doc.y);
    
    doc.fillColor('#9aa0a6')
       .fontSize(8.5)
       .font('Helvetica-Oblique')
       .text(category.subtitle || '', 50, doc.y, { paragraphGap: 12 });

    doc.moveDown(0.2);

    items.forEach(item => {
        // Individual item block height (roughly 35 points)
        checkPageBreak(35);

        let currentY = doc.y;

        // Print item name
        doc.fillColor('#ffffff')
           .fontSize(10)
           .font('Helvetica-Bold')
           .text(item.name, 50, currentY);

        // Print macros & description
        let hasMacros = item.kcal > 0 || item.protein > 0;
        let detailsText = '';
        if (hasMacros) {
            detailsText = `${item.kcal || 0} kcal | ${item.protein || 0}g P`;
        }
        if (item.description) {
            detailsText += detailsText ? ` (${item.description})` : item.description;
        }
        
        if (detailsText) {
            doc.fillColor('#9aa0a6')
               .fontSize(7.5)
               .font('Helvetica')
               .text(detailsText, 50, doc.y);
        }

        // Print Price (aligned to the right margin)
        let priceText = item.price > 0 
            ? item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : 'Incluso';
            
        doc.fillColor('#8bfc03')
           .fontSize(10)
           .font('Helvetica-Bold')
           .text(priceText, doc.page.width - 140, currentY, { align: 'right', width: 100 });

        doc.y = Math.max(doc.y, currentY + 28);
        doc.moveDown(0.25);
    });

    doc.moveDown(0.8);
});

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

stream.on('finish', () => {
    console.log('PDF Generated successfully!');
});
