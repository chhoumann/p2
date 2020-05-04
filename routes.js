const user = require('./assets/scripts/user/user');
const bodyParser = require('body-parser'); 
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const dataHandler = require('./assets/scripts/data/dataHandler');
const groupRec = require('./assets/scripts/recSys/groupRecommendation');
const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('index');
});

/* FOR MODELS */
router.get('/models', (req, res) => {
    res.render('models');
});

router.get('/getMovieDB', async (req, res) => {
    const loadData = require('./assets/scripts/data/loadData');
    const movieDB = await loadData.getMovieDB();
    res.send(movieDB)
})

/* MODELS END */

router.get('/movieRatings', (req, res) => {
    let movies;

    fs.readFile('./db/userMoviesForRating.json', function(err, data) {
        if(err) console.log(err);
        movies = JSON.parse(data);
        res.send(movies);
    });
});

router.get('/getFriends', (req, res) => {
    let userData;

    fs.readFile('./db/dbOfUsers.json', function(err, data) {
        if(err) console.log(err);
        userData = JSON.parse(data);
        res.send(userData);
    });
});


router.get('/submitRating', async (req, res) => {
    const data = req.query;
    const resp = await dataHandler.addRatingToUser(data.username, data.movieDB_ID, data.rating, data.title);
    res.send({valid: resp});
})

router.get('/deleteAllRatings', async (req, res) => {
    const data = req.query;
    const resp = await dataHandler.deleteAllRatingsForUser(data.username);
    res.send({valid: resp});
})

router.get('/removeRating', async (req, res)=>{
    const data = req.query;
    const resp = await dataHandler.removeRating(data.username, data.movieDB_ID);
    res.send({data: resp});
});
router.get('/fetchRatedMoviesForUser', async (req, res) => {
    const data = req.query;
    const ratedMovies = await dataHandler.getRatingsUserDB(data.username);
    res.send(ratedMovies);
})

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

router.get('/loginUsername', async (req, res) => {
    const data = req.query;
    const user = await dataHandler.findUserInUserDB(data.username);
    user ? res.send(true) : res.send(false)
});

router.get('/addFriend', async (req, res) => {
    const data = req.query;
    // Validation - does the user exist?
    const validateUsername = await dataHandler.findUserInUserDB(data.addName);
    // If yes, add as friend and update DB file
    if (validateUsername) await dataHandler.addFriend(data.requestBy, data.addName);
    res.send({valid: validateUsername});
});

router.get('/removeFriend', async (req, res) => {
    const data = req.query;
     const usernameToRemove = await dataHandler.removeFriend(data.username, data.friend);
    res.send({valid: usernameToRemove});
});

router.get('/fetchFriends', async (req, res) => {
    const username = req.query.user;
    const found = await dataHandler.getFriendsList(username);
    res.send(found);
});

router.get('/getRecommendations', async (req, res) => {
    const { group } = req.query;
    console.log(`${group[group.length - 1]} asked for movie recommendations.`);
    // Send group to datahandler to fetch users' ratings
    const groupRatings = await dataHandler.getGroupRatings(group);

    // Get number of total ratings of the group
    let numOfRatings = 0;
    groupRatings.forEach(ID => numOfRatings += ID.length);
    
    // Send ratings to group rec. sys to fetch recommendations
    const recommendations = await groupRec.makeGroupRec(groupRatings);

    // Send recommendations to user and number of total ratings in the group
    res.send({rec: recommendations, ratings: numOfRatings});
});


module.exports = router;