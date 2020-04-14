const loadData = require('./loadData');
const movieDB = await loadData.getMovieDB();

// Tjek om brugeren er logget ind
let user = localStorage.getItem("username");

console.log(movieDB.ratings);

// Finde en random film, som har en rating over 3
// for(let x = 0; x < movieDB.ratings.length; x++){
//     console.log(movieDB)
// }

 

// Pushet præferencer til user


