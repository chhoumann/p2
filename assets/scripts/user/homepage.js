let app = new Vue({
    el: '#app',
    data: {
        loggedIn: (localStorage.getItem('loggedIn') === 'true'),
        username: localStorage.getItem('username'),
        movieTitle: "",
        imdbLink: "",
        movieDescription: "",
        ratedMovies: [],
        currentMoviePoster: "",
        searchTerm: "",
        movieData: [],
        moviesFoundInSearch: [],
        from: 0,
        to: new Date().getFullYear(),
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
        // document.querySelector gets used alot in several files, but not necessary if Vue is utilised?
        clearUsernameField: function() { document.querySelector("#usernameField").value = "" },
        isLoggedIn: function() { return (localStorage.getItem('loggedIn') === 'true')},
        toggleLoggedInState: function() { app.loggedIn = this.isLoggedIn() },
        usernameCheckResponseHandler: function (response, username) {
            if (response === true) {
                localStorage.setItem("loggedIn", true);
                localStorage.setItem("username", username);
                app.username = username;
                this.buildPage();
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
            const username = document.querySelector("#usernameField").value;
            const minUsernameLength = 3;
            const maxUsernameLength = 12;

            if (username.length < minUsernameLength || username.length > maxUsernameLength) {
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
        deleteAllRatings: async function() {
            const valid = await axios.get('/deleteAllRatings', {params: { username: localStorage.getItem('username') }});
            this.buildPage();
        },
        removeRating: async function(movie) {
            const {data: valid} = await axios.get('/removeRating', {params: 
                  { username: localStorage.getItem('username'),
                    movieDB_ID: parseInt(movie.movieID) }});
            this.buildPage();
        }, 
        searchForMovie: function() {
            if (this.searchTerm === "") this.moviesFoundInSearch = [];
            const found = this.movieData.filter(movie => {
                return movie["title"].toLowerCase().includes((this.searchTerm).toLowerCase());
            })
            if (found.length <= 5) {
                this.moviesFoundInSearch = found;
            }
        },
        buildPageWithMovie: async function(foundMovie) {
            buildPage(foundMovie);
            this.searchTerm = "";
            this.moviesFoundInSearch = [];
        }
    }
})

const getMovieData = async () => { return (await axios.get("/movieRatings"))["data"]; };
function printMovie(movie) {app.movieTitle = `${movie.title}`} 
function randomNumber(number) { return Math.floor(Math.random() * number); }
function getRandomMovie(movieData) { return movieData[randomNumber(movieData.length)]; }
const getURLString = (api_key, movieId) => { return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}`; };
const fetchMovie = async (movie) => {
    let apiRes;
    try {
        apiRes = await axios.get(getURLString("eced0a249b99903b17b0cf910c02c201", movie.tmdbId));
    } catch(error) {
        console.log(`Movie '${movie.title}' gave error code ${error.response.status}.`);
        return false;
    }
    return apiRes;
};

function changePoster(response) {
    if (!response) {
        console.log("No movie found");
        return false;
    };
    const posterURL = response["data"]["poster_path"];
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
    return false;
}

function makeSubmitButton(movie) {
    let submitRatingButton = document.getElementById('submitRating');
    // To remove existing event listeners.
    submitRatingButton.replaceWith(submitRatingButton.cloneNode(true));
    submitRatingButton = document.getElementById('submitRating');
    submitRatingButton.disabled = false;
    submitRatingButton.addEventListener('click', submitRatingHandler.bind(null, movie, submitRatingButton))
}

function submitRatingHandler(movie, button) {
    if (checkIfAlreadyRated(movie)) {
        sweetAlert("Error", "You cannot rate a movie twice", "error");
        return;
    }
    button.disabled = true;
    if (getRatingForMovie() === false) {
        sweetAlert('Error', 'Please give a rating to the movie before submitting.', 'error');
        button.disabled = false;
        return;
    }
    if (getRatingForMovie() === 0) {
        console.log("Movie unknown to user - ignoring.");
    } else {
        axios.get('/submitRating', {params: {
            username: localStorage.getItem('username'),
            movieDB_ID: parseInt(movie.movieId),
            title: movie.title,
            rating: getRatingForMovie(),
        }});
    }
    buildPage();
}

async function getRatingsForUser() {
    const response = await axios.get('/fetchRatedMoviesForUser', {params: {
        username: localStorage.getItem('username') // Should already be validated when logging in.
    }});
    return response["data"];
}

function getImdbLink(response) {
    if (!response) {
        console.log("No movie found");
        return false;
    };
    const imdbID = response["data"]["imdb_id"];
    app.imdbLink = `https://www.imdb.com/title/${imdbID}/`;
    return true;
}

function getMovieDescription(response) {
    if (!response) {
        console.log("No movie found");
        return false;
    };
    const movieDescription = response["data"]["overview"];
    app.movieDescription = movieDescription;
    return true;
}

function checkIfAlreadyRated(movie) {
    const found = app.ratedMovies.find(rMov => rMov.title === movie.title)
    return found;
}

function getMovie(){
    const MAX_ITERATIONS_BEFORE_STOP = 150;

    let movie = getRandomMovie(app.movieData);
    // Get a random movie and show it on the page
    const checkConditions = (iterations) => {
        if (iterations >= MAX_ITERATIONS_BEFORE_STOP) {
            sweetAlert("Error", "Couldn't find any movies in that range. Try again.\nPerhaps try to search for the title.", "error");
            return;
        };
        // Read the "to" and "from" fields related to requested movie year, and also check that the movie hasn't already been rated
        if (!(movie.year <= parseInt(app.to) && movie.year >= parseInt(app.from)) || checkIfAlreadyRated(movie)) {
            movie = getRandomMovie(app.movieData);
            checkConditions(++iterations);
        }
    }
    checkConditions(0);
    
    return movie;
}

// Check if user is logged in
async function buildPage(movieInput = false) {
    // Get movieData if it isn't already loaded
    if (app.movieData.length === 0) {
        app.movieData = await getMovieData();
    }
    
    // Makes it possible to give buildPage a preselected movie instead of a random one each time.
    const movie = movieInput ? movieInput : getMovie();

    // Skip anything existing in ratedMovies
    const found = app.ratedMovies.find(ratedMovie => { ratedMovie.movieID == movie.movieId })
    if (found) buildPage();
    // Show the poster for the movie
    const response = await fetchMovie(movie);
    if (!changePoster(response)) buildPage();
    getImdbLink(response);
    document.getElementById("imdbLink").href = app.imdbLink;
    getMovieDescription(response);
    
    // Build the list of items that the user has rated already
    app.ratedMovies = await getRatingsForUser();
    
    printMovie(movie);
    makeSubmitButton(movie);
};

if (app.loggedIn) buildPage();