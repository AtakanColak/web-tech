// "use strict";
// var sql = require("sqlite3");
// var util = require('util');
// var exec = require('child_process').exec;
// function puts(error, stdout, stderr) { console.log(stdout) }

// exec("sqlite3 {/home/anton/Documents/bruh.db} < {release.sql}", puts);

"use strict";
var sql = require("sqlite3");
var db = new sql.Database("bruh.db");
db.serialize(create);
function create() {
    db.run("CREATE TABLE Release (ID INTEGER NOT NULL PRIMARY KEY, AlbumArtPath Text, ReleaseName Text, ArtistID int, RelType int2, RelDate Date, ReleaseLength int, LabelID int, RelFormat int, Rating float, Bio Text, NumRatings int, GenreID int2);");
    db.run("CREATE TABLE Genre (ID INTEGER NOT NULL PRIMARY KEY, GenreName Str, ParentGenreID int);");
    db.run("CREATE TABLE Track (ID INTEGER NOT NULL PRIMARY KEY, TrackName Str, TrackLength Time, TrackPath Str, ReleaseID int, TrackIndex int);");
    db.run("CREATE TABLE Review (ID INTEGER NOT NULL PRIMARY KEY, ReleaseID int, UserID int, Rating float, Comment Str);");
    db.run("CREATE TABLE ShoppingItem (ID INTEGER NOT NULL PRIMARY KEY, ReleaseID int, CatalogNum int, Price decimal, RelFormat int);");
    db.run("CREATE TABLE OrderItem (ID INTEGER NOT NULL PRIMARY KEY, UserID int, ShoppingItemID int);");

    db.run("INSERT INTO Release VALUES(NULL, 'images/cover.png', 'Naked Flames Who Can Recall His Past Lives', 389, 0001, 2018-01-01, 50, 31, 123, 3.4, 'Lorem Ipsum Dolor Sit Amet', 21, 00001)");
}