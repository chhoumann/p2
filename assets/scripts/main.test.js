// Test fil for at demonstrere Jest.
const main = require('./main');

// Tester add funktionen fra main.js.
test('adds 1 + 2 to equal 3', () => {
    expect(main.add(1,2)).toBe(3);
});

// Tester multiply funktionen fra main.js
test('multiplies 3 by 3 to equal 9', () => {
    expect(main.multiply(3,3)).toBe(9);
})