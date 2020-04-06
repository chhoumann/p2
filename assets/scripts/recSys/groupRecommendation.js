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
    // FinalMovies= [{movieFraMovieDB: 'sdf', accumulatedCorrelation: 5}]
    /* 2.5 Sammenlign listen L med listen R_G og fjern alle film fra R_G som ligger i L. */
    let badMovieList = [];
    // Make the list of bad movies and make it into a proper list (one array rather than array of arrays):
    R_G.forEach(member => { badMovieList.push(member[UTHRES]); });
    badMovieList = utility.reduceArray(badMovieList);
    // Check if any aboveThreshold list includes any of the movies in the bad-list:
    R_G.forEach(member => member[ATHRES].filter(entry => badMovieList.includes(entry)));
    /* 3. Find ud af hvilke film fra R_G har stor genrekorrelation med enhver film i MovieDB */
    const R_G_COR = findCorrelations(R_G, movieDB);
    
    // Member:[] -> AboveThreshold:[] -> {Correlation:[...9742] + MovieDB[for enhver...9742]}
    // For enhver bruger: For (x: movieLensFilm) { for(y: hver abovethreshold film) { R_G_COR[bruger][y][x] SUM OG FIND GENNEMSNIT AF KORRELATION mellem alle film for enhver bruger }}
    // Jeg rater film x 4/5, så film x's korrelationer får 80% vægt. Hvis jeg havde rated den 5/5 ville det være 100% osv.
    // F.eks: (SUM(corVal * vægt(0 <= x <= 1))/aboveThreshold.length
    
    /* const getAccuVal = (R_G_COR) => {
        let theExtraMember = [];
        R_G_COR.forEach(member => {
            member.filter(entry => { if (entry) })
        })
    } */
    getFinalRec(R_G_COR);
    getFinalRec2(R_G_COR);
    return;
}

function findCorrelations(R_G, movieDB){
    let correlations = [];
    correlationByMember(R_G, movieDB, correlations, 0, R_G.length);
    return correlations;
}

function correlationByMember(group, movieDB, correlations, memID, upTo){
    if (memID === upTo) return correlations;
    let eID = 0;
    correlations[memID] = [];
    group[memID][ATHRES].forEach(entry => {
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
    correlations[memID][eID].push({corVal, movie});
}


// Member:[] -> AboveThreshold:[] -> {Correlation:[...9742] + MovieDB[for enhver...9742]}
    // For enhver bruger: For (x: movieLensFilm) { for(y: hver abovethreshold film) { R_G_COR[bruger][y][x] SUM OG FIND GENNEMSNIT AF KORRELATION mellem alle film for enhver bruger }}
    // Jeg rater film x 4/5, så film x's korrelationer får 80% vægt. Hvis jeg havde rated den 5/5 ville det være 100% osv.
    // F.eks: (SUM(corVal * vægt(0 <= x <= 1))/aboveThreshold.length
    // group[group.length]
    
    /* const getAccuVal = (R_G_COR) => {
        let theExtraMember = [];
        R_G_COR.forEach(member => {
            member.filter(entry => { if (entry) })
        })
    } */
function getFinalRec(group){
    let sumCorr = []
    // sumCorr[movieID] = [];

    console.log("Memebers:" + group.length + " Ratede film for member 0: " + group[0].length + " Antal film i database: " + group[0][0].length);

    // group.length -> members
    // group[0].length -> ratede film for member 0
    // group[0][0].length -> film i databasen
    for (let i = 0; i < group.length; i++){
        
        //group[i][x].forEach(entry => {corMovie  += entry.corVal});
        
        // group[0][0].forEach(entry => {
        //     group[0].forEach(eId, entry => { 
        //         let corMovie = 0
        //         corMovie += group[i][eId][entry].corVal}); 
        //         console.log(corMovie);
        //     });   
        // } 


        //group[group.length][0][i] += correlationvalue
    
}}


function getFinalRec2(group){
    let sumCorr = []
    // sumCorr[movieID] = [];
    let sumCorr1 = 0;
    let movieDBIndex = 0, memberIndex = 0, ratedMovieIndex = 0;
    let sumCorrVar;

    console.log("Members:" + group.length + " Ratede film for member 0: " + group[0].length + " Antal film i database: " + group[0][0].length);
    let counter = 0;

    // group.length -> members
    // group[0].length -> ratede film for member 0
    // group[0][0].length -> film i databasen
    for (memberIndex = 0; memberIndex < group.length; memberIndex++){
        for (ratedMovieIndex = 0; ratedMovieIndex < group[memberIndex].length; ratedMovieIndex++) {
            for (movieDBIndex = 0; movieDBIndex < group[memberIndex][ratedMovieIndex].length; movieDBIndex++){
                sumCorr[movieDBIndex] += (group[memberIndex][ratedMovieIndex][movieDBIndex]).corVal;
                counter++;
                // console.log( (group[memberIndex][ratedMovieIndex][movieDBIndex]).corVal );
            }
        sumCorrVar = sumCorr[movieDBIndex];
        sumCorr[movieDBIndex] = sumCorrVar/group[memberIndex].length;
        console.log("Summen af korrelationerne: " + sumCorrVar);

        }
    }
    console.log("Summen af korrelationerne: " + sumCorrVar);
    console.log("Counter is: " + counter);
    
}