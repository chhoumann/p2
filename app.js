const dataHandler = require('./assets/scripts/data/dataHandler');
const utility = require('./utility');
const bodyParser = require('body-parser'); 
const routes = require('./routes.js')
const express = require('express');
const {performance} = require('perf_hooks');
const fs = require('fs');
const arrayOfUserIds = [3, 5, 4, 2, 1]; // Used for testing. Users 1-5 are test-users.
const SEPARATOR = "----------------------------------------------";
const app = express();
let testGroup;
let port;
let urlencodedParser = bodyParser.urlencoded({ extended: false })  
let db = {};

db.userDB =  [];
db.userDB.push({id: 0, username: "Mr. Zero"});
db.userDB.push({id: 1, username: "Mr. One"});
let json = JSON.stringify(db.userDB);
fs.writeFile('dbOfUsers.json', json, (err) => { if (err) throw err; }); // Overvej om den her skal ned i initialize()

// Setting the template engine (ejs)
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('assets'));

// Routes
app.use('/', routes);

// Dette sender informationerne fra formen fra http://localhost:8000/Profile til http://localhost:8000/something
// Der er redirect efter submit, men dette logger desuden requesten til consollen samt skriver det på '/something'.
// TODO: Der burde tilføjes funktionalitet som skriver alt dette til en json fil (vores database over brugere) og tjekker duplicates.
// TODO: Desuden også validering for at se om 1. duplicates og 2. der er indtastet gyldigt input. Men 2. skal ikke ske på server-siden pt.
app.post('/something', urlencodedParser, function (req, res) {  
   // Prepare output in JSON format  
   response = {  
       username:req.body.username,
       password:req.body.password,
       gender:req.body.gender  
   };  
   console.log(response);
   res.end(JSON.stringify(response)); // Her skrives til '/something' som klienten modtager
});

// Used to start the server and print 
const startServer = () => {
    try {
        // Heroku support.
        port = process.env.PORT;
        if (port == null || port == "") port = 8000;
        server = app.listen(port);
    } finally { console.log(`\n Server successfully running at http://127.0.0.1:${port}/`); }
}

// Builds database & test group. Basically anything that should be loaded before the user interacts with the web application.
// Horrible on memory but confines our project to JS only (no use of external DBs).
const initialize = async (serverStartCallback) => {
    console.log(SEPARATOR);
    try {
        let startTime = performance.now();
        db.MovieLensUserDB = await dataHandler.buildMovieLensUserDB();
        utility.printTestAndTime("MovieLensUserDB", db.MovieLensUserDB, startTime);
        
        startTime = performance.now();
        testGroup = dataHandler.groupUsers(db.MovieLensUserDB, 5, arrayOfUserIds);
        utility.printTestAndTime("Testgroup", testGroup, startTime);

        /* console.log("Write testgroup to JSON file.");
        let testGroupJSON = JSON.stringify(testGroup);
        fs.writeFile('testGroupUsers.json', testGroupJSON, (err) => { if (err) throw err; }); */
    } catch(error) { utility.logError(error) };
    
    serverStartCallback();
    console.log(SEPARATOR);
}

initialize(startServer);