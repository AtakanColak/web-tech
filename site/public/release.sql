CREATE DATABASE releasePage;

CREATE TABLE Release (
    ID              int,
    AlbumArtPath    Str,
    ReleaseName     Str,
    ArtistID        int,
    RelType         Enum('Album', 'EP', 'Single', 'Compilation'),
    RelDate         Date,
    ReleaseLength   int,
    LabelID         int,
    RelFormat       Array[Enum('Digital', 'Vinyl', 'CD', 'Cassette', 'Other')],
    Rating          float,
    Bio             Str,
    NumRatings      int,
    GenreID         Array[int],
    PRIMARY KEY (ID)
);

CREATE TABLE Genre (
    ID              int,
    GenreName       Str,
    ParentGenreID   int,
    PRIMARY KEY (ID)
);

CREATE TABLE Track (
    ID              int,
    TrackName       Str,
    TrackLength     Time,
    TrackPath       Str,
    ReleaseID       int,
    TrackIndex      int,
    PRIMARY KEY (ID)
    FOREIGN KEY (ReleaseID) REFERENCES Release(ID)
);

CREATE TABLE Review (
    ID              int,
    ReleaseID       int,
    UserID          int,
    Rating          float,
    Comment         Str,
    PRIMARY KEY (ID)
    FOREIGN KEY (ReleaseID) REFERENCES Release(ID)
);

CREATE TABLE ShoppingItem (
    ID              int,
    ReleaseID       int,
    CatalogNum      Str,
    Price           decimal,
    RelFormat       Enum('Digital', 'Vinyl', 'CD', 'Cassette', 'Other'),
    PRIMARY KEY (ID)
    FOREIGN KEY (ReleaseID) REFERENCES Release(ID)
);

CREATE TABLE OrderItem (
    ID              int,
    UserID          int,
    ShoppingItemID  int,
    PRIMARY KEY (ID)
);