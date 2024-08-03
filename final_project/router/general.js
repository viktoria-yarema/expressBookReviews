const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  return res.status(200).json({ message: 'User registered successfully' });
});

async function fetchBooks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 3000);
  });
}

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const bookList = await fetchBooks();
    return res.status(200).json({ bookList: Object.values(bookList) });
  } catch (error) {
    return res.status(500).json({ message: 'Server issue', error });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  const bookList =  await fetchBooks();
  const book = bookList[isbn];

    try {
      if (book) {
          return res.status(200).json(book);
      } else {
          return res.status(404).json({ message: 'Book not found' });
      } 
    } catch (error) {
      return res.status(500).json({ message: 'Server issue', error });
    }
  } 
 );
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const authorReq = req.params.author;
  const bookList =  await fetchBooks();
  const book = Object.values(bookList).find((book) => book.author === authorReq) ?? "";

    try {
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ message: 'Book not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Server issue', error });
    }
});

// Get all books based on title
public_users.get('/title/:title' ,async (req, res) =>  {
  const titleReq = req.params.title;
  const bookList =  await fetchBooks();
  const book = Object.values(bookList).find((book) => book.title === titleReq) ?? "";

  try {
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server issue', error });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbnReq = req.params.isbn;
 
  const reviews = books[isbnReq].reviews;

  if (reviews) {
    return res.status(200).json(reviews);
  } else {
    return res.status(404).json({ message: 'Review not found' });
  }
});

module.exports.general = public_users;
