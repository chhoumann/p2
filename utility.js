const {performance} = require('perf_hooks');
const chalk = require('chalk');
const log = console.log;

module.exports.successMessage = (item, message) => { log(chalk.green(`✔ ${item} ${message}.`)) };
module.exports.errorMessage = (item, message) => { this.logError(`❌ ${item} ${message}.`) }; // First letter should be capitalized.
module.exports.successLoading = (itemName) => { log(chalk.green(`✔ ${itemName} successfully loaded.`)) };
module.exports.errorLoading = (itemName) => { return `❌ ${itemName} not loaded.` }; // First letter should be capitalized.
module.exports.infoMessage = (message) => { log(chalk.yellow("🔎 ", message)) };
module.exports.logError = (error) => { log(chalk.red(error)) };
module.exports.testIfUndefined = (item, itemName) => { if (item === undefined) { throw this.errorLoading(itemName) } else { this.successLoading(itemName); return true; } };
module.exports.timeFunction = (item, initialTime) => { log(`   - Loading ${item} took ${((performance.now() - initialTime)/1000).toPrecision(2)} seconds.`); }
module.exports.printTestAndTime = (itemName, item, startTime) => { if (this.testIfUndefined(item, itemName)) this.timeFunction(itemName, startTime); };
// (Test) For finding the total amount of genres as well as their names:
module.exports.getTotalGenresInDB = (movieDB) => {
    let totalMovieGenres = [];
    movieDB.forEach(movie => {
        totalMovieGenres.push(movie.genres);
    })
    totalMovieGenres = Array.prototype.concat.apply([], totalMovieGenres);
    let unique = totalMovieGenres.filter((v, i, a) => a.indexOf(v) === i); 
    console.log(unique);
    console.log(unique.length);
}
module.exports.reduceArray = (arrayOfArrays) => { return Array.prototype.concat.apply([], arrayOfArrays)};
module.exports.serverRunningMsg = (port) => { log(chalk.bold.yellow(`\n Server successfully running at http://127.0.0.1:${port}/`)) };
module.exports.logMemoryUsage = () => {
    const used = process.memoryUsage();
    for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
}
module.exports.newUserConsoleMessage = (user) => { log(chalk.cyan(`New user: #${user.id} - ${chalk.bold(user.username)}!`)) }
// This (below) needs to go somewhere else.
module.exports.usernameDuplicateChecker = (arrayOfUsers, username) => {
    let result = true;
    arrayOfUsers.forEach(user => {
        if (user["username"] === username) result = false;
    });
    return result;
}