const dataHandler = require('./assets/scripts/dataHandler');
const express = require('express');
const app = express();
const arrayOfUserIds = [3, 5, 4, 2, 1]; // Used for testing. Users 1-5 are test-users.
let testGroup;
let db = {};

// Setting the template engine (ejs)
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('assets'));

// Routes
app.get('/', (req, res) => {
    res.render('test');

});
app.get('/profile', (req, res) => {
    res.render('profile');
  });

app.get('/connect-with-friends', (req, res) => {
  res.render('connect-with-friends');
});

app.get('/movie-rec', (req, res) => {
    res.render('movie-rec');

});

// Builds database.
// Horrible on memory but confines our project to JS only (no use of external DBs).
const startup = async () => { 
    db.userDB = await dataHandler.buildMovieLensUserDB();
    testGroup = dataHandler.groupUsers(db.userDB, 5, arrayOfUserIds);
    // console.log(testGroup);
}
startup();

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

server = app.listen(port);