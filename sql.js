var sql = (function () {
    function sql() {
    }
    sql.GetAuthors = "select ID, Name from authors";
    sql.GetBooks = "select n.ID, n.Title, N.AuthorID, a.Name as Author from Novels n inner join Authors a on n.AuthorID = a.ID";
    sql.GetAwards = "Select ID, AwardName from Awards";
    sql.GetBookDetails = "select b.ID, b.Title, b.AuthorID, a.Name as Author from Novels b inner join Authors a on b.AuthorID = a.ID where b.ID = @bookID; select * from Nominations where BookID=@bookID";
    sql.GetAuthorDetails = "select ID, Name from Authors where ID = @authorID; select * from Novels where AuthorID = @authorID";
    return sql;
})();
module.exports = sql;
//# sourceMappingURL=sql.js.map