/* 
    Exports data so that user, rating, movie, and link-databases can be accessed easily.
    To use, one should include a setTimeout() such that the functions can load the
        files and parse the data, otherwise it will fail.
*/
const neatCsv = require ('neat-csv'); // Used to parse CSV files.
const fs = require('fs').promises; // Used to read files.

// PATHS & USER-COUNT
const MOVIES_CSV_PATH = './dataset/ml-latest-small/movies.csv';
const LINKS_CSV_PATH = './dataset/ml-latest-small/links.csv';
const RATINGS_CSV_PATH = './dataset/ml-latest-small/ratings.csv';

async function getData(path) {
    try {
        const result = await fs.readFile(path);
        return neatCsv(result);
    } catch(e) {
        console.error(e);
    }
};

module.exports.getMovieData = async() => { return await getData(MOVIES_CSV_PATH) };
module.exports.getLinkData = async() => { return await getData(LINKS_CSV_PATH) };
module.exports.getRatingData = async() => { return await getData(RATINGS_CSV_PATH) };
