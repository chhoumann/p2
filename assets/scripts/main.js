// Til test i browser for at se om main.js tages i brug af index.
console.log("Test");

module.exports = {};

// Test funktioner for at demonstrere Jest.
module.exports.add = function add(x,y) {
    return x + y;
}
module.exports.multiply = function multiply(x,y) {
    return x * y;
}