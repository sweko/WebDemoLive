/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/tedious/tedious.d.ts" />
/// <reference path="sql.ts" />

import * as express from "express"
import * as tedious from "tedious"

import * as params from "./params.json"
import sql = require("./sql");

var config = {
    userName: params.username,
    password: params.password,
    server: params.server,
    options: {
        database: "SciFiAwards",
        useColumnNames: true,
        rowCollectionOnRequestCompletion :true
    }
    // If you're on Windows Azure, you will need this:
    //options: {encrypt: true}
};

var app = express();

app.use('/static', express.static('html'));

app.get("/api/authors", function(req, res){
    var connection = new tedious.Connection(config);
    connection.on('connect', err => {
        var request = new tedious.Request(sql.GetAuthors, (err, rc, rows) => {
            if (err){
                console.log(err);
                res.status(500).send("database error");
            } else {
                var authors = rows.map(row => {return {id: row.ID.value, name: row.Name.value}});
                res.json(authors);    
            }
            connection.close();
        });
        
        connection.execSql(request);
    });
})

app.get("/api/books", function(req, res){
    var connection = new tedious.Connection(config);
    connection.on('connect', err => {
        var request = new tedious.Request(sql.GetBooks, (err, rc, rows) => {
            if (err){
                console.log(err);
                res.status(500).send("database error");
            } else {
                var books = rows.map(row => {return {
                    id: row.ID.value, 
                    title: row.Title.value,
                    author: row.Author.value,
                    authorId: row.AuthorID.value
                }});
                res.json(books);
            }
            connection.close();
        });
        
        connection.execSql(request);
    });
})

app.get("/api/awards", function(req, res){
    var connection = new tedious.Connection(config);
    connection.on('connect', err => {
        var request = new tedious.Request(sql.GetAwards, (err, rc, rows) => {
            if (err){
                console.log(err);
                res.status(500).send("database error");
            } else {
                var awards = rows.map(row => {return {id: row.ID.value, awardName: row.AwardName.value}});
                res.json(awards);
            }
            connection.close();
        });
        
        connection.execSql(request);
    });
})

app.get("/api/authors/:author", function(req, res){
    var authorId = req.params.author
    var connection = new tedious.Connection(config);
    connection.on('connect', err => {
        var request = new tedious.Request(sql.GetAuthorDetails, (err, rc, rows) => {
            if (err){
                console.log(err);
                res.status(500).send("database error");
                connection.close();
                return;
            }
            if (!rc){
                res.status(404).send("author not found");
                connection.close();
                return;
            }
                
            var author = {
                id: rows[0].ID.value,
                name: rows[0].Name.value,
                books: []
            };
            
            author.books = rows.slice(1).map(row => {
                return {
                    id :row.ID.value,
                    title: row.Title.value
                }
            });
            
            res.json(author);    
            connection.close();
        });
        request.addParameter("authorId",tedious.TYPES.Int, authorId);
        connection.execSql(request);
    });
})

app.get("/api/books/:book", function(req, res){
    var bookId = req.params.book
    var connection = new tedious.Connection(config);
    connection.on('connect', err => {
        var request = new tedious.Request(sql.GetBookDetails, (err, rc, rows) => {
            if (err){
                console.log(err);
                res.status(500).send("database error");
                connection.close();
                return;
            }
            if (!rc){
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
            
            book.nominations = rows.slice(1).map(row => {
                return {
                    awardId :row.AwardID.value,
                    yearNominated: row.YearNominated.value,
                    isWinner: !!row.IsWinner.value
                }
            });
            
            res.json(book);    
            connection.close();
        });
        request.addParameter("bookId",tedious.TYPES.Int, bookId);
        connection.execSql(request);
    });
})


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
