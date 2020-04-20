let app = new Vue({
    el: '#app',
    data: {
        loggedIn: (localStorage.getItem('loggedIn') === 'true'),
        username: localStorage.getItem('username'),
        friendsList: [],
        selectedList: [],
        recommendations: [],
        posterSource: '',
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
        addToGroup: function(buddy) {
            if(app.selectedList.length < 4) {
                if (!app.selectedList.includes(buddy)) {
                    app.selectedList.push(buddy);
                    const idx = app.friendsList.indexOf(buddy);
                    app.friendsList.splice(idx, 1);
                } else { sweetAlert('Error', `You can't add ${buddy.name} to your group more than once.`, 'error') }
            } else {
                sweetAlert('Error', `You can't add more than 4 members to the group.`, 'error')
            }
        },
        removeFromGroup: function(buddy) {
            const idx = app.selectedList.indexOf(buddy);
            app.selectedList.splice(idx, 1);
            app.friendsList.push(buddy);
        },
        getMovieRec: async function() {
            // Clone selected list and append self
            const group = app.selectedList.map((member) => member.name);
            group.push(app.username);
            // Send to server
            const finalGroup = await axios.get('/getRecommendations', {params: { group }});
            const {data} = finalGroup
            console.log(data);
            this.recommendations = data;
        },
        getPoster: async function(rec) {
            const thing = `https://api.themoviedb.org/3/movie/${rec.movieObj.tmdbId}?api_key=eced0a249b99903b17b0cf910c02c201`
            const {data: {poster_path}} = await axios.get(thing);
            console.log(poster_path);
            this.posterSource = `http://image.tmdb.org/t/p/w342${poster_path}`; 
            return `http://image.tmdb.org/t/p/w342${poster_path}`;
        }
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

if(app.loggedIn) { updateFriendsListOnPage(); }


async function getFriendList() {
    const response = await axios.get('/fetchFriends', {params: { user: localStorage.getItem('username') }});
    app.friendsList = response["data"];
}
getFriendList();

async function findFriendsInUserDB(){
    const friends = await getUserDB();
    const username = localStorage.getItem('username');
    
    if (localStorage.getItem('loggedIn') == 'true'){
        for (let i = 0; i < userDB.length; i++) {}
    }
    

    return friends;
}

function createDropDownList(){
    friends = findFriendsInUserDB;
}
