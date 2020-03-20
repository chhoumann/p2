'use strict';

// Logic to find a user in userDB and and add to friend list
// Logic to accept a friend request(?)



let User = require('./user');
let someUser = new User.User(67);

// Global array of added friends, containing userID's
let addedFriends = [];

// The import is successful and can print data about this object
console.log(someUser);
someUser.changeUserName("Bob");
console.log(someUser);

// A function for alerting the friend was added
function addToFriendList() {
    let friendID = document.getElementById("fname").value;
    friendID = parseInt(friendID);
    if (isValidID(friendID)){
        alert("Friend with ID: " + document.getElementById("fname").value + " was added to your friends list");
        addedFriends.push(friendID); // FIXME: Later this should be added to our user object's array
    }
    else {
        alert("Error - not a valid ID");
        alert(someUser.userName);
        console.log(someUser.userName);
    }
    
}

// Validate whether the input ID is valid
function isValidID(ID) {
    if (Number.isInteger(ID)){
        return true;
    }
    else {
        return false;
    }
}


