"use strict";
var sql = require("sqlite3");
var db = new sql.Database("bruh.db");
db.serialize(create);
function create() {
    db.run("CREATE TABLE Release (ID INTEGER NOT NULL PRIMARY KEY, AlbumArtPath Text, ReleaseName Text, ArtistID int, RelType int, RelDate int, ReleaseLength Text, LabelID int, RelFormat int2, Rating float, Bio Text, NumRatings int, GenreID Text);");
    db.run("CREATE TABLE Genre (ID INTEGER NOT NULL PRIMARY KEY, GenreName Str, ParentGenreID int);");
    db.run("CREATE TABLE Track (ID INTEGER NOT NULL PRIMARY KEY, TrackName Str, TrackLength int, TrackPath Str, ReleaseID int, TrackIndex int);");
    db.run("CREATE TABLE Review (ID INTEGER NOT NULL PRIMARY KEY, ReleaseID int, UserID int, Rating int, Comment Text, Date Text);");
    db.run("CREATE TABLE ShoppingItem (ID INTEGER NOT NULL PRIMARY KEY, ReleaseID int, CatalogNum Text, Price decimal, RelFormat Text);");
    db.run("CREATE TABLE OrderItem (ID INTEGER NOT NULL PRIMARY KEY, UserID int, ShoppingItemID int);");
    db.run("CREATE TABLE Label (ID INTEGER NOT NULL PRIMARY KEY, LabelName Text);");
    db.run("CREATE TABLE Artist (ID INTEGER NOT NULL PRIMARY KEY, ArtistName Text);");
    db.run("CREATE TABLE User (ID INTEGER NOT NULL PRIMARY KEY, UserName Text, Password Text);");

    db.run("INSERT INTO Release VALUES(NULL, 'images/cover.png', 'Naked Flames Who Can Recall His Past Lives', 1, 3, 2018, time(12146, 'unixepoch'), 1, 1111, 3.4, 'A sprawling and meandering compilation of (almost) all of Naked Flames'' tracks between 2015 and 2017.', 21, '0010000010')");

    db.run("INSERT INTO Track VALUES(NULL, 'Up Syndrome', time(129, 'unixepoch'), 'not sure what to put here', 1, 1)");
    db.run("INSERT INTO Track VALUES(NULL, 'Troy Snipes the World', time(116, 'unixepoch'), 'not sure what to put here', 1, 2)");
    db.run("INSERT INTO Track VALUES(NULL, 'Nightlights Display', time(251, 'unixepoch'), 'not sure what to put here', 1, 3)");
    db.run("INSERT INTO Track VALUES(NULL, 'Thetime', time(151, 'unixepoch'), 'not sure what to put here', 1, 4)");
    db.run("INSERT INTO Track VALUES(NULL, 'Audiovisuals 7 and 11', time(453, 'unixepoch'), 'not sure what to put here', 1, 5)");
    db.run("INSERT INTO Track VALUES(NULL, 'Is This Thing On', time(360, 'unixepoch'), 'not sure what to put here', 1, 6)");
    db.run("INSERT INTO Track VALUES(NULL, 'Secretweapon', time(660, 'unixepoch'), 'not sure what to put here', 1, 7)");
    db.run("INSERT INTO Track VALUES(NULL, 'Keeping Out', time(118, 'unixepoch'), 'not sure what to put here', 1, 8)");
    db.run("INSERT INTO Track VALUES(NULL, 'Slum', time(633, 'unixepoch'), 'not sure what to put here', 1, 9)");
    db.run("INSERT INTO Track VALUES(NULL, 'Backseat Driver', time(334, 'unixepoch'), 'not sure what to put here', 1, 10)");
    db.run("INSERT INTO Track VALUES(NULL, 'This Is Such a Pity', time(106, 'unixepoch'), 'not sure what to put here', 1, 11)");
    db.run("INSERT INTO Track VALUES(NULL, 'I See 5 Lights', time(354, 'unixepoch'), 'not sure what to put here', 1, 12)");
    db.run("INSERT INTO Track VALUES(NULL, 'Relatives Talking in the Other Room', time(414, 'unixepoch'), 'not sure what to put here', 1, 13)");
    db.run("INSERT INTO Track VALUES(NULL, 'Thought Trafficking Ring', time(226, 'unixepoch'), 'not sure what to put here', 1, 14)");
    db.run("INSERT INTO Track VALUES(NULL, '20/20 Hindsight', time(287, 'unixepoch'), 'not sure what to put here', 1, 15)");
    db.run("INSERT INTO Track VALUES(NULL, 'I Am Leaving Dude Im Out', time(146, 'unixepoch'), 'not sure what to put here', 1, 16)");
    db.run("INSERT INTO Track VALUES(NULL, 'How Is That Legal', time(360, 'unixepoch'), 'not sure what to put here', 1, 17)");
    db.run("INSERT INTO Track VALUES(NULL, 'Backtrack Observation', time(658, 'unixepoch'), 'not sure what to put here', 1, 18)");
    db.run("INSERT INTO Track VALUES(NULL, 'Drawing a Parallel', time(425, 'unixepoch'), 'not sure what to put here', 1, 19)");
    db.run("INSERT INTO Track VALUES(NULL, 'His Name', time(251, 'unixepoch'), 'not sure what to put here', 1, 20)");
    db.run("INSERT INTO Track VALUES(NULL, 'Limbs Like Teeth', time(312, 'unixepoch'), 'not sure what to put here', 1, 21)");
    db.run("INSERT INTO Track VALUES(NULL, 'Heat Turns to Freeze', time(732, 'unixepoch'), 'not sure what to put here', 1, 22)");
    db.run("INSERT INTO Track VALUES(NULL, 'You Can Tell a Lie', time(680, 'unixepoch'), 'not sure what to put here', 1, 23)");
    db.run("INSERT INTO Track VALUES(NULL, 'Where You Feel Most Comfortable', time(80, 'unixepoch'), 'not sure what to put here', 1, 24)");
    db.run("INSERT INTO Track VALUES(NULL, 'Seemingly Inconsequential', time(176, 'unixepoch'), 'not sure what to put here', 1, 25)");
    db.run("INSERT INTO Track VALUES(NULL, 'Messy Time', time(203, 'unixepoch'), 'not sure what to put here', 1, 26)");
    db.run("INSERT INTO Track VALUES(NULL, 'I Think I Can', time(282, 'unixepoch'), 'not sure what to put here', 1, 27)");
    db.run("INSERT INTO Track VALUES(NULL, 'Press and Turn', time(256, 'unixepoch'), 'not sure what to put here', 1, 28)");
    db.run("INSERT INTO Track VALUES(NULL, 'Winterside Mews', time(272, 'unixepoch'), 'not sure what to put here', 1, 29)");
    db.run("INSERT INTO Track VALUES(NULL, 'A Nice Mutual Friendship', time(162, 'unixepoch'), 'not sure what to put here', 1, 30)");
    db.run("INSERT INTO Track VALUES(NULL, 'This Is Bad', time(306, 'unixepoch'), 'not sure what to put here', 1, 31)");
    db.run("INSERT INTO Track VALUES(NULL, 'Starting to Rain', time(522, 'unixepoch'), 'not sure what to put here', 1, 32)");
    db.run("INSERT INTO Track VALUES(NULL, 'GoodL', time(344, 'unixepoch'), 'not sure what to put here', 1, 33)");
    db.run("INSERT INTO Track VALUES(NULL, 'Why Im Outside', time(252, 'unixepoch'), 'not sure what to put here', 1, 34)");
    db.run("INSERT INTO Track VALUES(NULL, 'Seeya', time(277, 'unixepoch'), 'not sure what to put here', 1, 35)");
    db.run("INSERT INTO Track VALUES(NULL, 'Basement Inundated Testitup', time(138, 'unixepoch'), 'not sure what to put here', 1, 36)");
    db.run("INSERT INTO Track VALUES(NULL, 'Airships at Sea', time(213, 'unixepoch'), 'not sure what to put here', 1, 37)");
    db.run("INSERT INTO Track VALUES(NULL, 'sLAUGHTERhouse', time(624, 'unixepoch'), 'not sure what to put here', 1, 38)");

    db.run("INSERT INTO Label VALUES(NULL, 'No Label')");
    db.run("INSERT INTO Artist VALUES(NULL, 'Naked Flames')");

    // db.run("CREATE TABLE ShoppingItem (ID INTEGER NOT NULL PRIMARY KEY, ReleaseID int, CatalogNum int, Price decimal, RelFormat int);");
    db.run("INSERT INTO ShoppingItem VALUES(NULL, 1, '1571-66778-1', 4.99, 'Digital')");
    db.run("INSERT INTO ShoppingItem VALUES(NULL, 1, '1571-66778-2', 44.99, 'Vinyl')");
    db.run("INSERT INTO ShoppingItem VALUES(NULL, 1, '1571-66778-3', 14.99, 'CD')");
    db.run("INSERT INTO ShoppingItem VALUES(NULL, 1, '1571-66778-4', 12.99, 'Cassette')");

    db.run("INSERT INTO User VALUES(NULL, '1Chops', 'password12345')");
    db.run("INSERT INTO User VALUES(NULL, 'Hakita', '54321drowssap')");

    // db.run("CREATE TABLE Review (ID INTEGER NOT NULL PRIMARY KEY, ReleaseID int, UserID int, Rating int, Comment Text, Date Text);");

    db.run("INSERT INTO Review VALUES(NULL, 1, 1, 3, 'Haven''t heard the whole thing yet, but if the batting average keeps up over the whole project, this is the first really good album of 2o18. It''s so rare that I can get excited about instrumental rock, but the atmosphere Naked Flames created is so dead - on perfect that I can''t help but get drawn in. Defo feels like some kinda dream diary. I guess my only real complaint is that some of the longer songs get kinda meandery / lose me a little as they stretch onward(Secretweapon really does this in that first half). And the absence of a human voice really goes noticed sometimes. Other than that THESE TUNES ARE GOOD and I''m excited to finish off the tracklist.', '01.01.2018')");
    db.run("INSERT INTO Review VALUES(NULL, 1, 2, 5, 'The variety on display here is great. A lot of the songs are meh but since they''re all pretty short it won''t take long until you''re on something new and fresh. The post - rock and ambient tracks were by far my favorite, such as Slum and Backtrack Observation, though a lot of banger tracks like How Is That Legal and Press and Turn were great too. The only real downsides of this album are the fact that, since it''s 38 songs, you''re bound to not even remember half of them by the time you''re done and a couple awkward moments of attempts at comedy. Regardless, it''s a good album with lots of relisten value and charm. It''s the kinda album that''s easy to just put on and let flow, making it pretty accessible. Despite being long, I was never once bored during it, and will probably relisten to it in the future.', '09.02.2019')");

    db.all("select * from Release", show);
    function show(err, rows) {
        if (err) throw err;
        console.log(rows);
    }
}