// server.js
// load the things we need
var express = require('express');
var sqlite = require("sqlite");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var multer = require('multer');

var app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.static("public/"));


const fs = require('fs');
var options = {
    key: fs.readFileSync("public/server.key"),
    cert: fs.readFileSync("public/server.cert")
};

var https = require("https").createServer(options, app);
var http = require("http").createServer(app);
var io = require("socket.io")(https);
var scrpyt = require("scrypt");

var db;// = await sqlite.open("bruh.db");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({storage:storage});

start();
// console.log("IS THIS EXECUTED EVERYTIME?");



function hashPassword(password) {
    var hash = scrpyt.kdfSync(password, scrpyt.paramsSync(0.1));
    return hash.toString('base64');
}

function checkPassword(password, hash) {
    let buff = Buffer.from(hash, 'base64');
    return scrpyt.verifyKdfSync(buff, password);
}

function getIP(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
}

async function start() {



    // var password = "password12345";
    // var hashed = hashPassword(password);
    // var truecheck = checkPassword(password, hashed);
    // var falsecheck = checkPassword("hello12", hashed);
    // if(truecheck == true && falsecheck == false) {
    //     console.log(hashed + " \n");
    // }


    // app = express();
    // app.set('view engine', 'ejs');
    // app.use(express.static("public/"));    
    db = await sqlite.open("bruh.db");
    // http = require("http").createServer(app);
    // https = require("https").createServer(options, app);
    // io = require("socket.io")(http);

    
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

function toUnix(thetime) {
    var hours = parseInt(thetime[0]) + parseInt(thetime[1]);
    var minutes = parseInt(thetime[4] + thetime[5]);
    var seconds = parseInt(thetime[7] + thetime[8]);
    return seconds + minutes*60 + hours*3600;
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
        return row;
    }
    catch (e) {
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

        for (i = 0; i < comments.length; i++) {
            comments[i]["uID"] = await getUser(comments[i]["uID"]);
        }
        return comments;
    }
    catch (e) {
        return "error";
    }
}

async function getLabel(idTest) {
    try {
        var val;
        var getStmt = `SELECT LabelName lblNam FROM Label WHERE ID="${idTest}"`;
        var row = await db.get(getStmt);
        val = row["lblNam"];
        return val;
    }
    catch (e) {
        return "error";
    }
}

async function getArtist(idTest) {
    try {
        var val;
        var getStmt = `SELECT ArtistName artNam FROM Artist WHERE ID="${idTest}"`;
        var row = await db.get(getStmt);
        val = row["artNam"];
        return val;
    }
    catch (e) {
        return "error";
    }
}

async function getUser(idTest) {
    try {
        var val;
        var getStmt = `SELECT UserName usrNam FROM User WHERE ID="${idTest}"`;
        var row = await db.get(getStmt);
        val = row["usrNam"];
        return val;
    }
    catch (e) {
        return "error";
    }
}

async function getRating(idTest) {
    try {
        var ratingQuery = `SELECT Rating rating FROM Review WHERE ReleaseID="${idTest}"`;
        var ratings = await db.all(ratingQuery);
        return ratings;
    }
    catch (e) {
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
        return albums;
    }
    catch (e) {
        console.log(e);
        return "error";
    }
}

async function findBinary(id, thetype, albums) {
    var albumsToReturn = [];
    for (i = 0; i < albums.length; i++) {
        if (albums[i][("" + thetype)].charAt(id) == 1) albumsToReturn.push(albums[i]);
    }
    return albumsToReturn;
}

async function findDate(date, albums) {
    var albumsToReturn = [];
    for (i = 0; i < albums.length; i++) {
        if (albums[i]["relDat"].toString().substring(0, 3) == date.substring(0, 3)) albumsToReturn.push(albums[i]);
    }
    return albumsToReturn;
}

async function findSearch(searchSTR, albums) {
    var albumsToReturn = [];
    for (i = 0; i < albums.length; i++) {
        if (albums[i]["name"].toString().toLowerCase().includes(searchSTR)) albumsToReturn.push(albums[i]);
    }
    return albumsToReturn;
}

function sortID2String(id) {
    var sort_strings = ["Hottest", "Most Popular", "Title, A-Z", "Title, Z-A"];
    if (id == null)
        return sort_strings[0];
    else
        return sort_strings[id - 1];
}

function genreID2String(id) {
    var genre_strings = ["Dance", "Electronic", "Experimental", "Folk", "Hip Hop", "Jazz", "Pop", "Punk", "Rock", "Metal"];
    if (id == null) return "";
    else return genre_strings[id];
}

function formatID2String(id) {
    var format_strings = ["Vinyl", "CD", "Cassette", "Digital"];
    if (id == null) return "";
    else return format_strings[id];
}

