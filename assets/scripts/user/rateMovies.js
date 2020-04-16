let user = localStorage.getItem("username");
const isLoggedIn = () => {
  return localStorage.getItem("loggedIn") === "true";
};
const getMovieData = async () => {
  const movieData = (await axios.get("/movieRatings"))["data"];
  return movieData;
};

function getRandomMovie(movieData) {
  const rand = randomNumber(100);
  return movieData[rand];
}

function printMovie(movie) {
    const movieNameHolder = document.getElementById('movieName');
    movieNameHolder.innerHTML = `Movie: ${movie.title}`
} 

function randomNumber(number) {
  return Math.floor(Math.random() * number);
}

const getURLString = (api_key, searchQuery) => {
    return `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchQuery}&page=1`;
};

// Removes (year) from each movie title so it can be searched
const formatMovieTitle = (movie) => {
    const movieTitle = movie["title"].split("");
    const idx = movieTitle.indexOf("(");
    movieTitle.splice(idx, 6);
    const colMovTitle = movieTitle.join("");
    return colMovTitle;
}

const fetchMovie = async (movie) => {
    const response = await axios.get(
    getURLString("eced0a249b99903b17b0cf910c02c201", formatMovieTitle(movie)));
    return response;
};

function changePoster(response) {
    if (response["data"]["results"].length === 0) {
        console.log("No movie found");
        return false;
    };
    const posterURL = response["data"]["results"][0]["poster_path"];
    if (posterURL === null || posterURL === "" || posterURL === "") return false;

    const docImg = document.getElementById("posterDisplay");
    docImg.src = `http://image.tmdb.org/t/p/w342${posterURL}`;
    return true;
}

// Radio buttons.
const getRatingForMovie = () => {
    if (document.getElementById('movie1-1').checked) return 1;
    if (document.getElementById('movie1-2').checked) return 2;
    if (document.getElementById('movie1-3').checked) return 3;
    if (document.getElementById('movie1-4').checked) return 4;
    if (document.getElementById('movie1-5').checked) return 5;
    if (document.getElementById('movie1-unknown').checked) return 0;
}

function submitRatingHandler(movie) {
    if (getRatingForMovie() === 0) {
        console.log("Movie unknown to user - ignoring.")
    } else {
        axios.get('/submitRating', {params: {
            username: localStorage.getItem('username'),
            movieDB_ID: parseInt(movie.id),
            rating: getRatingForMovie()
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

// Check if user is logged in
async function buildPage() {
    let movieData;
    if (isLoggedIn()) {
        if (movieData === undefined) {
            movieData = await getMovieData();
        }
        const movie = getRandomMovie(movieData);
        printMovie(movie);
        const response = await fetchMovie(movie);

        if (!changePoster(response)) buildPage();
        makeSubmitButton(movie);
    }
};

buildPage();

/*
TODOS
* [X] Hvis film er unknown skal der ikke pushes
* []  Der skal ikke pushes / vises film som allerede er rated
    - Få brugeres 'moviePreferences' array (indlæs fra userDB)
    - Print til siden (for at vise bedømte film og deres ratings - evt inkluder titlen på filmen i moviePreferences så den kan tilgås)
    - Lav .find() funktion til at tjekke om den film som der skal vises på siden allerede er bedømt
* [X]  Fix 404 bug for posters (se board)
* []  Gør koden læsbar
*/