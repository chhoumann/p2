// Constants
const loadData = require('./loadData');
const initialize = require('../../../initialize')
const u = require('../user/user');
const utility = require('../../../utility');
const USERS_IN_TOTAL = 610; // Amount of users in the dataset.
const GENRE_SEPARATOR = '|';

// Makes a group from selected friends by the user
module.exports.getGroupRatings = async function getGroupRatings(group) {
    const userDB = await loadData.getUserDB();
    const groupRatings = group.map(member => {
        const {moviePreferences} = userDB["users"].find((user => (user["username"].localeCompare(member)) == 0));
        return moviePreferences;
    })
    return groupRatings;
}


// Group Functionality. Default size of group is 5 users.
// Group Functionality. Default size of group is 5 users, so an optional parameter.
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

// Builds database of users. Index 0 is empty. Starts from 1 and goes to 610. See why below. FIXME: Fordi det skal stemme med brugerID?
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

// Used to get average of ratings for a movie.
module.exports.getAverage = function getAverage(ratingsForMovie) {
    let sum = 0;
    for (const entry of ratingsForMovie) {
        sum += parseFloat(entry.rating);
    }
    return sum / ratingsForMovie.length;
}

// Receives single movie entry and returns the genres in an array.
// Used to build MovieDB for Rec. Sys.
module.exports.getGenresFromMovie = function getGenresFromMovie(movieEntry) {
    // All the genres that exist in the movieDB
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
        'Film-Noir': 0, '(no genres listed)': 0
    };
    
    const genreString = movieEntry.genres;

    // In the CSV file movies are written in the form e.g.: Comedy|Crime|Thriller
    const splitString = genreString.split(GENRE_SEPARATOR);
    // Each of the elements obtained through the splitting
    splitString.forEach(genre => { genres[genre]++; });

    let genreNumArray = Object.keys(genres).map((value) => {return genres[value]});
    
    return {genres, genreNumArray};
}

// Gets movies watched based on the user's ratings.
module.exports.getMoviesWatched = (user) => {
    let moviesWatched = [];
    user.forEach(entry => {moviesWatched.push(entry.movieId)});
    return moviesWatched;
}

// Binary Search
// Modified from: https://github.com/jefelewis/algorithms-review/blob/master/search-algorithms/binary-search.js
// Works because MovieDB is already sorted.
const movieSearch = (movieDB, movieID) => {
    // Define start + end Index
    let startIndex = 0;
    let endIndex = movieDB.length - 1;
  
    // While start index is less than or equal to end index
    while(startIndex <= endIndex) {
      // Define middle index (this will change when comparing )
      let middleIndex = Math.floor((startIndex + endIndex) / 2);
  
      // Compare middle index with target for match
      if(parseFloat(movieDB[middleIndex].movieId) === parseFloat(movieID)) { return middleIndex; }
  
      // Search right side of movieDB
      if(parseFloat(movieID) > parseFloat(movieDB[middleIndex].movieId)) { startIndex = middleIndex + 1; }
  
      // Search left side of movieDB
      if(parseFloat(movieID) < parseFloat(movieDB[middleIndex].movieId)) { endIndex = middleIndex - 1; }
    }
};

// Uses binary search to find movie by its ID.
module.exports.findMovieByID = (movieID, movieDB) => {
    const indexOfMovie = movieSearch(movieDB, movieID);
    return movieDB[indexOfMovie];
}

module.exports.formatUser = (req, currentUserAmount) => {
    const username = req.query.username;
    const id = currentUserAmount + 1;
    const user = new u.User(id, username);

    return user;
}

module.exports.checkForUserInDB = async (usernameString) => {
    const userDB = (await loadData.getUserDB())["users"];
    let foundStatus = false;
    // Temp O(n) søgning...
    userDB.forEach(user => {
        if (user.username === usernameString) {
            foundStatus = true;
        }
    })
    return foundStatus;
}

const findUserInUserDB = async (user) => {
    const userDB = (await loadData.getUserDB());
    const foundUser = userDB["users"].find(person => {
        return person.username === user;
    });
    let retObj = {userDB, foundUser}
    return retObj;
}

// If something user related is changed (added friend/rating) the userDB file is rewritten
const updateUserDBFile = async (newUserDB) => {
    const USER_DB_PATH = './db/dbOfUsers.json';
    initialize.writeToFile(USER_DB_PATH, newUserDB)
}

// Given a user object the friend list of this user is returned
// FIXME: What does the foundUser property mean??
module.exports.getFriendsList = async (user) => {
    const retObj = await findUserInUserDB(user);    
    if (retObj.foundUser === -1) return false;
    return retObj.foundUser["friends"];
}

// 'requestBy' represents the user that makes the friend addition of user 'addName'
module.exports.addFriend = async (requestBy, addName) => {
    const retObj = await findUserInUserDB(requestBy);
    retObj.foundUser["friends"].push({name: addName})
    updateUserDBFile(retObj.userDB);
}

module.exports.addRatingToUser = async (username, movieDB_ID, rating, title) => {
    const retObj = await findUserInUserDB(username);
    retObj.foundUser["moviePreferences"].push({
        movieID: parseInt(movieDB_ID), rating: parseInt(rating), title
    })
    updateUserDBFile(retObj.userDB);
    console.log(`${username} logged ${rating} to movie #${movieDB_ID} | ${title}`);
    return true;
}

module.exports.getRatingsUserDB = async (username) => {
    const retObj = await findUserInUserDB(username);
    return retObj["foundUser"]["moviePreferences"];
}