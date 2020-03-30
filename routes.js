/*
! We have very many pages currently, so I saw fit to move them here - for better structure.
*/
const bodyParser = require('body-parser'); 
const urlencodedParser = bodyParser.urlencoded({ extended: false })  
const fs = require('fs');
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

// Dette sender informationerne fra formen fra http://localhost:8000/Profile til http://localhost:8000/something
// Der er redirect efter submit, men dette logger desuden requesten til consollen samt skriver det på '/something'.
// TODO: Der burde tilføjes funktionalitet som tjekker duplicates i JSON fil.
// TODO: Desuden også validering for at se om 1. duplicates og 2. der er indtastet gyldigt input. Men 2. skal ikke ske på server-siden pt.
router.post('/createUser', urlencodedParser, async function (req, res) {  
   // Prepare output in JSON format  
    let user = dataHandler.formatUser(req);

    // Formatering af response
    let userDB = await initialize.buildUserDB();
    userDB["users"].push(JSON.stringify(user));
    console.log(userDB.users);

    // Write to file / save DB
    fs.writeFile(dbOfUsers, JSON.stringify(userDB), err => {if (err) throw err; console.log("saved!");});

    // Send something back to the user
    res.end(JSON.stringify(user)); // Her skrives til '/something' som klienten modtager
});

module.exports = router;