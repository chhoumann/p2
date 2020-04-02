const loadData = require('./loadData');
const u = require('../user/user');
const utility = require('../../../utility');
const USERS_IN_TOTAL = 610; // Amount of users in the dataset.
const GENRE_SEPARATOR = '|';

// Group Functionality. Default size of group is 5 users.
module.exports.groupUsers = function groupUsers(fromArrayOfUsers, groupSize = 5, arrayOfUserIds) {
    let tempGroup = [];
    for(let i = 0; i < groupSize; i++) {
        tempGroup.push(fromArrayOfUsers[arrayOfUserIds[i]]);
    }
    return tempGroup;
}

// Used to get the ratings for each individual user.
module.exports.getRatingsForUser = async function getRatingsForUser(userID, ratingsData) {
    let results = [];
    ratingsData.forEach(rating => {
        if (rating.userId == userID) {
            results.push({
                movieId: rating.movieId,
                ratings: rating.rating
            });
        }
    });
    return results;
}

// Builds database of users. Index 0 is empty. Starts from 1 and goes to 610. See why below.
module.exports.buildMovieLensUserDB = async function buildMovieLensUserDB(ratingsData) {
    let userDB = [];
    try {
        for (let i = 0; i <= USERS_IN_TOTAL; i++) {
            await this.getRatingsForUser(i, ratingsData).then(res => userDB.push(res));
        }
    }
    catch(error) {
        utility.logError("Could not build MovieLens UserDB.");
        return;
    }
    return userDB;
}

// In regards to the project, this function is more of a 'nice-to-have'.
// Gets ratings for movie depending on given movieId.
module.exports.getRatingsForMovieID = async function getRatingsForMovieID(id, ratingsData) {
    let results = [];
    try {
        // let tempArray = ratingsData;
        results = ratingsData.filter(item => item.movieId === id);
        /* tempArray.forEach(rating => {
            if (rating.movieId === id) { results.push(rating)};
        }); */
    }
    catch(error) {
        utility.logError(`Could not get ratings for movie with ID: ${id}`);
        return;
    }
    return results;
}

// In regards to the project, this function is more of a 'nice-to-have'.
// Used to get average of array of integers.
module.exports.getAverage = function getAverage(arrayOfIntegers) {
    let sum = 0;
    for (let i = 0; i < arrayOfIntegers.length; i++) {
        sum += parseInt(arrayOfIntegers[i].rating);
    }
    return sum / arrayOfIntegers.length;
}

// Receives single movie entry and returns the genres in an array.
module.exports.getGenresFromMovie = function getGenresFromMovie(movieEntry) {
    const genreString = movieEntry.genres;
    return genreString.split(GENRE_SEPARATOR);
}

module.exports.getMoviesWatched = (user) => {
    let moviesWatched = [];
    user.forEach(entry => {moviesWatched.push(entry.movieId)});
    return moviesWatched;
}

module.exports.matchGenresByUser = (genresWatchedByUser) => {
    let genres = {
    'Adventure': 0, 'Animation': 0,
    'Children': 0,  'Comedy': 0,
    'Fantasy': 0,   'Romance': 0,
    'Drama': 0,     'Action': 0,
    'Crime': 0,     'Thriller': 0,
    'Horror': 0,    'Mystery': 0,
    'Sci-Fi': 0,    'War': 0,
    'Musical': 0,   'Documentary': 0,
    'IMAX': 0,      'Western': 0,
    'Film-Noir': 0
    };
    genresWatchedByUser.forEach(genre => { genres[genre]++; });
    
    return genres;
};

module.exports.matchGenresBetweenMovies = (movie1, movie2) => {
    let matches = 0;
    let genres = {
        'Adventure': 0, 'Animation': 0,
        'Children': 0,  'Comedy': 0,
        'Fantasy': 0,   'Romance': 0,
        'Drama': 0,     'Action': 0,
        'Crime': 0,     'Thriller': 0,
        'Horror': 0,    'Mystery': 0,
        'Sci-Fi': 0,    'War': 0,
        'Musical': 0,   'Documentary': 0,
        'IMAX': 0,      'Western': 0,
        'Film-Noir': 0
    };

    movie1["genres"].forEach(genre => { if (movie2["genres"].includes(genre)) {/* genres[genre]++; */ matches++} });
    
    return {
        matchedWith: parseInt(movie2.movieId),
        matchesAmount: matches,
        genreMatches: genres
    };
};

module.exports.formatUser = (req, currentUserAmount) => {
    const username = req.body.username;
    const password = req.body.password;
    const id = currentUserAmount + 1;
    const user = new u.User(id, username, password);

    return user;
}