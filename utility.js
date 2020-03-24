const {performance} = require('perf_hooks');

// Terminal colors
const RED_COLOR_TERMINAL = "\x1b[31m";
const GREEN_COLOR_TERMINAL = "\x1b[32m";
const RESET_COLOR_TERMINAL = "\x1b[0m";

module.exports.successMessage = (itemName) => { console.log(GREEN_COLOR_TERMINAL, `✔ ${itemName} successfully loaded.`, RESET_COLOR_TERMINAL) };
module.exports.errorMessage = (itemName) => { return `❌ ${itemName} not loaded.` }; // First letter should be capitalized.
module.exports.testIfUndefined = (item, itemName) => { if (item === undefined) { throw this.errorMessage(itemName) } else { this.successMessage(itemName); return true; } };
module.exports.logError = (error) => { console.log(RED_COLOR_TERMINAL, error, RESET_COLOR_TERMINAL) };
module.exports.timeFunction = (item, initialTime) => { console.log(`   - Loading ${item} took ${((performance.now() - initialTime)/1000).toPrecision(2)} seconds.`); }
module.exports.printTestAndTime = (itemName, item, startTime) => { if (this.testIfUndefined(item, itemName)) this.timeFunction(itemName, startTime); };
