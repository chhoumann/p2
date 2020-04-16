let add = document.querySelector("#addPerson");

/* Variable for incrementing ID for input boxes
   Begins at 2 because of the two already existing inputs */
let input_box_ID = 2;
add.addEventListener("click", ()=>{
    let newLabel = document.createElement("LABEL");
    let newInput = document.createElement("INPUT");

    newLabel.setAttribute("type", "text");

    newInput.setAttribute("id", `ID-box-${input_box_ID + 1}`);
    newInput.setAttribute("name", "ID");

    
    // Max of 5 - maybe 4 (user is 1 person)
    if(input_box_ID < 4) {
        newLabel.innerHTML = "<br>Enter ID <br>";
        document.getElementById("groupMember").insertBefore(newLabel, document.getElementById("addPerson"));
        document.getElementById("groupMember").insertBefore(newInput, document.getElementById("addPerson"));
    } else {
        alert("Maximum of 5 people!");
    }

    //Increment variable to give new ID to input box 
    input_box_ID += 1;
})

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
