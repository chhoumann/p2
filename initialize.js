// Modules
const groupRec = require('./assets/scripts/recSys/groupRecommendation');
const pearsonCorrelation = require('./assets/scripts/recSys/pearsonCorrelation');
const dataHandler = require('./assets/scripts/data/dataHandler');
const loadData = require('./assets/scripts/data/loadData');
const utility = require('./utility');
const {performance} = require('perf_hooks');
const fs = require('fs');

// Constants
const arrayOfUserIds = [45, 6, 9, 8, 10]; // Used for testing. Users 1-5 are test-users.
const SEPARATOR = "----------------------------------------------";
const RATING_DB_PATH = './db/ratingDB.json';
const MOVIELENS_USER_DB_PATH = './db/movieLensUserDB.json';
const MOVIE_DB_PATH = './db/movieDB.json';
const TESTGROUP_PATH = './db/testGroup.json';
const USER_DB_PATH = './db/dbOfUsers.json';
const DATABASE_MISSING_MSG = "Database does not exist or is outdated. Running initialization.";

const buildRatingDB = async (noLog = false) => {
    let startTime = performance.now();
    let ratingsDB = await loadData.getRatingData();
    if (noLog === false) utility.printTestAndTime("RatingDB", ratingsDB, startTime);
    return ratingsDB;
};

const buildMovieLensUserDatabase = async (ratingsDB, noLog = false) => {
    let startTime = performance.now();
    let MovieLensUserDB = await dataHandler.buildMovieLensUserDB(ratingsDB);
    if (noLog === false) utility.printTestAndTime("MovieLensUserDB", MovieLensUserDB, startTime);
    return MovieLensUserDB;
};

const buildMovieDB = async (ratingsDB, noLog = false) => {
    let startTime = performance.now();
    const movieDB = await loadData.getMovieData();
    // 9742 movies in DB. The forEach makes this take a lot longer, but is necessary for recommender system.
    // Perhaps there is a better & faster solution?
    await movieDB.forEach(async movie => {
        movie.genres = dataHandler.getGenresFromMovie(movie);
        if (movie["genres"]["genres"]["(no genres listed)"] === 1) {movie.skip = true} else {movie.skip = false};
        movie.ratings = await dataHandler.getRatingsForMovieID(movie.movieId, ratingsDB);
        movie.averageRating = dataHandler.getAverage(movie.ratings);
    });
    if (noLog === false) utility.printTestAndTime("MovieDB, Ratings, & Average Ratings", movieDB, startTime);
    return movieDB;
};

const buildTestGroup = async (inputDB, noLog = false) => {
    let startTime = performance.now();
    let testGroup = await dataHandler.groupUsers(inputDB, 4, arrayOfUserIds);
    if (noLog === false) utility.printTestAndTime("Testgroup", testGroup, startTime);
    return testGroup;
};

module.exports.buildUserDB = async (noLog = true) => {
    let startTime = performance.now();
    let userDB = await loadData.getUserDB();
    if (noLog === false) utility.printTestAndTime("userDB", userDB, startTime);
    return userDB;
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
    if (!checkIfFileExists(USER_DB_PATH)) return false;
    return true;
}

// Checks if it is necessary to build database & test group.
// -   Basically used for anything that should be loaded or written before the user interacts with the web application.
// And then it starts the sever.
module.exports.initialize = async (serverStartCallback) => {
    console.log(SEPARATOR);
    let db = {};
    if (checkIfDBExists() === false) {
        utility.infoMessage(DATABASE_MISSING_MSG);
        try {
            // Building and writing ratingDB
            db.ratingDB = await buildRatingDB();
            writeToFile(RATING_DB_PATH, db.ratingDB);
            
            // Building and writing movieLensUserDB
            db.movieLensUserDB = await buildMovieLensUserDatabase(db.ratingDB);
            writeToFile(MOVIELENS_USER_DB_PATH, db.movieLensUserDB);
            
            // Building and writing movieDB
            db.movieDB = await buildMovieDB(db.ratingDB);
            writeToFile(MOVIE_DB_PATH, db.movieDB);
            
            // Building and writing testgroup
            db.testGroup = await buildTestGroup(db.movieLensUserDB);   
            writeToFile(TESTGROUP_PATH, db.testGroup);
            
            // console.log(pearsonCorrelation.getCorrelation(db.testGroup, 0, 1));
            // console.log(pearsonCorrelation.getCorrelation(testGroup, 0, 1));
        } catch(error) { utility.logError(error) };
    }
    else {
        db.ratingDB = await loadData.getRatingDB();
        db.movieLensUserDB = await loadData.getMovieLensUserDB();
        db.movieDB = await loadData.getMovieDB();
        db.testGroup = await loadData.getTestGroupData();
        utility.infoMessage("Necessary files exist. Starting server...")
        groupRec.makeGroupRec(db.testGroup, db.movieDB, 3);
        //console.log(db.movieDB[0]);
        
        /* console.log(db.movieDB[0]);
        let sum = 0;
        for(let i = 9742; i > 0; i--) { sum += i - 1; }
        console.log(9742 + sum);
        utility.logMemoryUsage(); */
        //console.log(dataHandler.matchGenresBetweenMovies(db.movieDB[0], db.movieDB[1]));
    }
    serverStartCallback();
    console.log(SEPARATOR);
    return db;
}
