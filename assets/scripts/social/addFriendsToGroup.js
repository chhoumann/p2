let app = new Vue({
    el: '#app',
    data: {
        loggedIn: (localStorage.getItem('loggedIn') === 'true'),
        username: localStorage.getItem('username'),
        friendsList: [],
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

if(app.loggedIn) { updateFriendsListOnPage(); }


async function getFriendList() {
    const response = await axios.get('/fetchFriends', {params: { user: localStorage.getItem('username') }});
    // console.log(response["data"]);
    app.friendsList = response["data"];
}
getFriendList();

async function findFriendsInUserDB(){
    const friends = await getUserDB()
    const username = localStorage.getItem('username');
    
    if (localStorage.getItem('loggedIn') == 'true'){
        for (let i = 0; i < userDB.length; i++) {}
    }
    

    return friends;
}

function createDropDownList(){
    friends = findFriendsInUserDB;


}

// function createDropDownList(){
//     let i;
//     for (let i = 0, i < response.length)
// }

// myfunc(){
//     group.push(userdb.id)
// }
// myfuncDetele(){
//     group.splice(indexof(group["userdb"]["id"]), 1);
// }