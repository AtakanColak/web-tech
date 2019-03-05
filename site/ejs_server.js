// server.js
// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use( express.static( "public/" ) );
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
});

var tracks= [];

db.each(sqlTrackQuery, (err, row) => {
    if (err) {
        throw err;
    }
    var t = {number : `${row.tIndex}`, name : `${row.trkNam}`, length:`${row.trkLen}`};
    tracks.push(t);
});

var rel_types = ["Album","EP","Single","Compilation"];

function makeStringFromBin(theString) {
    var newString = "";
    for (i = 0; i < theString.length; i++) {
        if (theString.charAt(i) == 1) {
            if (i == 0) newString += "Vinyl, ";
            else if (i == 1) newString += "CD, ";
            else if (i == 2) newString += "Cassette, ";
            else if (i == 3) newString += "Digital, ";
        }
    }
    newString = newString.slice(0, (newString.length - 2));
    return newString;
}

var test = "hmm";
function getLabel(idTest) {
    let sqlLabelQuery = `SELECT LabelName lblNam FROM Label WHERE ID=` + idTest;
    console.log(sqlLabelQuery);
    console.log(idTest);
    
    db.each(sqlLabelQuery, (err, row) => {
        if (err) {
            throw err;
        }
        var test = `${row.lblNam}`;
        console.log(test + " abcdefg");
        //console.log(row);
        test = row;
    });
    console.log(test);
    return test;
}

db.getAsync = function (sql) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.get(sql, function (err, row) {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
};

async function getLabel(idTest) {
    try {
        var val;
        var getStmt = `SELECT LabelName lblNam FROM Label WHERE ID="${idTest}"`;
        var row = await db.getAsync(getStmt);
        if (!row) {
            console.log("oh no");
            return;
        }
        else {
            val = row["lblNam"];
            console.log(val);
        }
        return val;
    }
    catch (e) {
        console.log(e);
        return "error";
    }
}
                        
app.get('/Album', async function(req, res) {
    var label;
    try {
        label = await getLabel(lIDSTR);
    }
    catch (e) {
        label = "erro13r";
    }
    var str = "to_be_added";
    //var songs = [{ number: numberSTR, name: nameSTR, length: lengthSTR}];
    res.render('pages/album', { 
        release_name: relNamSTR,
        release_artist: aIDSTR,
        release_artwork: aaPathSTR,
        release_type: rel_types[relTypSTR], 
        release_date: relDatSTR, 
        release_length: relLenSTR,
        release_label : label,
        release_formats : makeStringFromBin(relForSTR),
        release_genres : gIDSTR, 
        release_rating : ratingSTR,
        release_desc : bioTxtSTR,
        tracks: tracks
    });
    formats = "";
});

app.get('/Discover', function (req, res) {
    res.render('pages/discover');
});

app.listen(8080);
console.log('8080 is the magic port');