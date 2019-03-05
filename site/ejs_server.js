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
    var t = {number : `${row.tIndex}`, name : `${row.trkNam}`, length: toMMSS(`${row.trkLen}`)};
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

async function getArtist(idTest) {
    try {
        var val;
        var getStmt = `SELECT ArtistName artNam FROM Artist WHERE ID="${idTest}"`;
        var row = await db.getAsync(getStmt);
        if (!row) {
            console.log("oh no");
            return;
        }
        else {
            val = row["artNam"];
            console.log(val);
        }
        return val;
    }
    catch (e) {
        console.log(e);
        return "error";
    }
}

function toMMSS(thetime) {
    var hours   = parseInt(thetime[0]) + parseInt(thetime[1]);
    var minutes = parseInt(thetime[3] + thetime[4]);
    var sum     = (hours*60) + minutes;
    var total   = String(sum) + ":" + (String(thetime[6]) + String(thetime[7]));
    console.log("hours: " + hours + ", minutes: " + minutes + ", sum: " + sum + ", total: " + total);
    return total;
}
                        
app.get('/Album', async function(req, res) {
    var label;
    try { label = await getLabel(lIDSTR); }
    catch (e) { label = "erro13r"; }

    var artist;
    try { artist = await getArtist(aIDSTR); }
    catch (e) { artist = "erro12133r"; }

    var str = "to_be_added";
    //var songs = [{ number: numberSTR, name: nameSTR, length: lengthSTR}];
    res.render('pages/album', { 
        release_name: relNamSTR,
        release_artist: artist,
        release_artwork: aaPathSTR,
        release_type: rel_types[relTypSTR], 
        release_date: relDatSTR, 
        release_length: toMMSS(relLenSTR),
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