/*
* Vores fremgangsmåde (i store træk):
! USER-USER fremgangsmåde
* 1. Lav genrekorrelation for enhver bruger 'i' i en gruppe 'G' mod enhver bruger 'j' i MovieLens datasættet 
    - Der kan bruges Pearson correlation på user.genres variablen mellem de to brugere
* 2. Lav liste S over de film som brugere 'j' med høj genrekorrelation med bruger 'i' har set for enhver bruger 'i'
* 3. Lav liste R over de film fra S som har høje ratings (4-5)          
* 4. Lav en samlet liste 'R_G' for gruppen ved at sammensætte 'R' for enhver bruger 'i' i gruppe 'G'
* 5. Dan en liste 'RF_G' ved at anvende Utilitarian Strategy på 'R_G'
* 6. Anbefal listen 'RF_g'
! ITEM-ITEM fremgangsmåde
* 1. Find ud af hvilke film der ligner hinanden (har stor genrekorrelation / jo flere genrer som to film har tilfælles jo bedre) og sammel i liste
* 2. Lav en liste 'S' over hvilke film en bruger 'i' fra gruppen 'G' har set
    - Og eventuelt filtrer efter de højest ratede film
* 3. Lav en liste 'R' ud fra film med stor genrekorrelation med enhver film i listen 'S' (altså film de ikke har set)
    - Fjern alle film der har under 3 i rating og indsæt disse i ny liste L.
* 4. Dan en samlet liste 'R_G' hvori 'R' for enhver bruger 'i' fra 'G' indgår
* 5. Sammenlign listen L med listen R_G og fjern alle fra R_G som ligger i L.
* 6. Udfør Utilitarian Strategy på 'R_G' så der dannes en mindre mængde film, som skal anbefales til brugerne
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

