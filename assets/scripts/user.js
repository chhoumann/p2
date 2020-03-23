'use strict';

// The blueprint of our user.
class User {
    constructor(userID){
        this.userID = userID;
        this.userName = "Your name";
        this.friends = [];  // Contains ID's of friends.
        // this.moviePreferences = []; // ? Suggestion: array of objects containing movie IDs and ratings of each movie.
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
        if (isValidID(friendID) && !this.friendsWith(friendID)) {
            this.friends.push(friendID);
            console.log("Friend with ID: " + friendID + " was added to friends list");
        }
        else
            console.log("Error: " + friendID + " is not a valid ID. Or already a friend.");
    }
}

module.exports.createUser = new User(0);

// The HTML validates input is a number. Here we other conditions.
function isValidID(id) {
    if (id >= 1 && id <=1000 && Number.isInteger(id)) {
        return true;
    }
};



let myUser = new User(5);
myUser.changeUserName("Kurt");
myUser.addToFriendList(50);
myUser.addToFriendList(51);
myUser.addToFriendList(51);
myUser.addToFriendList(5);
console.log(myUser.userName);
console.log(myUser.friends);