require('./scripts/Profile');
function myFunction() {
        let x = document.getElementById("pword");
        if (x.type === "password") {
        x.type = "text";
        } else {
        x.type = "password";
        }
  }
