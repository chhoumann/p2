'use strict';

// Logic to find a user in userDB and and add to friend list
// Logic to accept a friend request(?)


let User = require('./user');
let ourUser = User.createUser;

// A function for alerting the friend was added
function addToFriendList(friendID) {
    if (isValidID(friendID)){
        // alert("Friend with ID: " + friendID + " was added to your friends list");
        console.log("Friend with ID: " + friendID + " was added to your friends list");
        ourUser.friends.push(friendID);
    }
    else {
        // alert("Error - not a valid ID");
        console.log("Error: " + friendID + " is not a valid ID");
    }
}

// The HTML validates input is a number. Here we check range and if integer
function isValidID(id) { if (id >= 1 && id <=1000 && Number.isInteger(id)) return true; };


addToFriendList(50);
addToFriendList(14);
addToFriendList(5.6);
console.log("Our user's username: " + ourUser.userName);
console.log("Our user's user ID: " + ourUser.userID);
console.log("Your friends: " + ourUser.friends);




