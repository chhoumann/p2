'use strict';

// The blueprint of our user.
module.exports.User = class User {
    constructor(id, username, password){
        this.id = id;
        this.username = username;
        this.password = password; // Currently plain text. Might want to add encryption or something...
        this.friends = [];  // Contains ID's of friends.
        this.moviePreferences = []; // ? Suggestion: array of objects containing movie IDs and ratings of each movie.
    }
    changeUserName(newUserName) {
        this.userName = newUserName;
    }
    friendsWith(friendID) {
        for (let i = 0; i < this.friends.length; i++){
            if (this.friends[i] === friendID){
                return true;
            }
        }
        return false;
    }
    addToFriendList(friendID){
        if (isValidID(friendID, "user") && !this.friendsWith(friendID)) {
            this.friends.push(friendID);
            console.log("Friend with ID: " + friendID + " was added to friends list");
        }
        else
            console.log("Error: " + friendID + " is not a valid ID. Or is already a friend.");
    }
    addToMoviePreferences(movieID) {
        if (isValidMovieID(movieID, "movie")) {  // Are not checking here for whether ID has already been added
            this.moviePreferences.push(movieID);
        }
    }
}

//module.exports.createUser = new User(0);

// Switch on different ID's under different circumstances
function isValidID(id, typeOfID) {
    let isValid = false;
    switch(typeOfID) {
        case "user":
            isValid = isValidFriendID(id);
            break;
        case "movie":
            isValid = isValidMovieID(id);
            break;
    }
    return isValid;
};

function isValidFriendID(id) {
    if (id >= 1 && id <=1000 && Number.isInteger(id)) {
        return true;
    }
}

function isValidMovieID(id) {
    if (id >= 1 && id <=1000 && Number.isInteger(id)) { // Probably check for a different number interval
        return true;
    }
}

// Messing around with methods on a user
/* let myUser = new User(5);
myUser.changeUserName("Kurt");
myUser.addToFriendList(50);
myUser.addToFriendList(51);
myUser.addToFriendList(51);
myUser.addToFriendList(5);
myUser.addToMoviePreferences(17);
myUser.addToMoviePreferences(54);
console.log(myUser.userName);
console.log(myUser.friends);
console.log(myUser.moviePreferences); */