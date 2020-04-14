const groupHandler = require('./assets/scripts/social/groupHandler');
const user = require('./assets/scripts/user/user');
const bodyParser = require('body-parser'); 
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const dataHandler = require('./assets/scripts/data/dataHandler')
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('test');
});

router.get('/createProfile', (req, res) => {
    res.render('createProfile');
});

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
router.post('/createUser', urlencodedParser, async function (req, res) {  
    // Load current UserDB to 'append' to it.
    const validation = await user.createUser(req);

    if (validation.userCreated === true) {
        // Send something back to the user
        res.end(`<h1>Thank you for signing up, ${validation.user.username}!</h1>
                 <a href="/">Click here to go to the homepage.</a>`);
    } else {
        res.end(`<h1>Thank you for signing up, ${validation.user.username}!</h1>
                 <h2>Unfortunately, your name was already taken.</h2>
                 <a href="/profile">Click here to try again.</a>`);
    }
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

module.exports = router;