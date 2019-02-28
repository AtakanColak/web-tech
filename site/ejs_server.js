// server.js
// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use( express.static( "public" ) );
// use res.render to load up an ejs view file

// index page 

var sql = require("sqlite3");
var db = new sql.Database("/home/anton/Documents/ataweb/web-tech/site/public/bruh.db");

let sqlQuery = `SELECT RelType relTyp, RelDate relDat, ReleaseLength relLen FROM Release`;

db.each(sqlQuery, (err, row) => {
    if (err) {
        throw err;
    }
    relTypSTR = `${row.relTyp}`;
    relDatSTR = `${row.relDat}`;
    relLenSTR = `${row.relLen}`;
    
});

app.get('/', function(req, res) {

    var str = "test";
    res.render('pages/index', { release_type: relTypSTR, release_date: relDatSTR, release_length: relLenSTR});
});

app.listen(8080);
console.log('8080 is the magic port');