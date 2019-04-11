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

function toMMSS(thetime) {
    var hours = parseInt(thetime[0]) + parseInt(thetime[1]);
    var minutes = parseInt(thetime[3] + thetime[4]);
    var sum = (hours * 60) + minutes;
    var total = String(sum) + ":" + (String(thetime[6]) + String(thetime[7]));
    return total;
}

function returnFormats() {
    return ["Vinyl", "CD", "Cassette", "Digital"];
}

function returnGenres() {
    return ["Dance", "Electronic", "Experimental", "Folk", "Hip Hop", "Jazz", "Pop", "Punk", "Rock", "Metal"];
}

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
            console.log("HERE IS GETRELEASE " + row);
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
        var tracks = await db.all(sqlTrackQuery);
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

        for(i = 0; i < comments.length; i++) {
            comments[i]["uID"] = await getUser(comments[i]["uID"]);
        }
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
        else { val = row["artNam"]; console.log("HERE IS GETARTIST " + val) }
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

async function getAlbums() {
    try {
        var sqlAlbumsQuery = `SELECT ID id,
                            AlbumArtPath coverpath,
                            ReleaseName name,
                            ArtistID aID,
                            GenreID gID,
                            RelType relTyp, 
                            RelDate relDat,
                            ReleaseLength relLen,
                            LabelID lID,
                            RelFormat relFor,
                            Rating rating,
                            Bio bioTxt,
                            NumRatings ratNum FROM Release`            
        var albums = await db.all(sqlAlbumsQuery);
        //console.log(albums);
        return albums;
        }        
    catch (e) {
        console.log(e);
        return "error";
    }
}

async function findBinary(id, thetype, albums) {
    var albumsToReturn = [];
    console.log("HERE IS THE ID THAT IS PASSED " + id);
    for (i = 0; i < albums.length; i++) {
        if (albums[i][(""+thetype)].charAt(id) == 1) albumsToReturn.push(albums[i]);
    }   
    return albumsToReturn;
}

async function findDate(date, albums) {
    var albumsToReturn = [];
    for (i = 0; i < albums.length; i++) {
        try {
            console.log(albums[i]["relDat"].toString().substring(0,3));
            console.log(date.substring(0,3));
        }
        catch (e) {console.log("now you really fucked up "); throw e}
        if (albums[i]["relDat"].toString().substring(0,3) == date.substring(0,3)) albumsToReturn.push(albums[i]);
    }   
    console.log("HERE ARE THE ALBUSM TO RETURN IN THE FIND DATE FUNCTION " + albumsToReturn);
    return albumsToReturn;
}

function makeRegex(id, len) {
    var regex = "";
    for (i = 0; i < len; i++) {
        if (i != id) regex += "[0-1]";
        else regex += "1";
    }
    return regex;
}

function sortID2String(id) {
    var sort_strings = ["Hottest", "Most Popular", "Title, A-Z", "Title, Z-A"];
    if(id == null)  
        return sort_strings[0];
    else 
        return sort_strings[id - 1];
}

function genreID2String(id) {
    var genre_strings = ["Dance", "Electronic","Experimental", "Folk", "Hip Hop", "Jazz", "Pop", "Punk", "Rock","Metal"];
    if (id == null) return "";
    else return genre_strings[id];
}

function formatID2String(id) {
    var format_strings = ["Vinyl", "CD", "Cassette", "Digital"];
    if (id == null) return "";
    else return format_strings[id];
}

function browsing_string(genreID, formatID, decade) {
    var str = genreID2String(genreID);
    if(genreID != null && (formatID != null || decade !=null) ) str += ", ";
    str += formatID2String(formatID);
    if(formatID != null && decade !=null ) str += ", ";
    if(decade !=null ) str += decade;
    return str;
}

