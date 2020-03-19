const loadData = require('./loadData');
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
module.exports.getRatingsForUser = async function getRatingsForUser(index, ratingsData) {
    let results = [];
    ratingsData.forEach(rating => {
        if (rating.userId == index) {
            results.push({
                movieId: rating.movieId,
                ratings: rating.rating
            });
        }
    });
    return results;
}

// Builds database of users. Index 0 is empty. Starts from 1 and goes to 610. See why below.
module.exports.buildMovieLensUserDB = async function buildMovieLensUserDB() {
    let userDB = [];
    let ratingsData;
    await loadData.getRatingData().then(res => ratingsData = res);
    for (let i = 0; i <= USERS_IN_TOTAL; i++) {
        await this.getRatingsForUser(i, ratingsData).then(res => userDB.push(res));
    }
    return userDB;
}

// In regards to the project, this function is more of a 'nice-to-have'.
// Gets ratings for movie depending on given movieId.
module.exports.getRatingsForMovieID = async function getRatingsForMovieID(id) {
    let results = [];
    let tempArray = await loadData.getRatingData();
    tempArray.forEach(rating => {
        if (parseFloat(rating.movieId) === id) { results.push(rating)};
    });
    return results;
}