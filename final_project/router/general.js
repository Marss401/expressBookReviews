const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    public_users.get('/isbn/:isbn', function (req, res) {
    const number = req.params.isbn;   
    const book = books[number];       

    if (book) {
        res.status(200).json(book); 
    } else {
        res.status(404).json({ message: "Book not found" }); 
    }
});

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const requestedAuthor = Object.values(books)

  const authorDetails = requestedAuthor.filter(book => book.author === author);

if (authorDetails.length > 0){
    return res.status(200).json(authorDetails, {message: "Book found!"});
} else {
   return res.status(404).json({message: "Book not found!"});
}
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
   const title = req.params.title;
  const requestedTitle = Object.values(books)

  const titleDetails = requestedTitle.filter(book => book.title === title);

if (titleDetails.length > 0){
    return res.status(200).json(titleDetails, {message: "Book found!"});
} else {
   return res.status(404).json({message: "Book not found!"});
}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

});

module.exports.general = public_users;
