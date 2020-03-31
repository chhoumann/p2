// check if inputs are valid
function checkForm(){
    //event.preventDefault();
    
    // Get number of input fields
    let form = document.getElementById("groupMember");
    let numOfIDs = form.getElementsByTagName("input").length;
    
    // Variable for userIDs
    let userIDArray = [];
    let userID;
    let foundErr;

    // Store userIDs in array
    for(let x = 1; x <= numOfIDs; x++){
        userID = document.getElementById(`ID-box-${x}`).value;

        if(!isNaN(userID) && userID != ""){
            userIDArray.push(userID);
            console.log("Succes!")
        } else {
            console.log("Not a number fam!");
            foundErr = 1;

            return false;
        }
        
    }
}
