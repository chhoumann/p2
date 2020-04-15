let user = localStorage.getItem("username");
let movieData;

axios.get('/movieRatings').then(function(response){
    console.log(response.data);
    printMovie(response.data);
});

function printMovie(data) {

    let movieLabel = document.createElement("LABEL");
    movieLabel.setAttribute("type", "text");
    movieLabel.innerHTML = `Movie: ${data[randomNumber(100)].title}<br>`

    document.getElementById("account").insertBefore(movieLabel, document.getElementById("movie1-1"));

}

function randomNumber(number){
    return Math.floor(Math.random() * number);
}

// Pushet præferencer til user


