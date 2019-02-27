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
    db.run("CREATE TABLE Release (ID int NOT NULL, AlbumArtPath Str, ReleaseName Str, ArtistID int, RelType int, RelDate Date, ReleaseLength int, LabelID int, RelFormat Array[int], Rating float, Bio Str, NumRatings int, GenreID Array[int], PRIMARY KEY(ID));");
}