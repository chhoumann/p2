const dbOfUsers = './db/dbOfUsers.json';
const initialize = require('../../../initialize');
const dataHandler = require('../../scripts/data/dataHandler');
const utility = require('../../../utility')
const fs = require('fs');

// Our user class
module.exports.User = class User {
    constructor(id, username){
        this.id = id;
        this.username = username;
        this.friends = [];  
        this.moviePreferences = [];
    }
}

const usernameDuplicateChecker = (arrayOfUsers, username) => {
    let result = true;
    arrayOfUsers.forEach(user => {
        if (user["username"] === username) result = false;
    });
    return result;
}

module.exports.createUser = async function(req) {
    let userDB = await initialize.buildUserDB();

    // Prepare user in proper format  
    const user = dataHandler.formatUser(req, userDB["users"].length);

    // Checking for duplicates
    if (usernameDuplicateChecker(userDB["users"], user.username)) {
        // Add to DB and save to file.
        userDB["users"].push(user);
        fs.writeFile(dbOfUsers, JSON.stringify(userDB), err => {if (err) throw err; utility.newUserConsoleMessage(user);});
        return {
            userCreated: true,
            user
        };
    } else return {
        userCreated: false,
        user: undefined
    };
}
