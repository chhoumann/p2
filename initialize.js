// Modules
const groupRec = require('./assets/scripts/groupRecommendation');
const dataHandler = require('./assets/scripts/data/dataHandler');
const loadData = require('./assets/scripts/data/loadData');
const utility = require('./utility');
const {performance} = require('perf_hooks');
const fs = require('fs');

// Constants
const arrayOfUserIds = [3, 5, 4, 2, 1]; // Used for testing. Users 1-5 are test-users.
const SEPARATOR = "----------------------------------------------";
const RATING_DB_PATH = './db/ratingDB.json';
const MOVIELENS_USER_DB_PATH = './db/movieLensUserDB.json';
const MOVIE_DB_PATH = './db/movieDB.json';
const TESTGROUP_PATH = './db/testGroup.json';
const DATABASE_MISSING_MSG = "Database does not exist or is outdated. Running initialization.";

const buildRatingDB = async () => {
    let startTime = performance.now();
    let ratingsDB = await loadData.getRatingData();
    utility.printTestAndTime("RatingDB", ratingsDB, startTime);
    return ratingsDB;
};

const buildMovieLensUserDatabase = async (ratingsDB) => {
    let startTime = performance.now();
    let MovieLensUserDB = await dataHandler.buildMovieLensUserDB(ratingsDB);
    utility.printTestAndTime("MovieLensUserDB", MovieLensUserDB, startTime);
    return MovieLensUserDB;
};

const buildMovieDB = async (ratingsDB) => {
    let startTime = performance.now();
    movieDB = await loadData.getMovieData();
    // 9742 movies in DB. The forEach makes this take a lot longer, but is necessary for recommender system.
    // Perhaps there is a better & faster solution?
    await movieDB.forEach(async movie => {
        movie.ratings = await dataHandler.getRatingsForMovieID(movie.movieId, ratingsDB);
        movie.averageRating = dataHandler.getAverage(movie.ratings);
    });
    utility.printTestAndTime("MovieDB, Ratings, & Average Ratings", movieDB, startTime);
    return movieDB;
};

const buildTestGroup = async (inputDB) => {
    let startTime = performance.now();
    let testGroup = await dataHandler.groupUsers(inputDB, 5, arrayOfUserIds);
    utility.printTestAndTime("Testgroup", testGroup, startTime);
    return testGroup;
};

const writeToFile = (path, variableToWrite) => {
    let tempJSON = JSON.stringify(variableToWrite);
    fs.writeFile(path, tempJSON, (err) => { if (err) throw err; });
};

const checkIfFileExists = (path) => {
    try {
        if (fs.existsSync(path)) {
            utility.successMessage(path, "exists"); return true;
        } else {
            utility.errorMessage(path, "does not exist"); return false;
        }
    } catch (err) { console.error(err); }
};

// Checks if relevant db files exist. If they don't, initialize will make them.
const checkIfDBExists = () => {
    if (!checkIfFileExists(MOVIELENS_USER_DB_PATH)) return false;
    if (!checkIfFileExists(MOVIE_DB_PATH)) return false;
    if (!checkIfFileExists(RATING_DB_PATH)) return false;
    if (!checkIfFileExists(TESTGROUP_PATH)) return false;
    return true;
}

// Checks if it is necessary to build database & test group.
// -   Basically used for anything that should be loaded or written before the user interacts with the web application.
// And then it starts the sever.
module.exports.initialize = async (serverStartCallback) => {
    console.log(SEPARATOR);
    if (checkIfDBExists() === false){
        utility.infoMessage(DATABASE_MISSING_MSG);
        try {
            // Building and writing ratingDB
            const ratingDB = await buildRatingDB();
            writeToFile(RATING_DB_PATH, ratingDB);
            
            // Building and writing movieLensUserDB
            const movieLensUserDB = await buildMovieLensUserDatabase(ratingDB);
            writeToFile(MOVIELENS_USER_DB_PATH, movieLensUserDB);
            
            // Building and writing movieDB
            const movieDB = await buildMovieDB(ratingDB);
            writeToFile(MOVIE_DB_PATH, movieDB);
            
            // Building and writing testgroup
            const testGroup = await buildTestGroup(movieLensUserDB);   
            writeToFile(TESTGROUP_PATH, testGroup);
            
            // groupRec.makeGroupRec(testGroup, db.movieDB, 3);
        } catch(error) { utility.logError(error) };
    };
    serverStartCallback();
    console.log(SEPARATOR);
}
