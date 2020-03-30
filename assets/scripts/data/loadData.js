/* 
    Exports data so that user, rating, movie, and link-databases can be accessed easily.
    To use, one should include a setTimeout() such that the functions can load the
        files and parse the data, otherwise it will fail.
*/
const neatCsv = require('neat-csv'); // Used to parse CSV files.
const fs = require('fs').promises; // Used to read files.
const utility = require('../../../utility');
const {performance} = require('perf_hooks');

// PATHS & USER-COUNT
const MOVIES_CSV_PATH = './dataset/ml-latest-small/movies.csv';
const LINKS_CSV_PATH = './dataset/ml-latest-small/links.csv';
const RATINGS_CSV_PATH = './dataset/ml-latest-small/ratings.csv';

const RATING_DB_PATH = './db/ratingDB.json';
const MOVIELENS_USER_DB_PATH = './db/movieLensUserDB.json';
const MOVIE_DB_PATH = './db/movieDB.json';
const TESTGROUP_PATH = './db/testGroup.json';

async function getData(path) {
    let result;
    try {
        let startTime = performance.now();
        result = await fs.readFile(path);
        utility.printTestAndTime(path, result, startTime);
    }
    catch(error) { 
        utility.logError(`${error.name} in loading ${error.path}!`);
        return;
    }
    return neatCsv(result);
};

module.exports.getMovieData = async() => { return await getData(MOVIES_CSV_PATH) };
module.exports.getLinkData = async() => { return await getData(LINKS_CSV_PATH) };
module.exports.getRatingData = async() => { return await getData(RATINGS_CSV_PATH) };
module.exports.getTestGroupData = async() => { return await getData(TESTGROUP_PATH) };

module.exports.getMovieDB = async() => { return await getData(MOVIE_DB_PATH) };
module.exports.getRatingDB = async() => { return await getData(RATING_DB_PATH) };
module.exports.getMovieLensUserDB = async() => { return await getData(MOVIELENS_USER_DB_PATH) };
