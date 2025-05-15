const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Verificar si username y password fueron proporcionados
    if (!username || !password) {
      return res.json({ message: "Username and password are required." });
    }
  
    // Verificar si el usuario ya existe
    const userExists = users.some((user) => user.username === username);
  
    if (userExists) {
      return res.json({ message: "Username already exists." });
    }
  
    // Agregar nuevo usuario al array de usuarios
    users.push({ username, password });
  
    return res.json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    const book = books[isbn];
  
    if (book) {
      res.send(JSON.stringify(book, null, 4));
    } else {
      res.json({ message: "Book not found for the given ISBN." });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const matchingBooks = [];

  // Obtener todas las claves (ISBNs) del objeto `books`
  const bookKeys = Object.keys(books);

  // Iterar sobre los libros y buscar coincidencias por autor
  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  });

  if (matchingBooks.length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 4));
  } else {
    res.json({ message: "No books found for the given author." });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    const matchingBooks = [];
  
    // Obtener todas las claves (ISBNs) del objeto `books`
    const bookKeys = Object.keys(books);
  
    // Iterar sobre los libros y buscar coincidencias por autor
    bookKeys.forEach((key) => {
      if (books[key].title === title) {
        matchingBooks.push({ isbn: key, ...books[key] });
      }
    });
  
    if (matchingBooks.length > 0) {
      res.send(JSON.stringify(matchingBooks, null, 4));
    } else {
      res.json({ message: "No books found for the given title." });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    const book = books[isbn];
  
    if (book) {
      res.send(JSON.stringify(book.reviews, null, 4));
    } else {
      res.json({ message: "Book not found for the given ISBN." });
    }
});

const axios = require('axios');

// Función async para obtener libros
const getBooksAsync = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("Libros disponibles (async/await):");
    console.log(response.data);
  } catch (error) {
    console.error("Error al obtener los libros:", error.message);
  }
};

getBooksAsync();

const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(`Detalles del libro con ISBN ${isbn} (async/await):`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error al obtener el libro con ISBN ${isbn}:`, error.message);
  }
};

// Llamada de prueba
getBookByISBN('1');

const getBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    console.log(`Libros del autor "${author}" (async/await):`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error al obtener libros del autor "${author}":`, error.message);
  }
};

// Llamada de prueba
getBooksByAuthor('Unknown');

const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    console.log(`Libros con el título "${title}" (async/await):`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error al obtener libros con el título "${title}":`, error.message);
  }
};

// Llamada de prueba
getBooksByTitle('The Book Of Job');

module.exports.general = public_users;
