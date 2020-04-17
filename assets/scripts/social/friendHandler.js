const isLoggedIn = () => { return (localStorage.getItem('loggedIn') === 'true'); }
let app = new Vue({
    el: '#app',
    data: {
        loggedIn: (localStorage.getItem('loggedIn') === 'true'),
        username: localStorage.getItem('username'),
        title: 'Connect with friends',
        loggedIn: isLoggedIn(),
        username: "",
        friendsList: [],
        errorSelf: false,
        errorDupe: false,
        errorInput: false,
        errorNoUserWithName: false,
    },
    methods: {
        login: function () {
            const submittedUsername = usernameField.value;
            axios.get('/loginUsername', {params: {
                username: submittedUsername
            }}).then(res => this.usernameCheckResponseHandler(res.data, submittedUsername));
            this.clearUsernameField();
        },
        logout: function () {
            localStorage.setItem("loggedIn", false);
            localStorage.removeItem("username");
            this.username = "";
            this.toggleLoggedInState();
        },
        clearUsernameField: function() { document.querySelector("#usernameField").value = "" },
        isLoggedIn: function() { return (localStorage.getItem('loggedIn') === 'true')},
        toggleLoggedInState: function() { app.loggedIn = this.isLoggedIn() },
        usernameCheckResponseHandler: function (response, username) {
            if (response === true) {
                localStorage.setItem("loggedIn", true);
                localStorage.setItem("username", username);
                app.username = username;
            } else {
                sweetAlert('Error', `Login unsuccessful. Try again.`, 'error');
                localStorage.setItem("loggedIn", false);
            }
            this.toggleLoggedInState();
        },
        submitLogin: async function() {
            const usernameField = document.querySelector("#usernameField");
            const submittedUsername = usernameField.value;
            const res = await axios.get('/loginUsername', {params: {
                username: submittedUsername
            }})
            this.usernameCheckResponseHandler(res.data, submittedUsername);
            
            // Clear the input field
            this.clearUsernameField();
        },
        createNewUser: async function() {
            // TODO: Error if less than 3 but more than 12 characters.
            const username = document.querySelector("#usernameField").value;

            if (username.length < 3 || username.length > 12) {
                sweetAlert('Error', 'Could not create a user with entered username. Please make sure that it has between 3 - 12 characters.', 'info');
            } else {
                const response = await axios.get('/createUser', {params: { username }});
                if (response["data"].userCreated === true) {
                    sweetAlert('Success!', `Your user '${username}' has been created! Logging you in.`, 'success');
                    this.submitLogin();
                } else {
                    sweetAlert('Error', 'User could not be created.', 'error');
                }
            }
        },
    }
})

function fetchAndSetUsername() {
    const username = localStorage.getItem('username');
    if ( app.username !== username ) app.username = username;
    return username;
}

// Fetch the friend list of logged-in user.
async function fetchFriendsList(user) {
    const response = await axios.get('/fetchFriends', {params: {user}});
    const friendsList = response.data;
    return friendsList;
};

// Uses Vue functionality to update list of friends on page.
const updateFriendsListOnPage = async () => { app.friendsList = await fetchFriendsList(fetchAndSetUsername())};

// Handle if user is adding itself
const selfAddErrorHandler = (requestBy, addName) => {
    app.errorDupe = false; // <- Bug fix: if you add dupe and then yourself it shows two error messages. Thanks || operator.
    if (requestBy === addName) {
        app.errorSelf = true;
        return true;
    } else { app.errorSelf = false };
};

// Handle if user is adding someone who is already a friend
const dupeAddErrorHandler = async (requestBy, addName) => {
    const FL = await fetchFriendsList(requestBy);
    const findDupe = FL.find(user => { return user.name === addName })
    if (findDupe) {
        app.errorDupe = true;
        return true;
    } else { app.errorDupe = false }
};

const friendNameInputErrorHandler = () => {
    if (friendNameInput.value === "" ) {
        app.errorInput = true;
        return true;
    } else { app.errorInput = false };
}

const handleErrors = async (requestBy, addName) => {
    let errorOccurred = false;
    if (friendNameInputErrorHandler()) errorOccurred = true;
    if (selfAddErrorHandler(requestBy, addName)) errorOccurred = true;
    if (await dupeAddErrorHandler(requestBy, addName)) errorOccurred = true;
    return errorOccurred;
}

async function addFriend() {
    const requestBy = fetchAndSetUsername();
    const addName = friendNameInput.value;

    // Error handling
    if (await handleErrors(requestBy, addName)) return;

    // Send to server
    const response = await axios.get('/addFriend', {params: { requestBy, addName }});
    
    console.log(response["data"].valid) // test

    // Depending on the response, it'll append the friend added to the friends list on the page.
    if (response["data"].valid) {
        app.friendsList.push({name: addName})
    } else { app.errorNoUserWithName = true }
}

if (isLoggedIn()) {
    updateFriendsListOnPage();
    const friendNameInput = document.querySelector('#friendNameInput');
    const addFriendBtn = document.querySelector('#addFriendBtn');
    addFriendBtn.addEventListener('click', addFriend);
}