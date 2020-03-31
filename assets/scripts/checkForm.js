// check if inputs are valid
function checkForm(){
    // Get number of input fields
    let form = document.getElementById("groupMember");
    let numOfIDs = form.getElementsByTagName("input").length;
    
    // Variable for userIDs
    let userIDArray = [];
    let userID;

    // Store userIDs in array
    for(let x = 1; x <= numOfIDs; x++){
        userID = document.getElementById(`ID-box-${x}`).value;

        if(!isNaN(userID) && userID != ""){
            userIDArray.push(userID);
            console.log("Added user to array")
        } else {
            alert("Not valid input!");
            return false;
        }
        
    }

    // check for duplicates
    if(checkDuplicates(userIDArray)){
        console.log("No duplicates");
    } else {
        alert("You can't add the same person more than once!");
        return false;
    }
}

// check for duplicates using Set()
// Set() can only contain unique elements, so if the size differs, there is a duplicate.
function checkDuplicates(userArray){
    return userArray.length === new Set(userArray).size;
}
