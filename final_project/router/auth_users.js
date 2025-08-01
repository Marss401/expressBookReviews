const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
        let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password) => { 
        let usersThatExists = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    // Return true if any user with the same username is found, otherwise false
    if (usersThatExists.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
     const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(401).json({ message: "Invalid login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const number = req.params.isbn;  
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!books[number]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review cannot be empty." });
  }

  // Ensure the 'reviews' object exists
  if (!books[number].reviews) {
    books[number].reviews = {};
  }

  // Add or update the user's review
  books[number].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully added or updated",
    reviews: books[number].reviews
  });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const number = req.params.isbn;  
    const username = req.session.authorization?.username;
    if (!books[number].reviews || !books[number].reviews[username]) {
        return res.status(404).json({ message: "Review by this user does not exist" });
      }
    delete books[number].reviews[username];
    return res.status(200).json({ message: "Review successfully deleted" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
