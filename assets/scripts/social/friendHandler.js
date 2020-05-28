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
        error: '',
    },
    created() {
        if (this.isLoggedIn()) {
            (async () => await this.updateFriendsListOnPage())();
        }
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
        // document.queryselector is not nessecary because we are using vue
        clearUsernameField: function() { document.querySelector("#usernameField").value = "" },
        isLoggedIn: function() { return (localStorage.getItem('loggedIn') === 'true')},
        toggleLoggedInState: function() { app.loggedIn = this.isLoggedIn() },
        usernameCheckResponseHandler: function (response, username) {
            if (response === true) {
                localStorage.setItem("loggedIn", true);
                localStorage.setItem("username", username);
                app.username = username;
                this.updateFriendsListOnPage();
            } else {
                sweetAlert('Error', `Login unsuccessful. Try again.`, 'error');
                localStorage.setItem("loggedIn", false);
            }
            this.toggleLoggedInState();
        },
        // not needed since we have login
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
            const username = document.querySelector("#usernameField").value;
            const minUsernameLength = 3;
            const maxUsernameLength = 12;

            if (username.length < minUsernameLength || username.length > maxUsernameLength) {
                sweetAlert('Error', 'Could not create a user with entered username. Please make sure that it has between 3 - 12 characters.', 'info');
            } else {
                const response = await axios.get('/createUser', {params: { username }});
                if (response["data"].userCreated === true) {
                    sweetAlert('Success!', `Your user '${username}' has been created! Logging you in.`, 'success');
                    this.login();
                } else {
                    sweetAlert('Error', 'User could not be created.', 'error');
                }
            }
        },
        updateFriendsListOnPage: async function() {
            this.friendsList = await this.fetchFriendsList(this.fetchAndSetUsername());
        },
        fetchAndSetUsername: function() {
            const username = localStorage.getItem('username');
            if ( this.username !== username ) this.username = username;
            return username;
        },
        addFriend: async function() {
            const requestBy = this.username;
            const addName = friendNameInput.value;
        
            // Error handling
            if (await this.handleErrors(requestBy, addName)) return;
        
            // Send to server
            const {data: {valid}} = await axios.get('/addFriend', {params: { requestBy, addName }});
        
            // Depending on the response, it'll append the friend added to the friends list on the page.
            if (valid) {
                app.friendsList.push({name: addName});
                app.error = '';
            } else { app.error = 'No user with that name exists.'; }
        },
        removeFriend: async function(friend) {
            const {data:{valid}} = await axios.get('/removeFriend', {params: 
                { username: localStorage.getItem('username'),
                  friend: (friend.friends) }});
                  this.updateFriendsListOnPage();
        },

        // Fetch the friend list of logged-in user.
        fetchFriendsList: async function(user) {
            const response = await axios.get('/fetchFriends', {params: {user}});
            const friendsList = response.data;
            return friendsList;
        },
        // Handle if user is adding itself
        selfAddErrorHandler: function(requestBy, addName) {
            if (requestBy === addName) {
                app.error = "You can't add yourself as a friend.";
                return true;
            }
        },
        // Handle if user is adding someone who is already a friend
        dupeAddErrorHandler: async function(requestBy, addName) {
            const FL = await this.fetchFriendsList(requestBy);
            const findDupe = FL.find(user => { return user.name === addName })
            if (findDupe) {
                app.error = 'You are already friends.';
                return true;
            }
        },
        friendNameInputErrorHandler: function() {
            if (friendNameInput.value === "" ) {
                app.error = 'No friend name entered.'
                return true;
            }
        },
        handleErrors: async function(requestBy, addName) {
            let errorOccurred = false;
            if (this.friendNameInputErrorHandler()) errorOccurred = true;
            if (this.selfAddErrorHandler(requestBy, addName)) errorOccurred = true;
            if (await this.dupeAddErrorHandler(requestBy, addName)) errorOccurred = true;
            return errorOccurred;
        }
    }
})