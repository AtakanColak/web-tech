"use strict";
var sql = require("sqlite3");
var db = new sql.Database("bruh.db");
db.serialize(create);
function create() {
    db.run("CREATE TABLE Release (ID INTEGER NOT NULL PRIMARY KEY, AlbumArtPath Text, ReleaseName Text, ArtistID int, RelType int, RelDate Date, ReleaseLength Text, LabelID int, RelFormat int2, Rating float, Bio Text, NumRatings int, GenreID int2);");
    db.run("CREATE TABLE Genre (ID INTEGER NOT NULL PRIMARY KEY, GenreName Str, ParentGenreID int);");
    db.run("CREATE TABLE Track (ID INTEGER NOT NULL PRIMARY KEY, TrackName Str, TrackLength int, TrackPath Str, ReleaseID int, TrackIndex int);");
    db.run("CREATE TABLE Review (ID INTEGER NOT NULL PRIMARY KEY, ReleaseID int, UserID int, Rating float, Comment Str);");
    db.run("CREATE TABLE ShoppingItem (ID INTEGER NOT NULL PRIMARY KEY, ReleaseID int, CatalogNum int, Price decimal, RelFormat int);");
    db.run("CREATE TABLE OrderItem (ID INTEGER NOT NULL PRIMARY KEY, UserID int, ShoppingItemID int);");

    db.run("INSERT INTO Release VALUES(NULL, 'images/cover.png', 'Naked Flames Who Can Recall His Past Lives', 389, 4, 2018-01-01, time(12146, 'unixepoch'), 31, 1111, 3.4, 'Lorem Ipsum Dolor Sit Amet', 21, 01011)");

    db.run("INSERT INTO Track VALUES(NULL, 'Up Syndrome', time(129, 'unixepoch'), 'not sure what to put here', 1, 1)");
    db.run("INSERT INTO Track VALUES(NULL, 'Troy Snipes the World', time(116, 'unixepoch'), 'not sure what to put here', 1, 2)");
    db.run("INSERT INTO Track VALUES(NULL, 'Nightlights Display', time(251, 'unixepoch'), 'not sure what to put here', 1, 3)");
    db.all("select * from Release", show);
    function show(err, rows) {
        if (err) throw err;
        console.log(rows);
    }
}