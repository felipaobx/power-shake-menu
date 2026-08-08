const test = require('node:test');
const assert = require('node:assert/strict');

const { applyMenuItemChange, normalizeMenuItem } = require('../api/_menu-items');

function menuFixture() {
    return {
        categories: [
            { id: 'shakes', items: [{ id: 'shake_1', name: 'Original', price: 10 }] },
            { id: 'extras', items: [] }
        ]
    };
}

test('editar item preserva o ID e nao cria duplicata', () => {
    const menu = menuFixture();
    const item = applyMenuItemChange(menu, 'shakes', 'shakes', {
        id: 'shake_1', name: 'Atualizado', price: 22
    });

    assert.equal(item.id, 'shake_1');
    assert.equal(menu.categories[0].items.length, 1);
    assert.equal(menu.categories[0].items[0].name, 'Atualizado');
    assert.equal(menu.categories[0].items[0].price, 22);
});

test('mover item entre categorias remove a copia da categoria anterior', () => {
    const menu = menuFixture();
    applyMenuItemChange(menu, 'shakes', 'extras', {
        id: 'shake_1', name: 'Original', price: 10
    });

    assert.equal(menu.categories[0].items.length, 0);
    assert.equal(menu.categories[1].items.length, 1);
    assert.equal(menu.categories[1].items[0].id, 'shake_1');
});

test('item invalido e imagem excessiva sao rejeitados antes do banco', () => {
    assert.throws(() => normalizeMenuItem({ id: 'ok', name: '' }), /Item invalido/);
    assert.throws(() => normalizeMenuItem({
        id: 'ok',
        name: 'Produto',
        image: `data:image/png;base64,${'a'.repeat(2 * 1024 * 1024)}`
    }), /imagem do item/);
});
