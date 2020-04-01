/*
    ! [X] Lav test gruppe
    ! [X] Implementer Pearson
    ! [ ] Implementer Utilitarian Strategy
*/
const U1 = "u1Ratings";
const U2 = "u2Ratings";

// Given references to two user objects, return an object containing the collection of ratings
const getSampleData = (u1, u2) => {
    let collectionOfRatings = { u1Ratings: [], u2Ratings: [] };
    let minLen = Math.min(u1.length, u2.length);

    for (let i = 0; i < minLen; i++) {
        if (u1[i].ratings !== undefined) collectionOfRatings.u1Ratings.push(parseFloat(u1[i].ratings)); 
        if (u2[i].ratings !== undefined) collectionOfRatings.u2Ratings.push(parseFloat(u2[i].ratings));
    }
    
    return collectionOfRatings;
}

// Modified function from:
// https://gist.github.com/matt-west/6500993
// License: MIT (http://opensource.org/licenses/MIT).
const pearsonCorrelation = (prefs, p1, p2) => {
    let si = [];
  
    for (let key in prefs[p1]) {
      if (prefs[p2][key]) si.push(key);
    }
  
    let n = si.length;
  
    if (n == 0) return 0;
  
    let sum1 = 0;
    for (let i = 0; i < si.length; i++) sum1 += prefs[p1][si[i]];
  
    let sum2 = 0;
    for (let i = 0; i < si.length; i++) sum2 += prefs[p2][si[i]];
  
    let sum1Sq = 0;
    for (let i = 0; i < si.length; i++) {
      sum1Sq += Math.pow(prefs[p1][si[i]], 2);
    }
  
    let sum2Sq = 0;
    for (let i = 0; i < si.length; i++) {
      sum2Sq += Math.pow(prefs[p2][si[i]], 2);
    }
  
    let pSum = 0;
    for (let i = 0; i < si.length; i++) {
      pSum += prefs[p1][si[i]] * prefs[p2][si[i]];
    }
  
    let num = pSum - (sum1 * sum2 / n);
    let den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
        (sum2Sq - Math.pow(sum2, 2) / n));
  
    if (den == 0) return 0;
  
    return num / den;
}

// Exports to use elsewhere. Wraps data collecter function in implementation of Pearson 
module.exports.getCorrelation = (dataset, item1, item2) => { return pearsonCorrelation(getSampleData(dataset[item1], dataset[item2]), U1, U2) };