const dataHandler = require('./assets/scripts/data/dataHandler');
const express = require('express');
const app = express();
const arrayOfUserIds = [3, 5, 4, 2, 1]; // Used for testing. Users 1-5 are test-users.
let testGroup;
let bodyParser = require('body-parser'); 
let urlencodedParser = bodyParser.urlencoded({ extended: false })  
let db = {};

// Setting the template engine (ejs)
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('assets'));

// Routes
app.get('/', (req, res) => {
    res.render('test');

});
app.get('/profile', (req, res) => {
    res.render('profile');
  });

app.get('/connect-with-friends', (req, res) => {
  res.render('connect-with-friends');
});

app.get('/movie-rec', (req, res) => {
    res.render('movie-rec');

});

app.get('/updateProfile', (req, res) => {
    res.render('updateProfile');

});

app.get('/createAccount', (req, res) => {
    res.render('createAccount');

});
// Dette sender informationerne fra formen fra http://localhost:8000/Profile til http://localhost:8000/something
// Der er redirect efter submit, men dette logger desuden requesten til consollen samt skriver det på '/something'.
// TODO: Der burde tilføjes funktionalitet som skriver alt dette til en json fil (vores database over brugere) og tjekker duplicates.
// TODO: Desuden også validering for at se om 1. duplicates og 2. der er indtastet gyldigt input. Men 2. skal ikke ske på server-siden pt.
app.post('/something', urlencodedParser, function (req, res) {  
   // Prepare output in JSON format  
   response = {  
       uname:req.body.uname,  // Overvej at bruge de fulde ord frem for forkortelser, selv om det er lettere
       pword:req.body.pword,
       gender:req.body.gender  
   };  
   console.log(response);
   res.end(JSON.stringify(response)); // Her skrives til '/something'  
})  


// Builds database.
// Horrible on memory but confines our project to JS only (no use of external DBs).
const startup = async () => { 
    db.userDB = await dataHandler.buildMovieLensUserDB();
    testGroup = dataHandler.groupUsers(db.userDB, 5, arrayOfUserIds);
    // console.log(testGroup);
}
startup();

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

server = app.listen(port);