function browsing_string(genreID, formatID, decade, search) {
    var str = genreID2String(genreID);
    if (genreID != null && (formatID != null || decade != null)) str += ", ";
    str += formatID2String(formatID);
    if (formatID != null && decade != null) str += ", ";
    if (decade != null) str += decade;
    if ((genreID != null || formatID != null || decade != null) && search != null) str += ", ";
    if (search != null) str += "Searching for '" + search + "'";
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

function compareHot(a, b) {
    // Use toUpperCase() to ignore character casing
    const dateA = a["relDat"];
    const dateB = b["relDat"];

    let comparison = 0;
    if (dateA > dateB) {
        comparison = 1;
    } else if (dateA < dateB) {
        comparison = -1;
    }
    return comparison * -1;
}

function comparePop(a, b) {
    // Use toUpperCase() to ignore character casing
    const ratingA = a["rating"];
    const ratingB = b["rating"];

    let comparison = 0;
    if (ratingA > ratingB) {
        comparison = 1;
    } else if (ratingA < ratingB) {
        comparison = -1;
    }
    return comparison * -1;
}

function compareAsc(a, b) {
    // Use toUpperCase() to ignore character casing
    const genreA = a["name"].toString().toUpperCase();
    const genreB = b["name"].toString().toUpperCase();

    let comparison = 0;
    if (genreA > genreB) {
        comparison = 1;
    } else if (genreA < genreB) {
        comparison = -1;
    }
    return comparison;
}

function compareDes(a, b) {
    // Use toUpperCase() to ignore character casing
    const genreA = a["name"].toString().toUpperCase();
    const genreB = b["name"].toString().toUpperCase();

    let comparison = 0;
    if (genreA > genreB) {
        comparison = 1;
    } else if (genreA < genreB) {
        comparison = -1;
    }
    return comparison * -1;
}

function sortAlbums(sortType, albums) {
    switch (sortType) {
        case 0:
            return albums.sort(compareHot);
        case 1:
            return albums.sort(comparePop);
        case 2:
            return albums.sort(compareAsc);
        case 3:
            return albums.sort(compareDes);
    }
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var rel_types = ["Album", "EP", "Single", "Compilation", "Other"];

app.get('/Album', async function (req, res) {

    var albumID = req.query.id;

    var album;
    try { album = await getRelease(albumID); }
    catch (e) { res.render('pages/error'); }

    var tracks = [];
    try { tracks = await getTracks(albumID) }
    catch (e) { console.log("track error"); }

    var shoppingItems = [];
    try { shoppingItems = await getShoppingItems(albumID); }
    catch (e) { console.log("shopitem error"); }

    var comments = [];
    try { comments = await getComments(albumID); }
    catch (e) { console.log("comments error"); }

    var label;
    try { label = await getLabel(album["lID"]); }
    catch (e) { label = "error"; }

    var artist;
    try { artist = await getArtist(album["aID"]); }
    catch (e) { artist = "error"; }

    for (let i = 0; i < comments.length; i++) {
        try { comments[i].username = await getUser(comments[i].userid); }
        catch (e) { comments[i].username = "error"; }
    }
    
    var ratings = [];
    var total = 0;
    try { ratings = await getRating(albumID); }
    catch (e) { console.log(e + "rating error"); }
    console.log(ratings);
    if (ratings.length != 0) {
        for (i = 0; i < ratings.length; i++) {
            total += ratings[i]["rating"];
            console.log(total);
        }
        total = total/ratings.length;
    }
    else total = 0;

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
        release_rating: total,
        release_desc: album["bioTxt"],
        tracks: tracks,
        items: shoppingItems,
        comments: comments
    });

});

