// Modules
const dataHandler = require('./assets/scripts/data/dataHandler');
const loadData = require('./assets/scripts/data/loadData');
const utility = require('./utility');
const {performance} = require('perf_hooks');

// Constants
const arrayOfUserIds = [610, 609, 608, 607, 606]; // Used for testing. Users 1-5 are test-users.
const SEPARATOR = "----------------------------------------------";
const RATING_DB_PATH = './db/ratingDB.json';
const MOVIELENS_USER_DB_PATH = './db/movieLensUserDB.json';
const MOVIE_DB_PATH = './db/movieDB.json';
const TESTGROUP_PATH = './db/testGroup.json';
const USER_DB_PATH = './db/dbOfUsers.json';
const USER_MOVIES_FOR_RATING = './db/userMoviesForRating.json';

// Builds a list of top (rating over 3) movies to be rated by the users client-side
const buildMoviesForRating = async () => {
    const movieDB = await loadData.getMovieDB();
    const RATINGS_THRESHOLD = 3;
    const MIN_RATINGS = 5;

    // Gets all movies from the database that complies with the demands
    let topMovies = [];
    movieDB.forEach(movie => {
        if (movie["ratings"].length > MIN_RATINGS && movie.averageRating > RATINGS_THRESHOLD) {
            const {title, movieId, averageRating, tmdbId, year} = movie;
            topMovies.push({title, movieId, averageRating, tmdbId, year});
        }
    })
    
    utility.writeToFile(USER_MOVIES_FOR_RATING, topMovies);
    utility.successMessage('User Movies for ratings', 'now built');
} 

// Builds a database of ratings, by reading CSV file
const buildRatingDB = async (noLog = false) => {
    let startTime = performance.now();
    let ratingsDB = await loadData.getRatingData();
    if (noLog === false) utility.printTestAndTime("RatingDB", ratingsDB, startTime);
    return ratingsDB;
};

// Function can be used for user-user or other expansion of program in future use 
const buildMovieLensUserDatabase = async (ratingsDB, noLog = false) => {
    let startTime = performance.now();
    let movieLensUserDB = await dataHandler.buildMovieLensUserDB(ratingsDB);
    if (noLog === false) utility.printTestAndTime("MovieLensUserDB", movieLensUserDB, startTime);
    return movieLensUserDB;
};

// Returns an object containing the built movieDB
const buildMovieDB = async (ratingsDB, noLog = false) => {
    let startTime = performance.now();
    const movieDB = await loadData.getMovieData();
    const links = await loadData.getLinkData();
    // Adds essential data to each movie entry in the database
    await movieDB.forEach(async movie => {
        // Adds the year for each movie
        movie.year = utility.getYearFromMovieString(movie.title)
        // Finds movies TMDBIDs in the dataset links.csv file and adds it to the movie. Used to receive data on client side about movie.
        const movieLink = links.find(link => link.movieId === movie.movieId);
        movie.tmdbId = movieLink.tmdbId;
        // Finds genres from movie and adds them to both and object and array (array is used in group recommendation system)
        movie.genres = dataHandler.getGenresFromMovie(movie);
        if (movie["genres"]["genres"]["(no genres listed)"] === 1) {movie.skip = true} else {movie.skip = false};
        // Adds ratings given by datasets users
        movie.ratings = await dataHandler.getRatingsForMovieID(movie.movieId, ratingsDB);
        // Calculates average rating based on above ratings
        movie.averageRating = dataHandler.getAverage(movie.ratings);
    });
    if (noLog === false) utility.printTestAndTime("MovieDB, Ratings, & Average Ratings", movieDB, startTime);
    return movieDB;
};

// Creates a test group based on users from movielens dataset
const buildTestGroup = async (inputDB, noLog = false) => {
    let startTime = performance.now();
    // Gets 5 users from the movielens database for testing.
    let testGroup = await dataHandler.groupUsers(inputDB, 5, arrayOfUserIds);
    if (noLog === false) utility.printTestAndTime("Testgroup", testGroup, startTime);
    return testGroup;
};

// Builds the user database (our platform users)
module.exports.buildUserDB = async (noLog = true) => {
    let startTime = performance.now();
    let userDB = await loadData.getUserDB();
    if (noLog === false) utility.printTestAndTime("userDB", userDB, startTime);
    return userDB;
};


// Checks if it is necessary to build database & test group
// When the files exist there is no need to spend time rebuilding
// The files checked are basically anything that should be loaded or
// written before the user interacts with the web application
module.exports.initializeDatabase = async () => {
    console.log(SEPARATOR);
    let db = {};
    try {
        // Building and writing ratingDB
        if (!utility.checkIfFileExists(RATING_DB_PATH)) {
            db.ratingDB = await buildRatingDB();
            utility.writeToFile(RATING_DB_PATH, db.ratingDB);
        } else {
            db.ratingDB = await loadData.getRatingDB();
        };
        
         // Building and writing movieLensUserDB
         if (!utility.checkIfFileExists(MOVIELENS_USER_DB_PATH)) {
            db.movieLensUserDB = await buildMovieLensUserDatabase(db.ratingDB)
            module.exports.numberOfUsersInDB = db.movieLensUserDB.length - 1;
            utility.writeToFile(MOVIELENS_USER_DB_PATH, db.movieLensUserDB);0
        } else {
            db.movieLensUserDB = await loadData.getMovieLensUserDB();
        };
        
        // Building and writing movieDB
        if (!utility.checkIfFileExists(MOVIE_DB_PATH)) {
            db.movieDB = await buildMovieDB(db.ratingDB);
            utility.writeToFile(MOVIE_DB_PATH, db.movieDB);
        } else {
            db.movieDB = await loadData.getMovieDB();
        };
        
        // Building and writing testgroup
        if (!utility.checkIfFileExists(TESTGROUP_PATH)) {
            db.testGroup = await buildTestGroup(db.movieLensUserDB);   
            utility.writeToFile(TESTGROUP_PATH, db.testGroup);
        } else {
            db.testGroup = await loadData.getTestGroupData();
        };

        if (!utility.checkIfFileExists(USER_DB_PATH)) {
            console.log("UserDB doesn't exist.")
        };
        
        if (!utility.checkIfFileExists(USER_MOVIES_FOR_RATING)) {
            buildMoviesForRating();
            utility.infoMessage('Building...')
        };
        
    } catch(error) { utility.logError(error) };

    console.log(SEPARATOR);
}