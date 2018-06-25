// Include additional functions
require('./extra.js');

// Include express
var express = require('express');

// Include class with DB operations
var DB = require('./db.js');

// Create new Instance
API = new DB();

var app = express();
app.use(express.json());
app.use(express.urlencoded());

// ----------------------------------------------------------------------------------------------

// Default HTTP handler
app.get('/*', function (req, res) 
{
    // http://localhost:3000/?msg=my_message

    var date = req.query.date || Date.now();
    var msg = req.query.msg;

    if ( msg ) API.AddMsg( date, msg );

    
    // Send simple response
    res.json(
    {
        result: true,
        msg: null,
        options: {},
    });
});

// Start Web server
app.listen(3000, function () 
{
    log('Server listening on port 3000!');
});
