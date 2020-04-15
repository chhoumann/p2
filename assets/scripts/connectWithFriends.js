// Logic to find a user in userDB and and add to friend list
// Logic to accept a friend request(?)

let addedFriends = [];


// A function for alerting the friend was added
function addToFriendList() {
    if (isValidID){
        alert("Friend with ID: " + document.getElementById("fname").value + " was added to your friends list");
        let friendID = document.getElementById("fname").value;
        addedFriends.push(friendID); // FIXME: Later this should be added to our user object's array
    }
    
}

// Validate whether the input ID is valid
// Start with just whether the input is a possible number
function isValidID() {
    return true;
}