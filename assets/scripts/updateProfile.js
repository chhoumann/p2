// ! Christian: Har givet den et lidt mere relevant navn og lavet indentation.
// Bruges i Profile.ejs
function showPassword() {
        let x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
  }
