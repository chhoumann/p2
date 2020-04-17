let app = new Vue({
    el: '#app',
    data: {
        loggedIn: (localStorage.getItem('loggedIn') === 'true'),
        username: localStorage.getItem('username'),
        movieTitle: "",
        ratedMovies: [],
        currentMoviePoster: "",
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
        redirCreateAccout: function() {
            window.location.href = "/createProfile"
        },
        clearUsernameField: function() { document.querySelector("#usernameField").value = "" },
        isLoggedIn: function() { return (localStorage.getItem('loggedIn') === 'true')},
        toggleLoggedInState: function() { app.loggedIn = this.isLoggedIn() },
        usernameCheckResponseHandler: function (response, username) {
            if (response === true) {
                localStorage.setItem("loggedIn", true);
                localStorage.setItem("username", username);
                app.username = username;
                this.buildPage(); // build page for new user
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
        buildPage: () => {buildPage()},
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

const getMovieData = async () => { return (await axios.get("/movieRatings"))["data"]; };
function printMovie(movie) { app.movieTitle = `Movie: ${movie.title}` } 
function randomNumber(number) { return Math.floor(Math.random() * number); }
function getRandomMovie(movieData) { return movieData[randomNumber(100)]; }
const getURLString = (api_key, searchQuery) => { return `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchQuery}&page=1`; };
const fetchMovie = async (movie) => { return await axios.get(getURLString("eced0a249b99903b17b0cf910c02c201", formatMovieTitle(movie))); };

// Removes (year) from each movie title so it can be searched
const formatMovieTitle = (movie) => {
    // Split and remove from start of year-parentheses
    const movieTitle = movie["title"].split("");
    const idx = movieTitle.indexOf("(");
    movieTitle.splice(idx, 6);
    // Join the remaining parts
    const colMovTitle = movieTitle.join("");
    return colMovTitle;
}

function changePoster(response) {
    if (response["data"]["results"].length === 0) {
        console.log("No movie found");
        return false;
    };
    const posterURL = response["data"]["results"][0]["poster_path"];
    if (posterURL === null || posterURL === "" || posterURL === "") return false;

    app.currentMoviePoster = `http://image.tmdb.org/t/p/w342${posterURL}`;
    return true;
}

// Radio buttons.
const getRatingForMovie = () => {
    if (document.getElementById('movie1-1').checked) return 1;
    if (document.getElementById('movie1-2').checked) return 2;
    if (document.getElementById('movie1-3').checked) return 3;
    if (document.getElementById('movie1-4').checked) return 4;
    if (document.getElementById('movie1-5').checked) return 5;
    /* if (document.getElementById('movie1-unknown').checked) return 0; */
}

function submitRatingHandler(movie) {
    if (getRatingForMovie() === 0) {
        console.log("Movie unknown to user - ignoring.")
    } else {
        axios.get('/submitRating', {params: {
            username: localStorage.getItem('username'),
            movieDB_ID: parseInt(movie.id),
            title: movie.title,
            rating: getRatingForMovie(),
        }});
    }
    buildPage();
}

function makeSubmitButton(movie) {
    let submitRatingButton = document.getElementById('submitRating');
    // To remove existing event listeners.
    submitRatingButton.replaceWith(submitRatingButton.cloneNode(true));
    submitRatingButton = document.getElementById('submitRating');

    submitRatingButton.addEventListener('click', submitRatingHandler.bind(null, movie))
}

async function getRatingsForUser() {
    const response = await axios.get('/fetchRatedMoviesForUser', {params: {
        username: localStorage.getItem('username') // should already be validated when logging in.
    }});
    return response["data"];
}

// Check if user is logged in
async function buildPage() {
    let movieData;

    // Get movieData if it isn't already loaded
    if (movieData === undefined) {
        movieData = await getMovieData();
    }
    // Get a random movie and show it on the page
    const movie = getRandomMovie(movieData);
    printMovie(movie);
    // Show the poster for the movie
    const response = await fetchMovie(movie);
    if (!changePoster(response)) buildPage();
    
    makeSubmitButton(movie);

    // Build the list of items that the user has rated already
    app.ratedMovies = await getRatingsForUser();
    
};

if (app.loggedIn) buildPage();

/*
TODOS
* [X] Hvis film er unknown skal der ikke pushes
* []  Der skal ikke pushes / vises film som allerede er rated
    - DONE: Få brugeres 'moviePreferences' array (indlæs fra userDB)
    - DONE: Print til siden (for at vise bedømte film og deres ratings - evt inkluder titlen på filmen i moviePreferences så den kan tilgås)
    - Lav .find() funktion til at tjekke om den film som der skal vises på siden allerede er bedømt
* [X]  Fix 404 bug for posters (se board)
* []  Gør koden læsbar
* [X] Gør sådan at man ikke kan rate uden at være logget ind
* [] Bug: Hvis man spammer Rate så kan der tilføjes samme film to gange...
    - Slå knappen fra når den er trykket og slå den til når næste film er klar
*/