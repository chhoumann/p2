const initialize = require('../../../initialize');


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
module.exports.validateGroup = async (req) => {
    // store userIDs in array
    const userArray = req.body.ID;
    const userDB = await initialize.buildUserDB();
    let usersFound = 0;
    let userExists = false;
    
    userArray.forEach(groupUser => {
        userDB["users"].forEach(dbUser => {
            if (dbUser.id === parseInt(groupUser) && !userExists) { userExists = true; usersFound++; };
        })
        userExists = false;
    });
    
    // Check if users exists, if true create group.
    if(usersFound === userArray.length){
        console.log("All users exists in database! \n Creating group...");

        

        return true;
    } else { console.log("Not all users found in database!"); return false; }
}