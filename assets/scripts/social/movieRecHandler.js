let app = new Vue({
    el: '#app',
    data: {
        loggedIn: (localStorage.getItem('loggedIn') === 'true'),
        username: localStorage.getItem('username'),
        friendsList: [],
        selectedList: [],
        recommendations: [],
        posterSource: '',
        movieCounter: 1,
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
            const username = document.querySelector("#usernameField").value;
            const minUsernameLength = 3;
            const maxUsernameLength = 12;

            // Client side 'verification' of username. We just picked these values
            if (username.length < minUsernameLength || username.length > maxUsernameLength) {
                sweetAlert('Error', 'Could not create a user with entered username. Please make sure that it has between 3 - 12 characters.', 'info');
            } else {
                // If valid username format, send it to the server for user creation
                const response = await axios.get('/createUser', {params: { username }});
                if (response["data"].userCreated === true) {
                    sweetAlert('Success!', `Your user '${username}' has been created! Logging you in.`, 'success');
                    this.submitLogin();
                } else {
                    sweetAlert('Error', 'User could not be created.', 'error');
                }
            }
        },
        addToGroup: function(user) {
            const maxGroupSize = 4;
            if(app.selectedList.length < maxGroupSize) {
                if (!app.selectedList.includes(user)) {
                    app.selectedList.push(user);
                    const idx = app.friendsList.indexOf(user);
                    app.friendsList.splice(idx, 1);
                } else { sweetAlert('Error', `You can't add ${user.name} to your group more than once.`, 'error') }
            } else {
                sweetAlert('Error', `You can't add more than 4 members to the group.`, 'error')
            }
        },
        removeFromGroup: function(user) {
            const idx = app.selectedList.indexOf(user);
            app.selectedList.splice(idx, 1);
            app.friendsList.push(user);
        },
        getMovieRec: async function(obj) {
            this.movieCounter = 1;
            // To prevent spam clicking
            obj.toElement.disabled = true;

            // Clone selected list and append self
            const group = app.selectedList.map((member) => member.name);
            group.push(app.username);

            // Send to server and get recommendations, and total number of ratings for the group
            const recommendationsForGroup = await axios.get('/getRecommendations', {params: { group }});
            const {data} = recommendationsForGroup;
            
            // If there are 0 ratings alert the user, and don't print any recommendations
            // If there is is less than 5 total ratings, alert the user
            if(data.ratings === 0) sweetAlert('Error', `There are no ratings in your group. Please rate some movies to get a recommendation!`, 'error');
            else if(data.ratings < 5) sweetAlert('Info', `There is only a total of ${data.ratings} ratings in the group. We recommend to rate at least 5 movies pr. person, to get better recommendations`, 'info');

            // Append the posters to the page, only if there is enough ratings!
            if(data.ratings > 0) data.rec.forEach(rec => this.getPoster(rec));

            this.recommendations = data.rec;
            // Allows to click button again
            obj.toElement.disabled = false;
        },
        getPoster: async function(rec) {
            // Used to get the poster api via PRIVATE (please don't use) api key
            const tmdbAPIURL = `https://api.themoviedb.org/3/movie/${rec.movieObj.tmdbId}?api_key=eced0a249b99903b17b0cf910c02c201`
            const {data: {poster_path}} = await axios.get(tmdbAPIURL);
            // Poster temp is set to a link with a variable posterpath
            const poster_temp = `http://image.tmdb.org/t/p/w342${poster_path}`;

            // Create the element
            let div = document.querySelector('#poster-div')
            let header = document.createElement("h3");
            header.innerHTML = `${this.movieCounter}. ${rec.movieObj.title}`;
            header.setAttribute('class', 'title');
            header.style = "color: light-gray";
            let poster = document.createElement("img");
            poster.style = "margin-bottom: 2rem"
            poster.src = poster_temp;
            // Insert the poster element
            div.appendChild(header, div);
            div.appendChild(poster, div);

            this.movieCounter++;
        }
    }
});


async function getFriendList() {
    const response = await axios.get('/fetchFriends', {params: { user: localStorage.getItem('username') }});
    app.friendsList = response["data"];
}

if(app.loggedIn) {
    getFriendList();
    // Clear the poster-div of elements when the getMoviesButton is clicked.
    const getMoviesButton = document.getElementById("getMoviesButton");
    getMoviesButton.addEventListener('click', () => {
        let div = document.querySelector("#poster-div");
        div.innerHTML = '<br>';
        if (div.textContent) div.textContent = '';
    })
}