var discoverGet = async function (req, res) {
    var collectedAlbums;
    try { collectedAlbums = await getAlbums(); }
    catch (e) { console.log(e) }
    var albumsToReturnTest = collectedAlbums;
    var sortSTR = req.query.sort;
    var genreID = req.query.genre;
    var formatID = req.query.format;
    var searchSTR = req.query.search;
    var decadeSTR = req.query.decade;
    var discover_wo_format = "/Discover?";
    var discover_wo_search = "/Discover?";
    var discover_wo_decade = "/Discover?";
    var discover_wo_genre = "/Discover?";
    var discover_wo_sort = "/Discover?";
    if (decadeSTR != null) {
        discover_wo_format += "&decade=" + decadeSTR;
        discover_wo_search += "&decade=" + decadeSTR;
        discover_wo_genre += "&decade=" + decadeSTR;
        discover_wo_sort += "&decade=" + decadeSTR;
        try { albumsToReturnTest = await findDate(decadeSTR, albumsToReturnTest); }
        catch (e) { console.log(e) }
    }
    if (genreID != null) {
        discover_wo_format += "&genre=" + genreID;
        discover_wo_search += "&genre=" + genreID;
        discover_wo_decade += "&genre=" + genreID;
        discover_wo_sort += "&genre=" + genreID;
        try { albumsToReturnTest = await findBinary(genreID, "gID", albumsToReturnTest); }
        catch (e) { console.log(e) }
    }
    if (formatID != null) {
        discover_wo_search += "&format=" + formatID;
        discover_wo_decade += "&format=" + formatID;
        discover_wo_genre += "&format=" + formatID;
        discover_wo_sort += "&format=" + formatID;
        try { albumsToReturnTest = await findBinary(formatID, "relFor", albumsToReturnTest); }
        catch (e) { console.log(e) }
    }
    if (searchSTR != null) {
        discover_wo_format += "&search=" + searchSTR;
        discover_wo_decade += "&search=" + searchSTR;
        discover_wo_genre += "&search=" + searchSTR;
        discover_wo_sort += "&search=" + searchSTR;
        try { albumsToReturnTest = await findSearch(searchSTR, albumsToReturnTest); }
        catch (e) { console.log(e) }
    }
    if (sortSTR != null) {
        discover_wo_format += "&sort=" + sortSTR;
        discover_wo_search += "&sort=" + sortSTR;
        discover_wo_decade += "&sort=" + sortSTR;
        discover_wo_genre += "&sort=" + sortSTR;
        albumsToReturnTest = sortAlbums(sortSTR-1, albumsToReturnTest);
    }


    res.render('pages/discover', {
        releases: albumsToReturnTest,
        genres: returnGenres(),
        formats: returnFormats(),
        discover_wo_format: discover_wo_format,
        discover_wo_search: discover_wo_search,
        discover_wo_decade: discover_wo_decade,
        discover_wo_genre: discover_wo_genre,
        discover_wo_sort: discover_wo_sort,
        browsing_str: browsing_string(genreID, formatID, decadeSTR, searchSTR),
        selected_sort: sortID2String(sortSTR)
    });
};

app.get('/Discover', discoverGet);

app.get("/DeleteAlbum", async function (req, res) {
    var albumID = req.query.id;
    var sqlAlbumsQuery = `DELETE FROM Release WHERE ID = "${albumID}"`;
    await db.all(sqlAlbumsQuery);
    res.redirect("/Discover");
});

app.get('/EditRelease', async function (req, res) {
    var isadmin = (req.cookies["user"] == "admin");
    if (!isadmin) {
        res.redirect("/Error");
    }
    var artists;
    var albums;
    try {
        artists = await getArtists();
        albums = await getAlbums();
    }
    catch (e) { console.log(e) }
    res.render('pages/edit_release', {releases : albums});
});

app.get('/Error', function (req, res) {
    res.render('pages/error');
});

app.get('/Login', function (req, res) {
    var u = req.cookies["user"]
    if(u == "false") {
    res.render('pages/login', {
        loginmsg: ""
    });}
    else {
        res.redirect("/");
    }
});

app.post('/Login', async function (req, res) {
    try {
        var loginmsg = "";
        var username = req.cookies["username"];
        var password = req.cookies["password"];
            try {
                var userQuery = `SELECT UserName username, Password password, IsAdmin isadmin, ID uid FROM User WHERE UserName="${username}"`;
                var users = await db.all(userQuery);
                if (users.length == 0) {
                    console.log(users.length);
                    loginmsg = "That username does not exist.";
                    res.render('pages/login', {
                        loginmsg: loginmsg
                    });
                }
                else {
                    if (!checkPassword(password, users[0]["password"])) { 
                        loginmsg = "Invalid password.";
                        res.render('pages/login', {
                            loginmsg: loginmsg
                        });
                    }
                    else {
                        if (users[0]["isadmin"] == 1) { res.cookie("user", "admin"); }
                        else { res.cookie("user", "member"); }
                        res.cookie("userID", users[0]["uid"]);
                        res.redirect('/Discover');
                    }
                }
            }
            catch (e) { console.log(e) }
        res.render('pages/login', {
            loginmsg: loginmsg
        });
    }
    catch (e) {
        console.log("Post login data failed\n");
    }
});

app.get('/Register', function (req, res) {
    res.render('pages/register', {
        regmsg: ""
    });
});

app.get('/', function (req, res) {
    res.render('pages/home');
});

app.get('/Lorem', function (req, res) {
    res.render('pages/lorem');
});

app.get('/Logout', function (req, res) {
    res.cookie("userID", "-1");
    res.cookie("user", "false");
    res.redirect('/Login');
});

async function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '.' + mm + '.' + yyyy;
    return today;
}

