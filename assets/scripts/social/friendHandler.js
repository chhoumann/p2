const isLoggedIn = () => { return (localStorage.getItem('loggedIn') === 'true'); }
let app = new Vue({
    el: '#app',
    data: {
        title: 'Connect with friends',
        loggedIn: isLoggedIn(),
        username: "",
        friendsList: [],
        errorSelf: false,
        errorDupe: false,
        errorInput: false,
        errorNoUserWithName: false,
    }
});

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