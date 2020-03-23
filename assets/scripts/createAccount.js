let express = require('express');  
let app = express();  
let bodyParser = require('body-parser');  
// Create application/x-www-form-urlencoded parser  

let urlencodedParser = bodyParser.urlencoded({ extended: false })  
app.use(express.static('public'));  
app.get('/scripts/Profile.ejs', function (req, res) {  
   res.sendFile( "/scripts" + "/" + "Profile.ejs" );  
})  
app.post('./createAccount', urlencodedParser, function (req, res) {  
   // Prepare output in JSON format  
   response = {  
       uname:req.body.uname,  
       pword:req.body.pword,
       gender:req.body.gender  
   };  
   console.log(response);  
   res.end(JSON.stringify(response));  
})  
let server = app.listen(8000, function () {  
  let host = server.address().address  
  let port = server.address().port  
  console.log("app listening at http://%s:%s", host, port)  
})  