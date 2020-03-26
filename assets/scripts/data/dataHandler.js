const loadData = require('./loadData');
const utility = require('../../../utility');
const USERS_IN_TOTAL = 610; // Amount of users in the dataset.

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
    catch {
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
    catch {
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