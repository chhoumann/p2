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

    const docImg = document.getElementById("posterDisplay");
    docImg.src = `http://image.tmdb.org/t/p/w342${posterURL}`;
    return true;
}

const getRatingForMovie = () => {
    const r1 = document.getElementById('movie1-1');
    const r2 = document.getElementById('movie1-2');
    const r3 = document.getElementById('movie1-3');
    const r4 = document.getElementById('movie1-4');
    const r5 = document.getElementById('movie1-5');
    const unk = document.getElementById('movie1-unknown');

    if (r1.checked) return 1;
    if (r2.checked) return 2;
    if (r3.checked) return 3;
    if (r4.checked) return 4;
    if (r5.checked) return 5;
    if (unk.checked) return 0;
}

function submitRatingHandler(movie) {
    axios.get('/submitRating', {params: {
        username: localStorage.getItem('username'),
        movieDB_ID: parseInt(movie.id),
        rating: getRatingForMovie()
    }});
    buildPage();
}

function makeSubmitButton(movie) {
    let submitRatingButton = document.getElementById('submitRating');
    // To remove existing event listeners.
    submitRatingButton.replaceWith(submitRatingButton.cloneNode(true));

    submitRatingButton = document.getElementById('submitRating');
    submitRatingButton.addEventListener('click', submitRatingHandler.bind(null, movie))
}
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

// Check if user is logged in
buildPage();

/*
TODOS
* Hvis film er unknown skal der ikke pushes
* Der skal ikke pushes / vises film som allerede er rated
* Fix 404 bug for posters (se board)
* Gør koden læsbar
*/