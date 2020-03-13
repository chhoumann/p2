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
setTimeout(() => {
    db.UserDB = loadData.buildUserDB()
    db.movies = loadData.movies;
    db.links = loadData.links;
    db.ratings = loadData.ratings;
}, 500); // Arbitrary interval. The above takes time to load depending on machine speed -
         // this is to accommodate that.

server = app.listen(3000);