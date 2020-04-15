let add = document.querySelector("#addPerson");
add.addEventListener("click", ()=>{
    let newLabel = document.createElement("LABEL");
    let newInput = document.createElement("INPUT")
    let formID = document.createAttribute("ID");
    newLabel.setAttribute("type", "text");
    newLabel.setAttribute("id", "ID-box");
    formID.value = "ID-box";
    newLabel.innerHTML = "Enter ID <br>";
    document.getElementById("groupMember").insertBefore(newLabel, document.getElementById("addPerson"));
    document.getElementById("groupMember").insertBefore(newInput, document.getElementById("addPerson"));
})

// let sub = document.querySelector("#submitForm");
// sub.addEventListener("click", () => {
//     sub.submit();
// })