const express = require('express')
const app = express()

// Setting the template engine (ejs)
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('assets'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

server = app.listen(3000);