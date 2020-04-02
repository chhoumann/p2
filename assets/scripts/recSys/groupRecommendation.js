/*
* Vores fremgangsmåde (i store træk):
! ITEM-ITEM fremgangsmåde
* 1. Lav en liste 'S' over hvilke film en bruger 'i' fra gruppen 'G' har set
* 1.5 Fjern alle film der har under 3 i rating og indsæt disse i ny liste L.
* 2. Lav liste R_G med alle S for ethvert gruppemedlem i
* 2.5 Sammenlign listen L med listen R_G og fjern alle film fra R_G som ligger i L.
* 2. Find ud af hvilke film fra R_G har stor genrekorrelation med enhver film i MovieDB
* 6. Udfør Utilitarian Strategy på 'R_G' så der dannes en mindre mængde film, som skal anbefales til brugerne som ny kolonne
    - UTS baseret på korrelation
*/
const dataHandler = require('../data/dataHandler');
const utility = require('../../../utility')
const loadData = require('../data/loadData');
const pearsonCorrelation = require('./pearsonCorrelation');

const userRatingsMatches = (user, item) => {
    let userRatingsMatches = [];
    user.forEach(set => { if (set.movieId === item.movieId) userRatingsMatches.push(set) });
    // if (userRatingsMatches.length !== 0) { console.log(userRatingsMatches) };
    return userRatingsMatches;
}

const predict = (user, item) => {
    // rating som bruger u har givet til j
    let userRatings = userRatingsMatches(user, item);


    /* sum enhver j fra S: pearsonCorrelation(i,j) * rating som bruger u har givet til j
                                    divideret med
    sum enhver j fra S: |pearsonCorrelation(i,j) */


    
    
}

module.exports.makeGroupRec = function makeGroupRecommendations(group, movieDB, numberOfItemsToBeRecommended) {
    let recommendationList = [];
    let i = 1; // Used with log-testing below.

    // O(n^2) yeah yeah we know
    group.forEach(user => {
        /* (testing) Logs:
        console.log(`----- NEW USER USER ID: ${i++} -----`);
        console.log(`----- Ratings given: ${user.length}.`);
        */ 

        // Check which movies a user has watched:
        user.moviesWatched = dataHandler.getMoviesWatched(user);
        // Necessary for later - has to be an array before we can use push().
        user.genres = [];
        movieDB.forEach(movie => {
            // Append genres to each user that has watched this movie
            if (user.moviesWatched.includes(movie.movieId)) user.genres.push(movie.genres);

            // find pearson correlation for P_ui
            // predict(user, movie);
        })
        // Finds all instances of a genre in the set of movies that a given user has watched and counts them.
        user.genres = dataHandler.matchGenres(utility.reduceArray(user.genres));
        console.log(user.genres);
    });

    return recommendationList;
}

