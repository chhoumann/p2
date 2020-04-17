const groupHandler = require('./assets/scripts/social/groupHandler');
const user = require('./assets/scripts/user/user');
const bodyParser = require('body-parser'); 
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const dataHandler = require('./assets/scripts/data/dataHandler')
const express = require('express');
const router = express.Router();
const fs = require('fs');
let reqNum = 0;

router.get('/', (req, res) => {
    res.render('test');
});

router.get('/createProfile', (req, res) => {
    res.render('createProfile');
});

router.get('/movieRatings', (req, res) => {
    let movies;

    fs.readFile('./db/userMoviesForRating.json', function(err, data) {
        if(err) console.log(err);
        movies = JSON.parse(data);
        res.send(movies);
    });
});

router.get('/submitRating', async (req, res) => {
    const data = req.query;
    const resp = await dataHandler.addRatingToUser(data.username, data.movieDB_ID, data.rating, data.title);

    res.send({valid: resp});
    res.end();
})

router.get('/fetchRatedMoviesForUser', async (req, res) => {
    const data = req.query;
    const ratedMovies = await dataHandler.getRatingsUserDB(data.username);
    res.send(ratedMovies);
})


router.get('/rateMovies', (req, res) => {
    res.render('rateMovies');   
});

router.get('/profile', (req, res) => {
    res.render('profile');
});

router.get('/connectWithFriends', (req, res) => {
  res.render('connectWithFriends');
});

router.get('/movieRec', (req, res) => {
    res.render('movieRec');

});

// This receives and processes the information from the form at http://localhost:8000/profile to http://localhost:8000/createUser
router.get('/createUser', urlencodedParser, async function (req, res) {  
    // Load current UserDB to 'append' to it.
    const validation = await user.createUser(req);
    res.send(validation);
});

router.post('/getMovieRec', urlencodedParser, async function (req, res) {
    // Tanken er at formen i movieRec skal lave en request hertil.
    // Der valideres så input og sendes til group rec. sys. functionen som
    // returnerer nogle film, som så sendes tilbage med 'res.send(FILM)'.
    
    const validation = await groupHandler.validateGroup(req);
    // Send to group recommendation function
    res.render('movieRec');
});

router.get('/loginUsername', async (req, res) => {
    const data = req.query;
    const user = await dataHandler.checkForUserInDB(data.username);

    res.send(user);
})

router.get('/addFriend', async (req, res) => {
    const data = req.query;
    // Validation - does the user exist?
    const validateUsername = await dataHandler.checkForUserInDB(data.addName);
    // If yes, add as friend and update DB file
    if (validateUsername) await dataHandler.addFriend(data.requestBy, data.addName);
    res.send({valid: validateUsername});
})

router.get('/fetchFriends', async (req, res) => {
    const username = req.query.user;
    const found = await dataHandler.getFriendsList(username);
    
    res.send(found);
})

module.exports = router;