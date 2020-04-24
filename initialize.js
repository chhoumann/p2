// Modules
const dataHandler = require('./assets/scripts/data/dataHandler');
const loadData = require('./assets/scripts/data/loadData');
const utility = require('./utility');
const {performance} = require('perf_hooks');
const fs = require('fs');

// Constants
const arrayOfUserIds = [610, 609, 608, 607, 606]; // Used for testing. Users 1-5 are test-users.
const SEPARATOR = "----------------------------------------------";
const RATING_DB_PATH = './db/ratingDB.json';
const MOVIELENS_USER_DB_PATH = './db/movieLensUserDB.json';
const MOVIE_DB_PATH = './db/movieDB.json';
const TESTGROUP_PATH = './db/testGroup.json';
const USER_DB_PATH = './db/dbOfUsers.json';
const USER_MOVIES_FOR_RATING = './db/userMoviesForRating.json';

// Builds a top 100 movies list to be rated by the users on the client
const buildMoviesForRating = async () => {
    let index = [];
    let top100Movies = [];
    const movieDB = await loadData.getMovieDB();

    movieDB.forEach(movie => {
        if (movie["ratings"].length > 5 && movie.averageRating > 3.5) {
            // Using unshift (adding to beginning of array) means getting the newest movies from the movieDB
            index.unshift({title: movie.title, id: movie.movieId, avgRating: movie.averageRating, tmdbId: movie.tmdbId});
        }
    });

    // If the array is sorted the top 100 movies are primarily very old 
    // index.sort((a,b) => (a.avgRating > b.avgRating) ? -1 : 1);
    
    // The first 100 elements in the index array are assigned the top100Movies
    top100Movies = index.slice();

    this.writeToFile(USER_MOVIES_FOR_RATING, top100Movies);
    utility.successMessage('User Movies for ratings', 'now built')
} 

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
    const links = await loadData.getLinkData();
    // 9742 movies in DB. The forEach makes this take a lot longer, but is necessary for recommender system.
    // Perhaps there is a better & faster solution?
    await movieDB.forEach(async movie => {

        // The code below adds the year for each movie
        // TODO: MOVE CODE TO RELEVANT PLACE (Christian pls help)
        // TODO: Make it prettier =) 

        // Split each character in the title into individual elements
        let splitMovieTitle = movie["title"].split((""));

        // Finds last index of ')', which is always the year of the movie
        let index = splitMovieTitle.lastIndexOf(')');
        let year = [];

        // Adds the 4 elements to the year array. Every year is always 4 characters long.
        year.push(splitMovieTitle[index - 4] + splitMovieTitle[index - 3] + splitMovieTitle[index - 2] + splitMovieTitle[index - 1]);

        // If the string contained a year we add this property to the movie in the movieDB
        if(index) {
            year = Number(year);
            if(!isNaN(year)){
                movie.year = year;
            }
        }
        const movieLink = links.find(link => link.movieId === movie.movieId);
        movie.tmdbId = movieLink.tmdbId;
        movie.genres = dataHandler.getGenresFromMovie(movie);
        if (movie["genres"]["genres"]["(no genres listed)"] === 1) {movie.skip = true} else {movie.skip = false};
        movie.ratings = await dataHandler.getRatingsForMovieID(movie.movieId, ratingsDB);
        movie.averageRating = dataHandler.getAverage(movie.ratings);
    });
    if (noLog === false) utility.printTestAndTime("MovieDB, Ratings, & Average Ratings", movieDB, startTime);
    console.log(movieDB);
    return movieDB;
};

const buildTestGroup = async (inputDB, noLog = false) => {
    let startTime = performance.now();
    let testGroup = await dataHandler.groupUsers(inputDB, 5, arrayOfUserIds);
    if (noLog === false) utility.printTestAndTime("Testgroup", testGroup, startTime);
    return testGroup;
};

module.exports.buildUserDB = async (noLog = true) => { // noLog parameter just to toggle print to console or not
    let startTime = performance.now();
    let userDB = await loadData.getUserDB();
    if (noLog === false) utility.printTestAndTime("userDB", userDB, startTime);
    return userDB;
};

// FIXME: ? Maybe move this to dataHandler?
module.exports.writeToFile = (path, variableToWrite) => {
    let tempJSON = JSON.stringify(variableToWrite);
    fs.writeFile(path, tempJSON, (err) => { if (err) throw err; });
};

// Given a file path as string, return whether it is valid by referencing file system
const checkIfFileExists = (path) => {
    try {
        if (fs.existsSync(path)) {
            utility.successMessage(path, "exists"); return true;
        } else {
            utility.errorMessage(path, "does not exist"); return false;
        }
    } catch (err) { console.error(err); }
};

// Checks if it is necessary to build database & test group.
// - Basically used for anything that should be loaded or written before the user interacts with the web application.
// And then it starts the sever.
module.exports.initializeDatabase = async () => {
    console.log(SEPARATOR);
    let db = {};
    try {
        test();

        // Building and writing ratingDB
        if (!checkIfFileExists(RATING_DB_PATH)) {
            db.ratingDB = await buildRatingDB();
            this.writeToFile(RATING_DB_PATH, db.ratingDB);
        } else {
            db.ratingDB = await loadData.getRatingDB();
        };
        
        // Building and writing movieLensUserDB
        if (!checkIfFileExists(MOVIELENS_USER_DB_PATH)) {
            db.movieLensUserDB = await buildMovieLensUserDatabase(db.ratingDB)
            this.writeToFile(MOVIELENS_USER_DB_PATH, db.movieLensUserDB);
        } else {
            db.movieLensUserDB = await loadData.getMovieLensUserDB();
        };
        
        // Building and writing movieDB
        if (!checkIfFileExists(MOVIE_DB_PATH)) {
            db.movieDB = await buildMovieDB(db.ratingDB);
            this.writeToFile(MOVIE_DB_PATH, db.movieDB);
        } else {
            db.movieDB = await loadData.getMovieDB();
        };
        
        // Building and writing testgroup
        if (!checkIfFileExists(TESTGROUP_PATH)) {
            db.testGroup = await buildTestGroup(db.movieLensUserDB);   
            this.writeToFile(TESTGROUP_PATH, db.testGroup);
        } else {
            db.testGroup = await loadData.getTestGroupData();
        };

        if (!checkIfFileExists(USER_DB_PATH)) {
            console.log("UserDB doesn't exist.")
        }
        if (!checkIfFileExists(USER_MOVIES_FOR_RATING)) {
            buildMoviesForRating();
            utility.infoMessage('Building...')
        }
        
    } catch(error) { utility.logError(error) };

    console.log(SEPARATOR);

    return db;
}