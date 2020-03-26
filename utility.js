const {performance} = require('perf_hooks');

// Terminal colors
const RED_COLOR_TERMINAL = "\x1b[31m";
const GREEN_COLOR_TERMINAL = "\x1b[32m";
const YELLOW_COLOR_TERMINAL = "\x1b[33m";
const RESET_COLOR_TERMINAL = "\x1b[0m";

module.exports.successMessage = (item, message) => { console.log(GREEN_COLOR_TERMINAL, `✔ ${item} ${message}.`, RESET_COLOR_TERMINAL) };
module.exports.errorMessage = (item, message) => { this.logError(`❌ ${item} ${message}.`) }; // First letter should be capitalized.
module.exports.successLoading = (itemName) => { console.log(GREEN_COLOR_TERMINAL, `✔ ${itemName} successfully loaded.`, RESET_COLOR_TERMINAL) };
module.exports.errorLoading = (itemName) => { return `❌ ${itemName} not loaded.` }; // First letter should be capitalized.
module.exports.infoMessage = (message) => { console.log(YELLOW_COLOR_TERMINAL,"🔎 ", message, RESET_COLOR_TERMINAL) };
module.exports.logError = (error) => { console.log(RED_COLOR_TERMINAL, error, RESET_COLOR_TERMINAL) };
module.exports.testIfUndefined = (item, itemName) => { if (item === undefined) { throw this.errorLoading(itemName) } else { this.successLoading(itemName); return true; } };
module.exports.timeFunction = (item, initialTime) => { console.log(`   - Loading ${item} took ${((performance.now() - initialTime)/1000).toPrecision(2)} seconds.`); }
module.exports.printTestAndTime = (itemName, item, startTime) => { if (this.testIfUndefined(item, itemName)) this.timeFunction(itemName, startTime); };
