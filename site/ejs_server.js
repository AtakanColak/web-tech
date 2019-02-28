// server.js
// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

var sql = require("sqlite3");
var db = new sql.Database("/home/anton/Documents/ataweb/web-tech/site/public/bruh.db");

let sqlQuery = `SELECT ReleaseName relNam FROM Release`;

var testVar = 'populate me';

db.each(sqlQuery, (err, row) => {
    if (err) {
        throw err;
    }
    testVar = `${row.relNam}`;
    console.log(testVar);
});

// // about page 
// app.get('/about', function(req, res) {
//     res.render('pages/about');
// });

app.listen(8080);
console.log('8080 is the magic port');