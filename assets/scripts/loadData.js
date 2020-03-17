/* 
    Exports (intended to app.js) so that user, rating, movie, and link-databases can be accessed easily.
    To use in app.js one should include a setTimeout() such that the functions can load the
    files and parse the data, otherwise it will fail.

    Most indices are kind of 'distorted' - so 0 is 1 and 1 is 2 etc.
*/

const neatCsv = require ('neat-csv'); // Used to parse CSV files.
const fs = require('fs'); // Used to read files.
module.exports = {};

// PATHS & USER-COUNT
const MOVIES_CSV_PATH = './dataset/ml-latest-small/movies.csv';
const LINKS_CSV_PATH = './dataset/ml-latest-small/links.csv';
const RATINGS_CSV_PATH = './dataset/ml-latest-small/ratings.csv';
const USERS_IN_TOTAL = 610;

// Database-arrays
let movies; // movies.csv goes inside here.
let links; // links.csv goes inside here.
let ratings; // ratings.csv goes inside here.
let userDB = []; // Indices from 1-610 are users (0 is empty). Inside is an object consisting of 
                 // the movies that the user has rated and the given ratings.

// Parse movies.csv and save results to movies-array
fs.readFile(MOVIES_CSV_PATH, async (err, data) => {
    // Error handling. If there is an error, log it and exit function (return).
    if (err) {
        console.log(err);
        return;
    }
    const result = await neatCsv(data);
    module.exports.movies = movies = result;
});

// Parse links.csv and save results to links-array
fs.readFile(LINKS_CSV_PATH, async (err, data) => {
    // Error handling. If there is an error, log it and exit function (return).
    if (err) {
        console.log(err);
        return;
    }
    const result = await neatCsv(data);
    module.exports.links = links = result;
});

// Parse ratings.csv and and save results to ratings-array
fs.readFile(RATINGS_CSV_PATH, async (err, data) => {
    // Error handling. If there is an error, log it and exit function (return).
    if (err) {
        console.log(err);
        return;
    }
    const result = await neatCsv(data);
    module.exports.ratings = ratings = result;    
});

// In regards to the project, this function is more of a 'nice-to-have'.
// Used to get average of array of integers.
module.exports.getAverage = function getAverage(arrayOfIntegers) {
    let sum = 0;
    for (let i = 0; i < arrayOfIntegers.length; i++) {
        sum += parseInt(arrayOfIntegers[i].rating);
    }
    return sum / arrayOfIntegers.length;
}

// In regards to the project, this function is more of a 'nice-to-have'.
// Gets ratings for movie depending on given movieId.
module.exports.getRatingsForMovieID = function getRatingsForMovieID(id) {
    let results = [];
    ratings.forEach(rating => {
        if (rating.movieId === id) { results.push(rating)};
    });
    return results;
}

// Used to get the ratings for each individual user.
module.exports.getRatingsForUser = function getRatingsForUser(index) {
    let results = [];
    ratings.forEach(rating => {
        if (rating.userId == index) {
            results.push({
                movieId: rating.movieId,
                ratings: rating.rating
            });
        }
    })
    return results;
}

// Builds database of users. Index 0 is empty. Starts from 1 and goes to 610. See why below.
module.exports.buildUserDB = function buildUserDB() {
    // There is a total of 610 users in the ml-latest-small/ratings.csv file, hence:
    for (let i = 0; i <= USERS_IN_TOTAL; i++) {
        userDB.push(this.getRatingsForUser(i));
    }
    return userDB;
}