async function getArtists() {
    try {
        var sqlTrackQuery = `SELECT ID id, ArtistName name FROM Artist`;
        var artists = await db.all(sqlTrackQuery);
        return artists;
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
    try { tracks = await getTracks(albumID); console.log("HERE ARE THE TRACKS FROM THE ALBUM PAGE LOADER " + tracks)}
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

    //var where_string;
    var collectedAlbums;
    try { collectedAlbums = await getAlbums(); }
    catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD BROPOCALYPSE NOW " + e) }  
    var albumsToReturnTest = collectedAlbums;
    //console.log("WHEREBEFOREITALL " + where_string);
    var sortSTR = req.query.sort;
    var genreID = req.query.genre;
    var formatID = req.query.format;
    var searchSTR = req.query.search;
    var decadeSTR = req.query.decade;
    var discover_wo_format = "/Discover?";
    var discover_wo_search = "/Discover?";
    var discover_wo_decade = "/Discover?";
    var discover_wo_genre  = "/Discover?";
    var discover_wo_sort   = "/Discover?";
    if(decadeSTR != null)  {
        discover_wo_format += "&decade=" + decadeSTR;
        discover_wo_search += "&decade=" + decadeSTR;
        discover_wo_genre  += "&decade=" + decadeSTR;
        discover_wo_sort   += "&decade=" + decadeSTR;
        //where_string        = "relDat LIKE '" + decadeSTR.substring(0,3) + "%'";
        try { albumsToReturnTest = await findDate(decadeSTR, albumsToReturnTest); }
        catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD BERNSTEIN " + e) }
        console.log("111111111111111111111!"+ albumsToReturnTest);
    }
    if(genreID != null)  {
        discover_wo_format += "&genre=" + genreID;
        discover_wo_search += "&genre=" + genreID;
        discover_wo_decade += "&genre=" + genreID;
        discover_wo_sort   += "&genre=" + genreID;
        try { albumsToReturnTest = await findBinary(genreID, "gID", albumsToReturnTest); }
        catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD BERNSTEIN " + e) }
        console.log("11122222222222111111111!"+ albumsToReturnTest);
    }
    if(formatID != null)  {
        discover_wo_search += "&format=" + formatID;
        discover_wo_decade += "&format=" + formatID;
        discover_wo_genre  += "&format=" + formatID;
        discover_wo_sort   += "&format=" + formatID;
        try { albumsToReturnTest = await findBinary(formatID, "relFor", albumsToReturnTest); }
        catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD BRAHMS " + e) } 
        console.log("11111111111111111133333333333111!"+ albumsToReturnTest);
    }
    if(searchSTR != null)  {
        discover_wo_format += "&search=" + searchSTR;
        discover_wo_decade += "&search=" + searchSTR;
        discover_wo_genre  += "&search=" + searchSTR;
        discover_wo_sort   += "&search=" + searchSTR;
        //where_string       = ""; //set to blank for now, implement later
    }
    if(sortSTR != null)  {
        discover_wo_format += "&sort=" + sortSTR;
        discover_wo_search += "&sort=" + sortSTR;
        discover_wo_decade += "&sort=" + sortSTR;
        discover_wo_genre  += "&sort=" + sortSTR;
        //where_string       = ""; //set to blank for now, implement later
    }

    // if(genreID == null && formatID == null) {
    //     var albums;
    //     try { albums = await getAlbums(); }
    //     catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD SCHOENBERG") }     
    // }
    // else if (genreID != null && formatID == null) {
    //     var albums;
    //     var albumsToReturn;
    //     try { albums = await getAlbums(); }
    //     catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD BACH " + e) }  
    //     try { albumsToReturn = await findBinary(genreID, "gID", albums); }
    //     catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD BACH " + e) }  
    // }
    // else if (genreID == null && formatID != null) {
    //     var albums;
    //     var albumsToReturn;
    //     try { albums = await getAlbums(); }
    //     catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD BRAHMS " + e) }  
    //     try { albumsToReturn = await findBinary(formatID, "relFor", albums); }
    //     catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD BRAHMS " + e) }  
    // }
    // else if (genreID != null && formatID != null) {
    //     var albums;
    //     var albumsToReturn;
    //     try { albums = await getAlbums(); }
    //     catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD BRAHMS " + e) }  
    //     try { albumsToReturn = await findBinary(genreID, "gID", albums); }
    //     catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD BRAHMS " + e) }  
    //     try { albumsToReturn = await findBinary(formatID, "relFor", albumsToReturn); }
    //     catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD BRAHMS " + e) } 
    // }

    res.render('pages/discover', {
        releases: albumsToReturnTest,
        genres: returnGenres(),
        formats: returnFormats(),
        discover_wo_format: discover_wo_format,
        discover_wo_search: discover_wo_search,
        discover_wo_decade: discover_wo_decade,
        discover_wo_genre : discover_wo_genre,
        discover_wo_sort  : discover_wo_sort,
        browsing_str: browsing_string(genreID, formatID, decadeSTR),
        selected_sort : sortID2String(sortSTR)
    });
});

app.get('/EditRelease', async function (req, res) {
    var artists;
    try { 
        artists = await getArtists();
        console.log("HERE ARE THE ARTISTS " + artists);
    }
    catch (e) { console.log("ALL THESE BITCHES ON MY DICK LIKE THEY SHOULD BE") }
    res.render('pages/edit_release');
});

app.get('/Error', function (req, res) {
    res.render('pages/error');
});

app.get('/Login', function (req, res) {
    res.render('pages/login');
});


app.listen(8080);
console.log('8080 is the magic port');