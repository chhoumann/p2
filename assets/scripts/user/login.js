const usernameField = document.querySelector("#usernameField");
const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logoutButton");
const loginSystemDiv = document.querySelector("#loginSystem");
const loginDiv = document.querySelector("#login");
const logoutDiv = document.querySelector("#logout");

const clearUsernameField = () => { usernameField.value = "" };

function toggleLoggedInState() {
    if (localStorage.getItem('loggedIn') === "true") {
        loginDiv.style.display = "none";
        logoutDiv.style.display = "block";
    } else if (localStorage.getItem('loggedIn') === "false") {
        loginDiv.style.display = "block";
        logoutDiv.style.display = "none";
    }
}

function logoutHandler() {
    localStorage.setItem("loggedIn", false);
    localStorage.removeItem("username");
    toggleLoggedInState();
}

function usernameCheckResponseHandler(response, username) {
    if (response === true) {
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("username", username);
    } else {
        alert(`Login unsuccessful. Try again.`);
        localStorage.setItem("loggedIn", false);
    }
    toggleLoggedInState();
}

function submitLogin() {
    const submittedUsername = usernameField.value;
    axios.get('/loginUsername', {params: {
        username: submittedUsername
    }}).then(res => usernameCheckResponseHandler(res.data, submittedUsername));
    
    // Clear the input field
    clearUsernameField();
};

loginButton.addEventListener('click', submitLogin);
logoutButton.addEventListener('click', logoutHandler);
window.onload = toggleLoggedInState();