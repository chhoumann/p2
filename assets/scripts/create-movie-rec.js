// Get movie recommendation for multiple users

function getMovieRec(e){
    e.preventDefault();
    
    // Get number of input fields
    let form = document.getElementById("groupMember");
    let numOfIDs = form.getElementsByTagName("input").length;
    
    // Variable for userIDs
    let userID = [];

    // Store userIDs in array
    for(let x = 1; x <= numOfIDs; x++){
        userID[x-1] = document.getElementById(`ID-box-${x}`).value;
    }

    // TODO: Add some kind of check that the given users exists?

    // TODO: Get the different users movie preferences and calculate a recommendation 
    
}