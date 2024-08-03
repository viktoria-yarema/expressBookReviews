const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const SECRET_KEY = "7sjk299aakk2011988e4bxzge56711$-2445dxnxnx";
const isValid = (username) => users.some((user) => user.username === username);

const authenticatedUser = (username,password)=>{
  const user = users.find(user => user.username === username);
  return user && user.password === password
}

function generateToken(user) {
  return jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = authenticatedUser(username, password);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const token = generateToken(user);
  return res.status(200).json({ message: 'User logged in successfully', token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
 const isbn = req.params.isbn;
 const {review, username} = req.body;

 try {
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
}

// Add or modify the review
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: 'Review added/modified successfully', book: books[isbn] });
  } catch(e) {
    return res.status(500).json({ message: 'Server issue', e });
  }
});


regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const {username} = req.body;

  try {
    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: 'Review not found' });
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({ message: 'Review deleted successfully', book: books[isbn] });
  } catch (e) {
    return res.status(500).json({ message: 'Server issue', error: e });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
