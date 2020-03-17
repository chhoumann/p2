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
}, 500); // Arbitrary interval. The above takes time to load depending on machine speed -
         // this is to accommodate that.


let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

server = app.listen(8000);