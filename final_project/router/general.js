const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User registered successfully" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Username and password are required." });
});
// Route that serves /books for Axios 
public_users.get('/books', (req, res) => {
    return res.status(200).json(books);
  });
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
     try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const number = req.params.isbn;   
    const book = books[number];       
    if (book) {
        res.status(200).json(book); 
    } else {
        res.status(404).json({ message: "Book not found" }); 
    }
});
// Route that serves /isbn for axios
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({
        message: "Failed to fetch book by ISBN",
        error: error.message
      });
    }
  });

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const requestedAuthor = req.params.author;
    const requestedKeys = Object.values(books);
    const authorDetails = requestedKeys.filter(book => book.author === requestedAuthor);
    if (authorDetails.length > 0) {
      return res.status(200).json(authorDetails);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  });
  
//Routes to serve author for axios
public_users.get('/async-author/:author', async (req, res) => {
    const author = req.params.author;
    try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({message: "Failed to fetch books by author"});
    }
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const requestedTitle = req.params.title;
    const requestedTitleKeys = Object.values(books);
    const titleDetails = requestedTitleKeys.filter(book => book.title === requestedTitle);
  
    if (titleDetails.length > 0) {
      return res.status(200).json({titleDetails});
    } else {
      return res.status(404).json({ message: "Book not found!" });
    }
  });
// Route that serves /title for axios
public_users.get('/promise-title/:title', (req, res) => {
    const title = req.params.title;
    axios.get(`http://localhost:5000/title/${title}`)
      .then(response => {
        return res.status(200).json(response.data);
      })
      .catch(error => {
        return res.status(404).json({message: "Failed to fetch book by Title"});
      });
  });
  
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found!" });
  }

  return res.status(200).json(book.reviews);
});


module.exports.general = public_users;
