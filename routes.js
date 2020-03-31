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

router.get('/movieRec', (req, res) => {
    res.render('movieRec');

});

router.get('/updateProfile', (req, res) => {
    res.render('updateProfile');

});

router.get('/createAccount', (req, res) => {
    res.render('createAccount');
});

// This receives and processes the information from the form at http://localhost:8000/profile to http://localhost:8000/createUser
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

// TODO: Clean up code and move to relevant files
/*
    [X] Client-side input validering
    [] Server-side input validering
    [X] Check for duplicates (client side)
    [X] Max group of 5
    [X] Check if users exists in database
    [] Build group from users
    [] Apply pearsons to group 
*/
router.post('/movieRec', urlencodedParser, async function (req, res) {
    // store userIDs in array
    let userArray = req.body.ID;

    // open DB-file of users
    fs.readFile(dbOfUsers, (err, data) => {
        if(err) throw err;
        let usersDB = JSON.parse(data);

        // amount of users in database NB: does NOT work in IE < 9
        let amountOfUsersInDB = Object.keys(usersDB.users).length;
        let userFound = 0;
        let userExists = false; 

        for(let i = 0; i < amountOfUsersInDB; i++) {
            for(let x = 0; x < userArray.length; x++) {
                if(usersDB.users[i].id == userArray[x] && !userExists){
                    // user has been found!
                    userExists = true;

                    //increment found users
                    userFound += 1;
                }
            }

            // reset userExists for next user check
            userExists = false;
        }
        
        // check if users exists, if true create group.
        if(userFound == userArray.length){
            console.log("All users exists in database!");

            // create group ... 


        } else {
            console.log("Not all users found in databse!");
        }

    })

    res.render('movieRec');
});

module.exports = router;