/*
* Vores fremgangsmåde (i store træk):
! ITEM-ITEM fremgangsmåde
* 1. Lav en liste 'S' over hvilke film en bruger 'i' fra gruppen 'G' har set
* 1.5 Fjern alle film der har under 3 i rating og indsæt disse i ny liste L.
* 2. Lav liste R_G med alle S for ethvert gruppemedlem i
* 2.5 Sammenlign listen L med listen R_G og fjern alle film fra R_G som ligger i L.
* 3. Find ud af hvilke film fra R_G har stor genrekorrelation med enhver film i MovieDB
* 4. Udfør Utilitarian Strategy på 'R_G' så der dannes en mindre mængde film, som skal anbefales til brugerne som ny kolonne
    - UTS baseret på korrelation
*/
const dataHandler = require('../data/dataHandler');
const utility = require('../../../utility')
const pearsonCorrelation = require('./pearsonCorrelation');
const { jStat } = require('jstat'); // using this because our pearson would only return 0

// Used to filter the ratings for each member in a group.
const filterRatings = (member, threshold = 3) => {
    let aboveThreshold = [], underThreshold = [];
    member.forEach(entry => {
        if (parseFloat(entry.ratings) >= threshold) aboveThreshold.push(entry)
        else underThreshold.push(entry);
    })
    return {aboveThreshold, underThreshold};
}

module.exports.makeGroupRec = async function makeGroupRecommendations(group, movieDB, numberOfItemsToBeRecommended) {
    /* 1. Lav en liste 'S' over hvilke film en bruger 'i' fra gruppen 'G' har set */
    // Indgår i dataen allerede: group parameter = array af n antal brugere samt deres ratings.
    /* 1.5 Fjern alle film der har under 3 i rating og indsæt disse i ny liste L.
        => Filtreret liste = aboveThreshold 
        => L = underThreshold. */
    /* 2. Lav liste R_G med alle S for ethvert gruppemedlem i
        => R_G = R_G["aboveThreshold"] */
    let R_G = [];   // Array of objects that contain arrays
                    // Group members -> member = index (0-n members) -> Above & Under ratings threshold -> Each contain array of entries above & under = 'movieId' & 'ratings' keys.
    group.forEach(member => { R_G.push(filterRatings(member)); });    
    
    /* 2.5 Sammenlign listen L med listen R_G og fjern alle film fra R_G som ligger i L. */
    let badMovieList = [];
    // Make the list of bad movies and make it into a proper list (one array rather than array of arrays):
    R_G.forEach(member => { badMovieList.push(member["underThreshold"]); });
    badMovieList = utility.reduceArray(badMovieList);
    // Check if any aboveThreshold list includes any of the movies in the bad-list:
    R_G.forEach(member => member["aboveThreshold"].filter(entry => badMovieList.includes(entry)));
    /* 3. Find ud af hvilke film fra R_G har stor genrekorrelation med enhver film i MovieDB */
    findCorrelations(R_G, movieDB);
    return;
}

function findCorrelations(R_G, movieDB){
    let correlations = [];
    console.log(correlationByMember(R_G, movieDB, correlations, 0, R_G.length)[3]);
    return correlations;
}

function correlationByMember(group, movieDB, correlations, memID, upTo){
    if (memID === upTo) return correlations;
    let eID = 0;
    correlations[memID] = [];
    group[memID]["aboveThreshold"].forEach(entry => {
        // Find the movie from 'entry' in the MovieDB (uses binary search)
        const entMov = dataHandler.findMovieByID(entry.movieId, movieDB);
        correlations[memID][eID] = [];
        movieDB.forEach(movie => correlationByMovie(movie, entMov, memID, eID, correlations));
        eID++;
    })
    return correlationByMember(group, movieDB, correlations, ++memID, upTo);
}

function correlationByMovie(movie, entMov, memID, eID, correlations) {
    // Get correlation between the 'entry' movie and 'movie' - PEARSON CORRELATION between two arrays.
    const corVal = jStat.corrcoeff(entMov["genres"]["genreNumArray"], movie["genres"]["genreNumArray"]);
    // If the correlation is above some set values and the average rating of the movie with the high correlation,
    // then the correlation and movie should be added to the list of movies to recommend.
    if (corVal > 0.7 && corVal <= 1 && movie.averageRating > 3.5) correlations[memID][eID].push({corVal, movie});
}