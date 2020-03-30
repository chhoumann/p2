let add = document.querySelector("#addPerson");

/* Variable for incrementing ID for input boxes
   Begins at 2 because of the two already existing inputs */
let input_box_ID = 2;
add.addEventListener("click", ()=>{
    let newLabel = document.createElement("LABEL");
    let newInput = document.createElement("INPUT");

    //What is this used for?
    let formID = document.createAttribute("ID");
    formID.value = "ID-box";

    newLabel.setAttribute("type", "text");
    newLabel.setAttribute("id", "ID-box");

    newInput.setAttribute("id", `ID-box-${input_box_ID + 1}`);
    newInput.setAttribute("name", "ID");

    //Increment variable to give new ID to input box 
    input_box_ID += 1;

    newLabel.innerHTML = "<br>Enter ID <br>";
    document.getElementById("groupMember").insertBefore(newLabel, document.getElementById("addPerson"));
    document.getElementById("groupMember").insertBefore(newInput, document.getElementById("addPerson"));

})

// let sub = document.querySelector("#submitForm");
// sub.addEventListener("click", () => {
//     sub.submit();
// })