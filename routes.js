/*
! We have very many pages currently, so I saw fit to move them here - for better structure.
*/
const bodyParser = require('body-parser'); 
const urlencodedParser = bodyParser.urlencoded({ extended: false })  
const fs = require('fs');
const utility = require('./utility')
const dbOfUsers = './db/dbOfUsers.json';
const initialize = require('./initialize');
const dataHandler = require('./assets/scripts/data/dataHandler');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('test');
});

router.get('/profile', (req, res) => {
    res.render('profile');
});

router.get('/connect-with-friends', (req, res) => {
  res.render('connect-with-friends');
});

router.get('/movie-rec', (req, res) => {
    res.render('movie-rec');

});

router.get('/updateProfile', (req, res) => {
    res.render('updateProfile');

});

router.get('/createAccount', (req, res) => {
    res.render('createAccount');
});

// This sends the information from the form at http://localhost:8000/profile to http://localhost:8000/createUser
router.post('/createUser', urlencodedParser, async function (req, res) {  
    // Load current UserDB to 'append' to it.
    let userDB = await initialize.buildUserDB();

    // Prepare user in proper format  
    const user = dataHandler.formatUser(req, userDB["users"].length);
    
    // Checking for duplicates
    if (utility.usernameDuplicateChecker(userDB["users"], user.username)) {
        // Add to DB and save to file.
        userDB["users"].push(user);
        fs.writeFile(dbOfUsers, JSON.stringify(userDB), err => {if (err) throw err; utility.newUserConsoleMessage(user);});

        // Send something back to the user
        res.end(`<h1>Thank you for signing up, ${user.username}!</h1>
                 <a href="/">Click here to go to the homepage.</a>`);
    } else {
        res.end(`<h1>Thank you for signing up, ${user.username}!</h1>
                 <h2>Unfortunately, your name was already taken.</h2>
                 <a href="/profile">Click here to try again.</a>`);
    }
});


// TODO: Validering af input (client- & server side?)
// TODO: Tjek for duplicates
// TODO: Find way to store userIDs
router.post('/movieRec', urlencodedParser, async function (req, res) {
    let userID = req.body.ID;

    console.log(JSON.stringify(userID));
    res.render('movie-rec');
});

module.exports = router;