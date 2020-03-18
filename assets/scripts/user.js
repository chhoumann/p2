// The blueprint of our user
class User {
    constructor(userID){
        this.userID = userID;
        this.userName = "Your name";
        this.friends = [];  // Contains ID of friends
    }
    changeUserName(newUserName) {
        this.userName = newUserName;
    }
}

// Testing changing user attributes
let user1 = new User(0001);
console.log("User ID:" + user1.userID);
console.log("User name:" + user1.userName);
user1.changeUserName("Bob");
console.log("User name:" + user1.userName);

user1.friends.push(63);
user1.friends.push(42);
console.log("User 1's friends:" + user1.friends);


