const Math = require('mathjs');
const data = require('./testGroupUsers.json');
const dataHandler = require('./data/dataHandler');

/*
    ! [X] Lav test gruppe
    ! [ ] Implementer Pearson
    ! [ ] Implementer Utilitarian Strategy
    UTS = samlet præferenceprofil (matrice) = 1 bruger som matrice -> pearson correlation = for hvert punkt i matricen
*/

dataHandler.getAverage(dataHandler.getRatingsForUser())

// Returns a value between -1 and 1 representing similarity, given two items.
// Positive values mean positive association
function pearsonCorrelation(i,j) {
    return (pearsonNumerator(i,j) / pearsonDenominator(i,j))    
}


function pearsonNumerator(i,j) {
    for (let i = 0; i < data[i].length; i++) {
        if (data[i].movieId == data[].movieId)
        sum += data[i].rating-average.movieId.avg
    }
}

function pearsonDenominator(i,j) {
    for(let i = 0; i < data[i].length); i++){
        if()
        
    }
}



/* function pseudoPearsonCorrelation(i,j){
    for (user 1 to n) {
        sum.tæller += UserID_1.rating.movieID-movieID.rating.average*UserID_1.rating.movieID-MovieID.rating.average;
        sim.tæller = sum.tæller;
        sim.nævner = Math.sqrt(sum((UserID_1.rating.movieID-movieID.rating.average)^2))*Math.sqrt(sum((UserID_1.rating.movieID-MovieID.rating.average)^2));
    }
}
 */






