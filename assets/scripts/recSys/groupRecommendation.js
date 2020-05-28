const dataHandler = require('../data/dataHandler');
const loadData = require('../data/loadData');
const utility = require('../../../utility');
const { jStat } = require('jstat'); // Used for Pearson Correlation
const A_THRES = 'aboveThreshold';
const U_THRES = 'underThreshold';
const RATING_THRESHOLD = 3;

module.exports.makeGroupRec = async function makeGroupRecommendations(group) {
    // Groupratings array
    let R_G = [];
    // Array of movies that were rated below threshold
    let badMovieList = [];
    
    const movieDB = await loadData.getMovieDB();

    // Pushes filtered ratings for each member to collected array of users.
    group.forEach(member => { R_G.push(filterRatings(member)); });
    
    // Adds every movie that the user rated that is under the set threshold to a list of 'bad movies'
    R_G.forEach(member => { badMovieList.push(member[U_THRES]); });
    badMovieList = utility.reduceArray(badMovieList);  // reduceArray merges multiple arrays into one
    
    // Check if any aboveThreshold list includes any of the movies in the list of 'bad' movies: (and removes them)
    // DET ER FORKERT. badMovieList SKAL NEGERES (!)
    R_G.forEach(member => member[A_THRES].filter(entry => badMovieList.includes(entry)));

    const R_G_COR = findCorrelations(R_G, movieDB);

    return getFinalRec(R_G_COR, movieDB);
}
// Used to filter the ratings for each member in a group.
function filterRatings(member, threshold = RATING_THRESHOLD) {
    let aboveThreshold = [], underThreshold = [];
    member.forEach(entry => {
        if (parseFloat(entry.rating) >= threshold) aboveThreshold.push(entry)
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

    const memberRatings = group[memID]["aboveThreshold"];
    correlations[memID]["memberRatings"] = memberRatings;
    correlations[memID]["entries"] = [];
    
    memberRatings.forEach(entry => {
        // Find the movie from 'entry' in the MovieDB (uses binary search)
        const entMov = dataHandler.findMovieByID(entry.movieID, movieDB);
        correlations[memID]["entries"].push([]);
        movieDB.forEach(movie => correlationByMovie(movie, entMov, memID, eID, correlations));
        eID++;
    });
    
    return correlationByMember(group, movieDB, correlations, ++memID, upTo);    
}

function correlationByMovie(movie, entMov, memID, eID, correlations) {
    // Get correlation between the 'entry' movie and 'movie' - PEARSON CORRELATION between two arrays.
    const corVal = jStat.corrcoeff(entMov["genres"]["genreNumArray"], movie["genres"]["genreNumArray"]);

    // If the correlation is above some set values and the average rating of the movie with the high correlation,
    // then the correlation and movie should be added to the list of movies to recommend.
    correlations[memID]["entries"][eID].push({corVal, movie});
}

function getFinalRec(group, movieDB){
    let topArray = [];
    
    // Since we are using the "+=" operator, we have to do the following - otherwise we will be trying to add a number to an undefined value.
    for(i = 0; i < movieDB.length; i++) {topArray[i] = 0};
    
    // collectedLength is no. of ratings?
    const collectedLength = sumCorr(group, topArray);
    
    topArray = topArray.map((correlation) => { return (correlation / collectedLength); });
    let resultArray = createResultArray(topArray);
    
    // pushes an object containing correlation and movieID to the final array
    let corrValSorted = [];
    resultArray.forEach(id => {
        corrValSorted.push({ id, cor: topArray[id] })
    });
    
    module.exports.topArray = topArray; // Used for testing
    // Sorts the array with the highest correlation first
    corrValSorted.sort((a,b) => (a.cor > b.cor) ? -1 : 1);
    //printTopRecommendations(resultArray, corrValSorted, movieDB);
    return getTopRecommendations(resultArray, corrValSorted, movieDB);
}

function sumCorr(group, topArray){
    let collectedLength = 0;
    group.forEach(member => {
        collectedLength += member["memberRatings"].length;
        let entryNum = 0;
        member["memberRatings"].forEach(ratedMovieCorrelations => {
            let movieIndex = 0;
            const weight = (parseFloat(ratedMovieCorrelations.rating) / 5);
            member["entries"][entryNum++].forEach(entry => { 
                if (filterBelowThreshold(entry)) {
                    // Value for this skipped entry will still be 0 in 'topArray' - we will skip it later during the creation of the recommended movies list
                    if (entry["movie"].skip === false) {                 
                        topArray[movieIndex++] += entry.corVal  * weight;
                    }
                } else {movieIndex++}
            }); 
        });      
    });

    return collectedLength;
}

// Used to filter movies that have a rating of 3 or above and has been rated at least 3 times.
function filterBelowThreshold(entry) {
    if (entry["movie"].averageRating >= RATING_THRESHOLD && entry["movie"]["ratings"].length > 3) { return true } else {return false}
}


// The following is used to create an array with the top-correlations
function createResultArray(topArray){
    let topMovies = [];
    let i = 0;
    let modifiableArray = topArray.slice();
    const NO_OF_RECS = 10;
    
    // Adds the index of the top-correlation to index[] and removes it from the topArray
    for (i = 0; i < NO_OF_RECS; i++) {
        topMovies[i] = modifiableArray.indexOf(Math.max(...modifiableArray));
        modifiableArray.splice(topMovies[i], 1, 0);
    }
    
    let resultArray = [];
    topMovies.forEach(index => resultArray.push(index));
    return resultArray;
}

function getTopRecommendations(resultArray, corrValSorted, movieDB) {
    // Gets the top recommended movies for the group
    let recommendationsArray = [];
    for (i = 0; i < resultArray.length; i++) {
        const index = corrValSorted[i]["id"];
        const cor = corrValSorted[i]["cor"];
        recommendationsArray.push({
            index,
            correlation: cor,
            movieObj: movieDB[index]
        });
    }
    return recommendationsArray;
}

// No longer necessary but kept for testing
// function printTopRecommendations(resultArray, corrValSorted, movieDB) {
//     // Prints the top recommended movies for the group
//     for (i = 0; i < resultArray.length; i++) {
//         const index = corrValSorted[i]["id"];
//         const cor = corrValSorted[i]["cor"];
//         console.log(`Movie: ${movieDB[index].title}\n`,
//                     `   - Average Rating: ${movieDB[index].averageRating.toPrecision(3)}\n`,
//                     `   - Korrelation: ${cor.toPrecision(3)}`);
//     }
// }