app.post("/Album", async function (req, res) {
    var user_logged_in_cookie = req.cookies["userID"];
    try {
        var review = req.cookies["comment"];
        var rating = req.cookies["commentscore"];
        try {
            var query = "INSERT INTO Review VALUES(NULL, " + req.query.id + ", " + user_logged_in_cookie + ", " + rating + ", '" + review + "', '" + await getDate() + "')";
            await db.run(query);
        }
        catch (e) {}
    }
    catch (e) {}
    res.redirect("/Album?id=" + req.query.id);
});

app.post('/Register', async function (req, res) {
    try {
        var regmsg = "";
        var username = req.cookies["username"];
        var email = req.cookies["email"];
        var password = req.cookies["password"];
        if (username.length < 4 || password.length < 4) { 
            regmsg = "Username and Password must be longer than 3 characters.";
            res.render('pages/register', {
                regmsg: regmsg
            });
        }
        else {
            try {
                var usernameQuery = `SELECT UserName username FROM User WHERE UserName="${username}"`;
                var usernames = await db.all(usernameQuery);
                if (usernames.length != 0) {
                    regmsg = "" + usernames[0]["username"] + " user already exists in the database.";
                    res.render('pages/register', {
                        regmsg: regmsg
                    });
                }
                else {
                    var emailQuery = `SELECT Email email FROM User WHERE Email="${email}"`;
                    var emails = await db.all(emailQuery);
                    if (emails.length != 0) { 
                        regmsg = "" + emails[0]["email"] + " email already exists in the database.";
                        res.render('pages/register', {
                            regmsg: regmsg
                        });
                    }
                    else {
                        if (!validateEmail(email)) {
                            regmsg = "Please enter a valid email address.";
                            res.render('pages/register', {
                                regmsg: regmsg
                            });
                        }
                        else {
                            await db.run("INSERT INTO User VALUES(NULL, '" + username + "', '" + hashPassword(password) + "', '" + email + "', 0)");
                            console.log("Post register data successful\n");
                        }
                    }
                }
            }
            catch (e) { console.log(e) }
        }
        res.render('pages/login', {
            loginmsg: "Account created! You can now login here."
        });
    }
    catch (e) {
        console.log("Post register data failed\n");
        res.render('pages/register');
    }
});

app.get("/AddSong", async function (req, res) {
    res.render("pages/add_song");
});

app.post("/AddRelease", async function (req, res) {
    try {
        var releaseName = req.cookies["releasename"];
        var artistID    = req.cookies["artistname"];
        var coverPath   = req.cookies["coverpath"];
        var releaseType = req.cookies["releasetype"];
        var releaseDate = req.cookies["releasedate"];
        var releaseLen  = req.cookies["releaselength"];
        var labelID     = req.cookies["labelname"];
        var formats     = req.cookies["formats"];
        var genres      = req.cookies["genres"];
        var description = req.cookies["description"];
        try {
            var query = "INSERT INTO Release VALUES(NULL, '" + coverPath + "', '" + releaseName + "', " + artistID + ", " + releaseType + ", '" + releaseDate      + "', '" + releaseLen + "', " + labelID + ", '" + formats + "', " + 0 + ", '" + description + "', " + 0 + ", '" + genres + "')";
            console.log(query);
            await db.run(query);
        }
        catch (e) {
            console.log(e);
        }
    }
    catch (e) {}
    res.redirect("/Discover");
});

app.post("/AddSong", async function (req, res) {
    try {
        var trackName = req.cookies["trackname"];
        console.log(req.cookies["tracklength"]);
        var trackLen  = toUnix(req.cookies["tracklength"]);
        var trackPath = req.cookies["trackpath"];
        var trackNum  = req.cookies["tracknum"];
        var releaseID = req.cookies["relnum"];
        try {
            var query = "INSERT INTO Track VALUES(NULL, '" + trackName + "', time(" + trackLen + ", 'unixepoch'), '" + trackPath + "', " + releaseID + ", " + trackNum + ")";
            console.log(query);
            await db.run(query);
        }
        catch (e) {
            console.log(e);
        }
    }
    catch (e) {}
    res.redirect("/Album?id=" + releaseID);
});

// io.on('connection', function (socket) {
//     console.log("A USER CONNECTED");
//     // socket.send(socket.id);
//     console.log(); //client ID
// });

http.listen(8079);
https.listen(8080);
// app.listen(8080);
console.log('HTTP  PORT 8079');
console.log('HTTPS PORT 8080');

// var hash = hashPassword("HELLO123");
// console.log(hash);

// console.log(checkPassword("HELLO123", (hash.toString("Base64"))));
// console.log(checkPassword("HELLO153", hash));