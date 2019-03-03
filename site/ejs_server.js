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

let sqlReleaseQuery = `SELECT AlbumArtPath aaPath,
                       ReleaseName relNam,
                       ArtistID aID,
                       RelType relTyp, 
                       RelDate relDat,
                       ReleaseLength relLen,
                       LabelID lID,
                       RelFormat relFor,
                       Rating rating,
                       Bio bioTxt,
                       NumRatings ratNum,
                       GenreID gID FROM Release`;

let sqlTrackQuery = `SELECT TrackName trkNam,
                            TrackLength trkLen,
                            TrackPath trkPat,
                            ReleaseID rID,
                            TrackIndex tIndex FROM Track`;


db.each(sqlReleaseQuery, (err, row) => {
    if (err) {
        throw err;
    }
    aaPathSTR = `${row.aaPath}`;
    relNamSTR = `${row.relNam}`;
    aIDSTR    = `${row.aID}`;
    relTypSTR = `${row.relTyp}`;
    relDatSTR = `${row.relDat}`;
    relLenSTR = `${row.relLen}`;
    lIDSTR    = `${row.lID}`;
    relForSTR = `${row.relFor}`;
    ratingSTR = `${row.rating}`;
    bioTxtSTR = `${row.bioTxt}`;
    ratNumSTR = `${row.ratNum}`;
    gIDSTR    = `${row.gID}`;
    formatTest = `${row.relFor}`;    
});

var tracks= [];
var formatTest = "";

db.each(sqlTrackQuery, (err, row) => {
    if (err) {
        throw err;
    }
    var t = {number : `${row.tIndex}`, name : `${row.trkNam}`, length:`${row.trkLen}`};
    tracks.push(t);
});
var rel_types = ["Album","EP","Single","Compilation"];
var formats   = "";

                        
app.get('/Album', function(req, res) {

    for (i = 0; i < 4; i++) {
        if (formatTest.charAt(i) == 1) {
            if (i == 0)         formats += "Vinyl, ";
            else if (i == 1)    formats += "CD, ";
            else if (i == 2)    formats += "Cassette, ";
            else if (i == 3)    formats += "Digital, ";
        }
    }

    formats = formats.slice(0, (formats.length - 2));

    var str = "to_be_added";
    //var songs = [{ number: numberSTR, name: nameSTR, length: lengthSTR}];
    res.render('pages/album', { 
        release_name: relNamSTR,
        release_artist: aIDSTR,
        release_artwork: aaPathSTR,
        release_type: rel_types[relTypSTR], 
        release_date: relDatSTR, 
        release_length: relLenSTR,
        release_label : lIDSTR,
        release_formats : formats,
        release_genres : gIDSTR, 
        release_rating : ratingSTR,
        release_desc : bioTxtSTR,
        tracks: tracks
    });
    formats = "";
});

app.listen(8080);
console.log('8080 is the magic port');