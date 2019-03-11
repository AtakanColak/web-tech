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



// db.each(sqlReleaseQuery, (err, row) => {
//     if (err) {
//         throw err;
//     }
//     aaPathSTR = `${row.aaPath}`;
//     relNamSTR = `${row.relNam}`;
//     aIDSTR    = `${row.aID}`;
//     relTypSTR = `${row.relTyp}`;
//     relDatSTR = `${row.relDat}`;
//     relLenSTR = `${row.relLen}`;
//     lIDSTR    = `${row.lID}`;
//     relForSTR = `${row.relFor}`;
//     ratingSTR = `${row.rating}`;
//     bioTxtSTR = `${row.bioTxt}`;
//     ratNumSTR = `${row.ratNum}`;
//     gIDSTR    = `${row.gID}`;   
// });

var rel_types = ["Album","EP","Single","Compilation"];

function makeStringFromBin(theString, thetype) {
    var newString = "";
    if (thetype == "format") {
        for (i = 0; i < theString.length; i++) {
            if (theString.charAt(i) == 1) {
                if (i == 0) newString += "Vinyl, ";
                else if (i == 1) newString += "CD, ";
                else if (i == 2) newString += "Cassette, ";
                else if (i == 3) newString += "Digital, ";
            }
        }
    }
    else if (thetype == "genre") {
        for (i = 0; i < theString.length; i++) {
            if (theString.charAt(i) == 1) {
                if (i == 0) newString += "Dance, ";
                else if (i == 1) newString += "Electronic, ";
                else if (i == 2) newString += "Experimental, ";
                else if (i == 3) newString += "Folk, ";
                else if (i == 4) newString += "Hip Hop, ";
                else if (i == 5) newString += "Jazz, ";
                else if (i == 6) newString += "Pop, ";
                else if (i == 7) newString += "Punk, ";
                else if (i == 8) newString += "Rock, ";
                else if (i == 9) newString += "Metal, ";
            }
        }
    }

    else return "invalid string";
    
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

async function getRelease(idTest) {
    try {

        var sqlReleaseQuery = `SELECT AlbumArtPath aaPath,
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
                       GenreID gID FROM Release WHERE ID="${ idTest }"`;

        var row = await db.getAsync(sqlReleaseQuery);
        if (!row) {
            console.log("oh no");
            return;
        }
        else {
            // val = row["aaPath", "relNam", "aID", "relTyp", "relDat", ];
            console.log(row);
        }
        return row;
    }
    catch (e) {
        console.log(e);
        return "error";
    }
}

async function getTracks(idTest) {
    try {

        var sqlTrackQuery = `SELECT TrackName trkNam,
                            TrackLength trkLen,
                            TrackPath trkPat,
                            ReleaseID rID,
                            TrackIndex tIndex FROM Track WHERE ID="${ idTest }"`;

        var tracks = []; //= await db.getAsync(sqlTrackQuery);

        db.each(sqlTrackQuery, (err, row) => {
            if (err) throw err;
            var t = { number: `${row.tIndex}`, name: `${row.trkNam}`, length: toMMSS(`${row.trkLen}`) };
            tracks.push(t);
        });

        // if (!row) {
        //     console.log("oh no");
        //     return;
        // }
        // else {
        //     // val = row["aaPath", "relNam", "aID", "relTyp", "relDat", ];
        //     console.log(row);
        // }
        return tracks;
    }
    catch (e) {
        console.log(e);
        return "error";
    }
}

async function getShoppingItems(idTest) {
    try {

        var sqlShoppingQuery = `SELECT ReleaseID rID,
                               CatalogNum catNum,
                               Price price,
                               RelFormat format FROM ShoppingItem WHERE ID="${ idTest }"`;

        var shoppingItems = [];

        db.each(sqlShoppingQuery, (err, row) => {
            if (err) throw err;
            var s = { relID: `${row.rID}`, catalog: `${row.catNum}`, price: `${row.price}`, format: `${row.format}` };
            shoppingItems.push(s);
        });

        return shoppingItems;
    }
    catch (e) {
        console.log(e);
        return "error";
    }
}

async function getComments(idTest) {
    try {

        var sqlReviewQuery = `SELECT ReleaseID rID,
                             UserID uID,
                             Rating rating,
                             Comment comment,
                             Date date FROM Review WHERE ID="${ idTest }"`;

        var comments = [];

        db.each(sqlReviewQuery, (err, row) => {
            if (err) throw err;
            var u = { release: `${row.rID}`, userid: `${row.uID}`, rating: `${row.rating}`, desc: `${row.comment}`, date: `${row.date}` };
            comments.push(u);
        });

        return comments;
    }
    catch (e) {
        console.log(e);
        return "error";
    }
}

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
        else { val = row["artNam"]; }
        return val;
    }
    catch (e) {
        console.log(e);
        return "error";
    }
}

