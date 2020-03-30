const routes = require('./routes.js');
const utility = require('./utility');
const initialize = require('./initialize');
const express = require('express');
const app = express();
let port;

// Setting the template engine (ejs)
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('assets'));

// Routes
app.use('/', routes);

// Used to start the server and print 
const startServer = () => {
    try {
        // Heroku support.
        port = process.env.PORT;
        if (port == null || port == "") port = 8000;
        server = app.listen(port);
    } finally { utility.serverRunningMsg(port) }
}

initialize.initialize(startServer).then(db => {
    // Code to check current memory usage.
    const used = process.memoryUsage();
    for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
});
