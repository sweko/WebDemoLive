/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/tedious/tedious.d.ts" />
/// <reference path="sql.ts" />
var express = require("express");
var tedious = require("tedious");
var params = require("./params.json");
var sql = require("./sql");
var config = {
    userName: params.username,
    password: params.password,
    server: params.server,
    options: {
        database: "SciFiAwards",
        useColumnNames: true,
        rowCollectionOnRequestCompletion: true
    }
};
var app = express();
app.use('/static', express.static('html'));
app.get("/api/authors", function (req, res) {
    var connection = new tedious.Connection(config);
    connection.on('connect', function (err) {
        var request = new tedious.Request(sql.GetAuthors, function (err, rc, rows) {
            if (err) {
                console.log(err);
                res.status(500).send("database error");
            }
            else {
                var authors = rows.map(function (row) { return { id: row.ID.value, name: row.Name.value }; });
                res.json(authors);
            }
            connection.close();
        });
        connection.execSql(request);
    });
});
app.get("/api/books", function (req, res) {
    var connection = new tedious.Connection(config);
    connection.on('connect', function (err) {
        var request = new tedious.Request(sql.GetBooks, function (err, rc, rows) {
            if (err) {
                console.log(err);
                res.status(500).send("database error");
            }
            else {
                var books = rows.map(function (row) {
                    return {
                        id: row.ID.value,
                        title: row.Title.value,
                        author: row.Author.value,
                        authorId: row.AuthorID.value
                    };
                });
                res.json(books);
            }
            connection.close();
        });
        connection.execSql(request);
    });
});
app.get("/api/awards", function (req, res) {
    var connection = new tedious.Connection(config);
    connection.on('connect', function (err) {
        var request = new tedious.Request(sql.GetAwards, function (err, rc, rows) {
            if (err) {
                console.log(err);
                res.status(500).send("database error");
            }
            else {
                var awards = rows.map(function (row) { return { id: row.ID.value, awardName: row.AwardName.value }; });
                res.json(awards);
            }
            connection.close();
        });
        connection.execSql(request);
    });
});
app.get("/api/authors/:author", function (req, res) {
    var authorId = req.params.author;
    var connection = new tedious.Connection(config);
    connection.on('connect', function (err) {
        var request = new tedious.Request(sql.GetAuthorDetails, function (err, rc, rows) {
            if (err) {
                console.log(err);
                res.status(500).send("database error");
                connection.close();
                return;
            }
            if (!rc) {
                res.status(404).send("author not found");
                connection.close();
                return;
            }
            var author = {
                id: rows[0].ID.value,
                name: rows[0].Name.value,
                books: []
            };
            author.books = rows.slice(1).map(function (row) {
                return {
                    id: row.ID.value,
                    title: row.Title.value
                };
            });
            res.json(author);
            connection.close();
        });
        request.addParameter("authorId", tedious.TYPES.Int, authorId);
        connection.execSql(request);
    });
});
app.get("/api/books/:book", function (req, res) {
    var bookId = req.params.book;
    var connection = new tedious.Connection(config);
    connection.on('connect', function (err) {
        var request = new tedious.Request(sql.GetBookDetails, function (err, rc, rows) {
            if (err) {
                console.log(err);
                res.status(500).send("database error");
                connection.close();
                return;
            }
            if (!rc) {
                res.status(404).send("book not found");
                connection.close();
                return;
            }
            var book = {
                id: rows[0].ID.value,
                title: rows[0].Title.value,
                author: rows[0].Author.value,
                authorId: rows[0].AuthorID.value,
                nominations: []
            };
            book.nominations = rows.slice(1).map(function (row) {
                return {
                    awardId: row.AwardID.value,
                    yearNominated: row.YearNominated.value,
                    isWinner: !!row.IsWinner.value
                };
            });
            res.json(book);
            connection.close();
        });
        request.addParameter("bookId", tedious.TYPES.Int, bookId);
        connection.execSql(request);
    });
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
//var connection = new tedious.Connection(config);
//   connection.on('connect', function(err) {
//     // If no error, then good to go...
//       executeStatement();
//     }
//   )
// var app = express();
// app.get("/api/authors", "");
//# sourceMappingURL=server.js.map