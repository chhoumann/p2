/*
1. G = gruppe brugere med ratings i vector format - brug groupUsers()
    In our case: group parameter.
2. I = set af alle instanser / items (film?)
    In our case: movieDB parameter.
3. Liste over anbefalinger (tom variabel - objekt eller array?)
    In our case: recommendationList array.
4. Input værdi k.
    In our case: numberOfItemsToBeRecommended parameter.

5. For all brugere u i G og instanser i i I, lav:
    S[u] = P_u,i formel
6. Find most common instance i fra S
7. 



*/
const dataHandler = require('./data/dataHandler');
const loadData = require('./data/loadData');
const pearsonCorrelation = require('./pearsonCorrelation');
//const groupOfUsers = require('./testGroupData.json');

// testGroup = dataHandler.groupUsers(db.MovieLensUserDB, 5, arrayOfUserIds);

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
    /* console.log(group);
    console.log(numberOfItemsToBeRecommended); */
    //
    let i = 1;
    group.forEach(user => {
        console.log(`----- NEW USER USER ID: ${i++} -----`);
        console.log(`----- Ratings given: ${user.length}.`);
        movieDB.forEach(movie => {
            // find pearson correlation for P_ui
            predict(user, movie);
        })
    });

    return recommendationList;
}

