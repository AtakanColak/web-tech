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
var db = new sql.Database("bruh.db");

let sqlQuery = `SELECT RelType relTyp, RelDate relDat, ReleaseLength relLen FROM Release`;

db.each(sqlQuery, (err, row) => {
    if (err) {
        throw err;
    }
    relTypSTR = `${row.relTyp}`;
    relDatSTR = `${row.relDat}`;
    relLenSTR = `${row.relLen}`;
    
});

app.get('/Album', function(req, res) {

    var str = "to_be_added";
    var songs = [{number: 2, name:"Troy Snipes the World", length: "1.56"}];
    res.render('pages/album', { 
        release_name: str,
        release_artist: str,
        release_artwork: str,
        release_type: relTypSTR, 
        release_date: relDatSTR, 
        release_length: relLenSTR,
        release_label : str,
        release_formats : str,
        release_genres : str, 
        release_rating : str,
        release_desc : str,
        tracks : songs
    });
});

app.listen(8080);
console.log('8080 is the magic port');