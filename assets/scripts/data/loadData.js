/* 
    Exports data so that user, rating, movie, and link-databases can be accessed easily.
*/
const neatCsv = require('neat-csv'); // Used to parse CSV files.
const fs = require('fs'); // Used to read files.
const utility = require('../../../utility'); // Using logging functions from Utility.
const {performance} = require('perf_hooks'); // Used to time the reading of the file. 

// PATHS & USER-COUNT
const MOVIES_CSV_PATH = './dataset/ml-latest-small/movies.csv';
const LINKS_CSV_PATH = './dataset/ml-latest-small/links.csv';
const RATINGS_CSV_PATH = './dataset/ml-latest-small/ratings.csv';

const RATING_DB_PATH = './db/ratingDB.json';
const MOVIELENS_USER_DB_PATH = './db/movieLensUserDB.json';
const MOVIE_DB_PATH = './db/movieDB.json';
const TESTGROUP_PATH = './db/testGroup.json';
const USER_DB_PATH = './db/dbOfUsers.json';

const CSV_TYPE = 'CSV';
const JSON_TYPE = 'JSON';

async function getData(path, type, noLog = true) {
    let result;
    try {
        let startTime = performance.now();
        result = await fs.readFile(path);
        if (noLog === false) utility.printTestAndTime(path, result, startTime);
    }
    catch(error) { 
        utility.logError(`${error.name} in loading ${error.path}!`);
        return;
    }
    if (type === CSV_TYPE) return neatCsv(result);
    if (type === JSON_TYPE) return JSON.parse(result);
};

// Getting all data with type csv
module.exports.getMovieData = async() => { return await getData(MOVIES_CSV_PATH, CSV_TYPE) };
module.exports.getLinkData = async() => { return await getData(LINKS_CSV_PATH, CSV_TYPE) };
module.exports.getRatingData = async() => { return await getData(RATINGS_CSV_PATH, CSV_TYPE) };
// Getting all data with type JSON
module.exports.getTestGroupData = async() => { return await getData(TESTGROUP_PATH, JSON_TYPE) };
module.exports.getMovieDB = async() => { return await getData(MOVIE_DB_PATH, JSON_TYPE) };
module.exports.getRatingDB = async() => { return await getData(RATING_DB_PATH, JSON_TYPE) };
module.exports.getMovieLensUserDB = async() => { return await getData(MOVIELENS_USER_DB_PATH, JSON_TYPE) };
module.exports.getUserDB = async() => { return await getData(USER_DB_PATH, JSON_TYPE) };
