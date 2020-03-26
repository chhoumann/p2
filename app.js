const bodyParser = require('body-parser'); 
const fs = require('fs');
const express = require('express');
const routes = require('./routes')
const initialize = require('./initialize');
const app = express();
let urlencodedParser = bodyParser.urlencoded({ extended: false })  
let port;

/* // * Ikke længere relevant at bruge db objektet. Desuden er dette blot en test - fjern senere.  
let db = {};
db.userDB =  [];
db.userDB.push({id: 0, username: "Mr. Zero"});
db.userDB.push({id: 1, username: "Mr. One"});
let json = JSON.stringify(db.userDB);
fs.writeFile('dbOfUsers.json', json, (err) => { if (err) throw err; });
*/

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

initialize.initialize(startServer);