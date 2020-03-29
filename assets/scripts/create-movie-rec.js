// Get movie recommendation for multiple users


function getMovieRec(event){
    event.preventDefault();
    
    // Get number of input fields
    let form = document.getElementById("groupMember");
    let numOfIDs = form.getElementsByTagName("input").length;
    
    // Variable for userIDs
    let userIDArray = [];

    // Store userIDs in array
    for(let x = 1; x <= numOfIDs; x++){
        let userID = parseInt(document.getElementById(`ID-box-${x}`).value);

        if(isValidID(userID)) {
            userIDArray.push(userID);
            console.log("Sucessfully added friends: " + userIDArray);
        } else {
            console.log("Error: Not valid userID: " + userID);
        }
        
    }

    // TODO: Add some kind of check that the given users exists?
    // Stolen from "connectWithFriends.js"
    function isValidID(id) { if (id >= 1 && id <=1000 && Number.isInteger(id)) return true; };

    // TODO: Get the different users movie preferences and calculate a recommendation 
}