const loadData = require('./loadData');
const dataHandler = require('./dataHandler');

// ---------- TESTING loadData.js ----------

// Constants for testing.
const MOVIES_IN_MOVIE_DB = 9742;
const FIRST_MOVIE_IN_DB = "Toy Story (1995)";
const LINKS_IN_LINK_DB = 9742;
const FIRST_TMDB_ID_IN_LINK_DB = 862;
const RATINGS_IN_RATING_DB = 100836;
const FIRST_RATING_IN_RATING_DB = 4;

test('Loads movie data', async () => {
    let tempMovieDB;
    await loadData.getMovieData().then(res => tempMovieDB = res);
    expect(tempMovieDB.length).toEqual(MOVIES_IN_MOVIE_DB);
    expect(tempMovieDB[0].title).toEqual(FIRST_MOVIE_IN_DB);
});

test('Loads link data', async () => {
    let tempLinkDB;
    await loadData.getLinkData().then(res => tempLinkDB = res);
    expect(tempLinkDB.length).toEqual(LINKS_IN_LINK_DB);
    expect(parseInt(tempLinkDB[0].tmdbId)).toEqual(FIRST_TMDB_ID_IN_LINK_DB); // TMDB ID of Movie #1 (Toy Story) is 862.
});

test('Loads rating data', async () => {
    let tempRatingDB;
    await loadData.getRatingData().then(res => tempRatingDB = res);
    expect(tempRatingDB.length).toEqual(RATINGS_IN_RATING_DB);
    expect(parseInt(tempRatingDB[0].rating)).toEqual(FIRST_RATING_IN_RATING_DB);
});
// -----------------------------------------

// ---------- Testing dataHandler.js -------

// Constants for testing.
const USERS_IN_DB = 611; // Total of 610 users. First index in array is empty.
const USER_TO_TEST = 1;
const USER_TO_TEST_HAS_X_RATINGS = 232;
const USER_RATING_ID = 0;
const USER_GAVE_RATING = 4.0;
const MOVIE_ID_TO_TEST = "1";
const MOVIE_HAS_X_RATINGS = 215;

test('Builds MovieLens User Database', async () => {
    let ratingsData = await loadData.getRatingDB();
    await dataHandler.buildMovieLensUserDB(ratingsData)
    .then( result => {
        expect(result.length).toEqual(USERS_IN_DB)
    });
});

test('Finds all ratings for specific user', async () => {
    let userData = await dataHandler.getRatingsForUser(USER_TO_TEST, await loadData.getRatingData());
    expect(userData.length).toEqual(USER_TO_TEST_HAS_X_RATINGS);
    expect(parseFloat(userData[USER_RATING_ID].ratings)).toEqual(USER_GAVE_RATING);
});

test('Gets ratings for movie, given an id', async () => {
    let ratingsData = await loadData.getRatingDB();
    let tempRatings = await dataHandler.getRatingsForMovieID(MOVIE_ID_TO_TEST, ratingsData);
    expect(tempRatings.length).toEqual(MOVIE_HAS_X_RATINGS)
});

test('Finds movie by ID 1', async () => {
    const movieDB = await loadData.getMovieDB();
    const {title} = dataHandler.findMovieByID(MOVIE_ID_TO_TEST, movieDB)
    
    expect(title).toBe('Toy Story (1995)');
});

test('User "Christian" exists in UserDB', async () => {
    const foundStatus = await dataHandler.checkForUserInDB('Christian');
    expect(foundStatus).toBe(true);
});

test('Gets friend list for user "Christian"', async () => {
    const friendList = await dataHandler.getFriendsList('Christian');
    expect(friendList).toBeTruthy(); // If there is anything in the friendList, it would be truthy.
});

test('Able to get ratings for user "Christian"', async () => {
    const ratings = await dataHandler.getRatingsUserDB('Christian');
    expect(Array.isArray(ratings)).toBeTruthy(); // If there are any ratings, or the user has been found, the ratings will be in an array.
});

// -----------------------------------------