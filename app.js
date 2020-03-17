const loadData = require('./assets/scripts/loadData')
const express = require('express')
const app = express()
let db = {};

// Setting the template engine (ejs)
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('assets'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// Builds database.
// Horrible on memory but confines our project to JS only (no use of external DBs).
// Remember that it is the pointers to the objects which are copied, not the objects themselves.
setTimeout(() => {
    db.UserDB = loadData.buildUserDB()
    db.movies = loadData.movies;
    db.links = loadData.links;
    db.ratings = loadData.ratings;

    // Finds total amount of ratings between all users with more than 50 ratings given.
    /* let filteredArray = [];
    let totalRatings = 0;
    for (let i = 1; i < db.UserDB.length; i++) {
        if (db.UserDB[i].length >= 50) {
            filteredArray.push(db.UserDB[i]);
            totalRatings += db.UserDB[i].length;
        }
    }
    console.log(filteredArray.length, totalRatings); */
}, 500); // Arbitrary interval. The above takes time to load depending on machine speed -
         // this is to accommodate that.


let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

server = app.listen(port);