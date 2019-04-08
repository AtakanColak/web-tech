// server.js
// load the things we need
var express = require('express');
var sqlite = require("sqlite");
const fs = require('fs');
var app;
var db;
var rel_types = ["Album", "EP", "Single", "Compilation"];
start();

async function start() {
    app = express();
    app.set('view engine', 'ejs');
    app.use(express.static("public/"));    
    db = await sqlite.open("bruh.db");
}

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
/*
db.get = function (sql) {
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
*/
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
                       GenreID gID FROM Release WHERE ID="${ idTest}"`;

        var row = await db.get(sqlReleaseQuery);
        if (!row) {
            console.log("oh no getrelease didnt work");
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
                            TrackIndex tIndex FROM Track WHERE ReleaseID="${ idTest}"`;

   //     var tracks = []; //= await db.get(sqlTrackQuery);

        var tracks = await db.all(sqlTrackQuery);
        /*
        db.each(sqlTrackQuery, (err, row) => {
            if (err) throw err;
            var t = { number: `${row.tIndex}`, name: `${row.trkNam}`, length: toMMSS(`${row.trkLen}`) };
            tracks.push(t);
        });
*/
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
                               RelFormat format FROM ShoppingItem WHERE ReleaseID="${ idTest}"`;

        var shoppingItems = await db.all(sqlShoppingQuery);

        // db.each(sqlShoppingQuery, (err, row) => {
        //     if (err) throw err;
        //     var s = { relID: `${row.rID}`, catalog: `${row.catNum}`, price: `${row.price}`, format: `${row.format}` };
        //     shoppingItems.push(s);
        // });

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
                             Date date FROM Review WHERE ReleaseID="${ idTest}"`;

        var comments = await db.all(sqlReviewQuery);

        // db.each(sqlReviewQuery, (err, row) => {
        //     if (err) throw err;
        //     var u = { release: `${row.rID}`, userid: `${row.uID}`, rating: `${row.rating}`, desc: `${row.comment}`, date: `${row.date}` };
        //     comments.push(u);
        // });

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
        var row = await db.get(getStmt);
        if (!row) {
            console.log("oh no getlabel didnt work");
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
        var row = await db.get(getStmt);
        if (!row) {
            console.log("oh no getartist didnt work because artistis was" + idTest);
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
        var row = await db.get(getStmt);
        if (!row) {
            console.log("oh no getuser didnt work");
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
        var row = await db.get(getStmt);
        if (!row) {
            console.log("oh no getrating didnt work");
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
    var hours = parseInt(thetime[0]) + parseInt(thetime[1]);
    var minutes = parseInt(thetime[3] + thetime[4]);
    var sum = (hours * 60) + minutes;
    var total = String(sum) + ":" + (String(thetime[6]) + String(thetime[7]));
    return total;
}

//var albumID = req.query.id

// async function getAlbums() {
//     try {
//         var sqlAlbumsQuery = `SELECT ID id, AlbumArtPath coverpath, ReleaseName name, ArtistID aID FROM Release`;
//         var albums = []; // await db.get(sqlAlbumsQuery);

//         db.each(sqlAlbumsQuery, (err, row) => {
//             if (err) throw err;
//             var t = { albumid: `${row.id}`, coverpath: `${row.coverpath}`, name: `${row.name}`, artist:`${row.aID}` };
//             albums.push(t);
//         });
//         console.log(albums);

//         return albums;
//     }
//     catch (e) {
//         console.log(e);
//         return "error";
//     }
// }

async function getAlbums() {
    try {
        

        var sqlAlbumsQuery = `SELECT ID id,
                             AlbumArtPath coverpath,
                             ReleaseName name,
                             ArtistID aID FROM Release`;
        
        var albums = await db.all(sqlAlbumsQuery);
        console.log(albums);
        return albums;
        /*
        db.each(sqlAlbumsQuery, (err, row) => {
            if (err) throw err;
            var u = { albumid: `${row.id}`, coverpath: `${row.coverpath}`, name: `${row.name}`, artist: `${row.aID}` };
            //albums.push(u);
            deleteFile();
            fs.writeFile('Output.txt', u.albumid + "," + u.coverpath + "," + u.name + "," + u.artist + ",", {flag:"a"}, (err) => { 
                if (err) throw err; 
                if (fs.existsSync("Output.txt")) console.log("BLABLABLABLABLABLABLA THE FILE WAS WRITTEN");
            }) 
            if (fs.existsSync("Output.txt")) console.log("here is a debug to say that the db thing happened in getalbums");
        });
        */
    }
    catch (e) {
        console.log(e);
        return "error";
    }

}

app.get('/Album', async function (req, res) {

    var albumID = req.query.id;
    console.log("here is the albumID " + albumID);

    var album;
    try { album = await getRelease(albumID); }
    catch (e) { res.render('pages/error'); }
    console.log("here is the album " + album);

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

    for (let i = 0; i < comments.length; i++) {
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
    console.log("here is the ratinglist " + ratingList);
    for (i = 0; i < ratingList.length; i++) total += ratingList[i];
    total = total / ratingList.length;

    res.render('pages/album', {
        release_name: album["relNam"],
        release_artist: artist,
        release_artwork: album["aaPath"],
        release_type: rel_types[album["relTyp"]],
        release_date: album["relDat"],
        release_length: toMMSS(album["relLen"]),
        release_label: label,
        release_formats: makeStringFromBin(album["relFor"], "format"),
        release_genres: makeStringFromBin(album["gID"], "genre"),
        release_rating: album["rating"],
        release_desc: album["bioTxt"],
        tracks: tracks,
        items: shoppingItems,
        comments: comments
    });

});

app.get('/Discover', async function (req, res) {

    getAlbums();
    
    var albums = [];

    var albums;
    try { albums = await getAlbums(); }
    catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD BE") }
    
    res.render('pages/discover', {
        releases: albums
    });
});

app.get('/EditRelease', function (req, res) {
    res.render('pages/edit_release');
});

app.get('/Error', function (req, res) {
    res.render('pages/error');
});

app.listen(8080);
console.log('8080 is the magic port');