const bodyParser = require('body-parser'); 
<<<<<<< HEAD
const routes = require('./routes.js');
const express = require('express');
=======
>>>>>>> 25c479184a9fa378453dc2a8c87b330089e82433
const {performance} = require('perf_hooks');
const fs = require('fs');
const express = require('express');
const routes = require('./routes')
const initialize = require('./initialize');
const app = express();
<<<<<<< HEAD
const userDbFile = './db/dbOfUsers.json';
let writeStream = fs.createWriteStream(userDbFile);
let testGroup;
let port;
=======
>>>>>>> 25c479184a9fa378453dc2a8c87b330089e82433
let urlencodedParser = bodyParser.urlencoded({ extended: false })  
let port;

<<<<<<< HEAD
db.userDB = [];

// Error handling (hvis JSON er tom / ugyldig) => init tomt array, ellers sæt db.userDB = JSON.parse(userDbFile)
function test() {
    try {
        let userDBLoaded = fs.readFile(userDbFile);
        if (userDBLoaded == undefined) throw "fejl forfanden";
    }
    catch(error) {
        console.log("nej");
    }
}
 
console.log(`Det her: ${test()}`);
console.log(userDbFile);
=======
/* // * Ikke længere relevant at bruge db objektet. Desuden er dette blot en test - fjern senere.  
let db = {};
db.userDB =  [];
db.userDB.push({id: 0, username: "Mr. Zero"});
db.userDB.push({id: 1, username: "Mr. One"});
let json = JSON.stringify(db.userDB);
fs.writeFile('dbOfUsers.json', json, (err) => { if (err) throw err; });
*/
>>>>>>> 25c479184a9fa378453dc2a8c87b330089e82433

let userDbFile = './db/dbOfUsers.json';
// Error handling (hvis JSON er tom / ugyldig) => init tomt array, ellers sæt db.userDB = JSON.parse(userDbFile)
function test() {
    try {
        let userDBLoaded = fs.readFile(userDbFile);
        if (userDBLoaded == undefined) throw "fejl forfanden";
    }
    catch(error) {
        console.log(error);
    }
}
 
console.log(`Det her: ${test()}`);

// console.log(JSON.stringify(userDbFile));
// console.log(JSON.parse(userDbFile));
// Setting the template engine (ejs)
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('assets'));

// Routes
app.use('/', routes);

// Dette sender informationerne fra formen fra http://localhost:8000/Profile til http://localhost:8000/something
// Der er redirect efter submit, men dette logger desuden requesten til consollen samt skriver det på '/something'.
// TODO: Der burde tilføjes funktionalitet som tjekker duplicates i JSON fil.
// TODO: Desuden også validering for at se om 1. duplicates og 2. der er indtastet gyldigt input. Men 2. skal ikke ske på server-siden pt.
app.post('/something', urlencodedParser, function (req, res) {  
<<<<<<< HEAD
    // Prepare output in JSON format  
    response = {  
       username:req.body.username,  // Overvej at bruge de fulde ord frem for forkortelser, selv om det er lettere
       password:req.body.password,
       gender:req.body.gender  
    };
    // if (){
    //     writeStream.write(JSON.stringify(response))
    // }
    // else{
    //     writeStream.write("," + JSON.stringify(response ));
    // }
    db.userDB.push(response);
    let newDB = JSON.stringify(db.userDB);
    fs.writeFile(userDbFile, newDB, function(err){
        if (err) throw err;
        console.log("complete");
    });
=======
   // Prepare output in JSON format  
   response = {  
       username:req.body.username,
       password:req.body.password,
       gender:req.body.gender  
   };  
   db.userDB.push(response);
   let newDB = JSON.stringify(db.userDB);
   fs.writeFile('./db/dbOfUsers.json', newDB, function(err){
       if (err) throw err;
       console.log("complete");
   });
>>>>>>> 25c479184a9fa378453dc2a8c87b330089e82433
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