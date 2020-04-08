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
const ATHRES = 'aboveThreshold';
const UTHRES = 'underThreshold';
const AMOV = 'allMovies'
const RATING_THRESHOLD = 3


module.exports.makeGroupRec = async function makeGroupRecommendations(group, movieDB, numberOfItemsToBeRecommended) {
    let R_G = [];
    let badMovieList = [];
    
    // Pushes filtered ratings for each member to collected array of users.
    group.forEach(member => { R_G.push(filterRatings(member)); });    
    
    // Adds every movie that the user rated that is under the set threshold to a list of 'bad movies'
    R_G.forEach(member => { badMovieList.push(member[UTHRES]); });
    badMovieList = utility.reduceArray(badMovieList);
    
    // Check if any aboveThreshold list includes any of the movies in the list of 'bad' movies:
    R_G.forEach(member => member[ATHRES].filter(entry => badMovieList.includes(entry)));
    const R_G_COR = findCorrelations(R_G, movieDB);
    
    getFinalRec(R_G_COR, movieDB);
    return;
}
// Used to filter the ratings for each member in a group.
const filterRatings = (member, threshold = RATING_THRESHOLD) => {
    let aboveThreshold = [], underThreshold = [];
    member.forEach(entry => {
        if (parseFloat(entry.ratings) >= threshold) aboveThreshold.push(entry)
        else underThreshold.push(entry);
    })
    return {aboveThreshold, underThreshold};
}

function findCorrelations(R_G, movieDB){
    let correlations = [];
    correlationByMember(R_G, movieDB, correlations, 0, R_G.length);
    return correlations;
}

function correlationByMember(group, movieDB, correlations, memID, upTo){
    if (memID === upTo) return correlations;
    let eID = 0; // entry ID
    correlations[memID] = [];
    
    group[memID][ATHRES].forEach(entry => {
        // Find the movie from 'entry' in the MovieDB (uses binary search)
        const entMov = dataHandler.findMovieByID(entry.movieId, movieDB);
        correlations[memID][eID] = [];
        movieDB.forEach(movie => correlationByMovie(movie, entMov, memID, eID, correlations, group));
        eID++;
    });

    return correlationByMember(group, movieDB, correlations, ++memID, upTo);
}

function correlationByMovie(movie, entMov, memID, eID, correlations, group) {
    // Get correlation between the 'entry' movie and 'movie' - PEARSON CORRELATION between two arrays.
    const corVal = jStat.corrcoeff(entMov["genres"]["genreNumArray"], movie["genres"]["genreNumArray"]);

    // If the correlation is above some set values and the average rating of the movie with the high correlation,
    // then the correlation and movie should be added to the list of movies to recommend.
    const memberRatings = group[memID]["aboveThreshold"];
    correlations[memID][eID].push({corVal, movie, memberRatings});
}

function getFinalRec(group, movieDB){
    let topArray = [];
    let collectedLength = 0;
    
    // Since we are using the "+=" operator, we have to do the following - otherwise we will be trying to add a number to an undefined value.
    for(i = 0; i < movieDB.length; i++) {topArray[i] = 0};

    let movieCorr = 0;
    group.forEach(member => {
        collectedLength += member.length;
        member.forEach(ratedMovieCorrelations => {
            let movieIndex = 0, entryNum = 0;
            const weight = (parseFloat(member[movieCorr][0]["memberRatings"][entryNum++].ratings) / 5);
            ratedMovieCorrelations.forEach(entry => { 
                if (filterBelowThreshold(entry)) {
                    // Value for this skipped entry will still be 0 in 'topArray' - we will skip it later during the creation of the recommended movies list
                    if (entry["movie"].skip === false) {                    
                        topArray[movieIndex++] += entry.corVal * weight;
                    }
                }
            })
        })      
    })
    for(i = 0; i < movieDB.length; i++) {topArray[i] = topArray[i] / collectedLength};
    
    let resultArray = createResultArray(topArray);
    // pushes an object containing correlation and movieID to the final array
    let corrValSorted = [];
    for(let x = 0; x < resultArray.length; x++) {
        corrValSorted.push({
            cor: topArray[resultArray[x]],
            id: resultArray[x]
        });
    }
    
    // Sorts the array with the highest correlation first
    corrValSorted.sort((a,b) => (a.cor > b.cor) ? -1 : 1);
    
    printTopRecommendations(resultArray, corrValSorted, movieDB);
}


// Used to filter movies that have a rating of 2.5 or above and has been rated at least 3 times.
function filterBelowThreshold(entry) {
    if (entry["movie"].averageRating >= RATING_THRESHOLD && entry["movie"]["ratings"].length > 3) { return true } else {return false}
}


// The following is used to create an array with the top-correlations
function createResultArray(topArray){
    let index = [];
    let i = 0
    
    // Adds the index of the top-correlation to index[] and removes it from the topArray
    for (i = 0; i < 10; i++) {
        index[i] = topArray.indexOf(Math.max(...topArray));
        topArray.splice(index[i], 1);
    }
    
    // index might contain duplicates and therefore we make it to a set to remove duplicates, and then turn it back into the result array
    let uniqueMovies = new Set(index);
    let resultArray = [];
    uniqueMovies.forEach(index => resultArray.push(index));
    
    return resultArray;
}

function printTopRecommendations(resultArray, corrValSorted, movieDB) {
    // Prints the top recommended movies for the group
    for (i = 0; i < resultArray.length; i++) {
        const index = corrValSorted[i]["id"];
        const cor = corrValSorted[i]["cor"];
        console.log(`Movie: ${movieDB[index].title}\n`,
                    `   - Average Rating: ${movieDB[index].averageRating.toPrecision(3)}\n`,
                    `   - Korrelation: ${cor.toPrecision(3)}`);
    }
}
