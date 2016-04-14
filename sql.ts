class sql {
    static GetAuthors = "select ID, Name from authors";
    static GetBooks = "select n.ID, n.Title, N.AuthorID, a.Name as Author from Novels n inner join Authors a on n.AuthorID = a.ID";
    static GetAwards = "Select ID, AwardName from Awards";
    static GetBookDetails = "select b.ID, b.Title, b.AuthorID, a.Name as Author from Novels b inner join Authors a on b.AuthorID = a.ID where b.ID = @bookID; select * from Nominations where BookID=@bookID";
    static GetAuthorDetails = "select ID, Name from Authors where ID = @authorID; select * from Novels where AuthorID = @authorID"
}

export = sql;