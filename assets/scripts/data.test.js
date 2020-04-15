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
const GROUP_SIZE = 5;
const TEST_GROUP_USER_IDS = [USER_TO_TEST, 2, 3, 4, 5];
const MOVIE_ID_TO_TEST = 1;
const MOVIE_HAS_X_RATINGS = 215;

test('Builds MovieLens User Database', async () => {
    let tempMovieLensUserDB = await dataHandler.buildMovieLensUserDB();
    expect(tempMovieLensUserDB.length).toEqual(USERS_IN_DB);

});

test('Finds all ratings for specific user', async () => {
    let userData = await dataHandler.getRatingsForUser(USER_TO_TEST, await loadData.getRatingData());
    expect(userData.length).toEqual(USER_TO_TEST_HAS_X_RATINGS);
    expect(parseFloat(userData[USER_RATING_ID].ratings)).toEqual(USER_GAVE_RATING);
});

test('Groups users', async () => {
    let tempGroup = await dataHandler.groupUsers(await dataHandler.buildMovieLensUserDB(), GROUP_SIZE, TEST_GROUP_USER_IDS);
    expect(tempGroup.length).toEqual(GROUP_SIZE);

    // Tests the user that was also tested in the previous test, therefore it is the same rating for the same movie.
    expect(parseFloat(tempGroup[0][USER_RATING_ID].ratings)).toEqual(USER_GAVE_RATING);
});

test('Gets ratings for movie, given an id', async () => {
    let tempRatings = await dataHandler.getRatingsForMovieID(MOVIE_ID_TO_TEST);
    expect(tempRatings.length).toEqual(MOVIE_HAS_X_RATINGS)
});
// -----------------------------------------