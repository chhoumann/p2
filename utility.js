const {performance} = require('perf_hooks');
const chalk = require('chalk');
const fs = require('fs');
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
// Used because of issues with RAM (no longer used)
module.exports.logMemoryUsage = () => {
    const used = process.memoryUsage();
    for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
}
module.exports.newUserConsoleMessage = (user) => { log(chalk.cyan(`New user: #${user.id} - ${chalk.bold(user.username)}!`)) }

// Seperates the year from the title, so we can sort by year later.
module.exports.getYearFromMovieString = (title) => {
    const splitMovieTitle = title.split("");
    const indexOfParenthesis = splitMovieTitle.lastIndexOf(')');

    // Adds the 4 elements to the year array. Every year is always 4 characters long.
    let year = splitMovieTitle.splice(-4 + indexOfParenthesis, 4).join("");

    // If the string contained a year we add this property to the movie in the movieDB
    if(indexOfParenthesis) {
        year = Number(year);
        if(!isNaN(year)){
            return year;
        }
    }
}
// Given a variable and a path, writes the variable to a file
module.exports.writeToFile = (path, variableToWrite) => {
    let tempJSON = JSON.stringify(variableToWrite);
    fs.writeFile(path, tempJSON, (err) => { if (err) throw err; });
};

// Given a file path as string, return whether it is valid by referencing file system
module.exports.checkIfFileExists = (path) => {
    try {
        if (fs.existsSync(path)) {
            this.successMessage(path, "exists"); return true;
        } else {
            this.errorMessage(path, "does not exist"); return false;
        }
    } catch (err) { console.error(err); }
};