async function getUser(idTest) {
    try {
        var val;
        var getStmt = `SELECT UserName usrNam FROM User WHERE ID="${idTest}"`;
        var row = await db.getAsync(getStmt);
        if (!row) {
            console.log("oh no");
            return;
        }
        else { val = row["usrNam"]; }
        return val;
    }
    catch (e) {
        console.log(e);
        return "error";
    }
}

async function getRating(idTest) {
    try {
        var val;
        var getStmt = `SELECT Rating rating FROM Review WHERE ID="${idTest}"`;
        var row = await db.getAsync(getStmt);
        if (!row) {
            console.log("oh no");
            return;
        }
        else { val = row["rating"]; }
        console.log(val);
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
    //console.log("hours: " + hours + ", minutes: " + minutes + ", sum: " + sum + ", total: " + total);
    return total;
}

//var albumID = req.query.id

app.get('/Album', async function(req, res) {
    
    var albumID = req.query.id;
    console.log(albumID);


    var album;
    try { album = await getRelease(albumID); }
    catch (e) { res.render('pages/error'); }

    var tracks = [];
    try { tracks = await getTracks(albumID); }
    catch (e) { console.log("track error"); }

    var shoppingItems = [];
    try { shoppingItems = await getShoppingItems(albumID); }
    catch (e) { console.log("shopitem error"); }

    var comments = [];
    try { comments = await getComments(albumID); }
    catch (e) { console.log("comments error"); }

    var label;
    try { label = await getLabel(album["lID"]); }
    catch (e) { label = "erro13r"; }

    var artist;
    try { artist = await getArtist(album["aID"]); }
    catch (e) { artist = "erro12133r"; }

    // var rating;
    // try { rating = await getRatingScore(comments); }
    // catch (e) { rating = "erro1213req3r"; }

    for (let i=0; i<comments.length; i++){
        //var user;
        try { comments[i].username = await getUser(comments[i].userid); }
        catch (e) { comments[i].username = "oijadsoijdsaerro12133r"; }

    }

    var ratingList = [];
    for (let i = 0; i < comments.length; i++) {
        try { rating = await getRating(comments[i].userid); }
        catch (e) { rating = "oijadsoijdasdasdasdadsro12133r"; }
        ratingList.push(rating);
    }
    var total = 0;
    console.log(ratingList);
    for (i = 0; i < ratingList.length; i++){
        total += ratingList[i];
    }
    total = total/ratingList.length;



    var str = "to_be_added";
    //var songs = [{ number: numberSTR, name: nameSTR, length: lengthSTR}];
    res.render('pages/album', { 
        release_name: album["relNam"],
        release_artist: artist,
        release_artwork: album["aaPath"],
        release_type: rel_types[album["relTyp"]], 
        release_date: album["relDat"], 
        release_length: toMMSS(album["relLen"]),
        release_label : label,
        release_formats : makeStringFromBin(album["relFor"], "format"),
        release_genres : makeStringFromBin(album["gID"], "genre"),
        release_rating: album["rating"],
        release_desc: album["bioTxt"],
        tracks: tracks,
        items : shoppingItems,
        comments : comments
    });
    formats = "";
});

app.get('/Discover', function (req, res) {
    res.render('pages/discover');
});

app.get('/Error', function (req, res) {
    res.render('pages/error');
});

app.listen(8080);
console.log('8080 is the magic port');