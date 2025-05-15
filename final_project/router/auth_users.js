const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

  // Validar campos
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Verificar si el usuario existe y la contraseña coincide
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generar token JWT
  const accessToken = jwt.sign({ username }, 'access', { expiresIn: 60 * 60 });

  // Guardar token en la sesión
  req.session.authorization = {
    accessToken
  };

  return res.status(200).json({ message: "User successfully logged in", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  // Verificar si el usuario está logueado y autenticado
  const username = req.session.authorization?.username;

  if (!username) {
    return res.json({ message: "User not logged in" });
  }

  if (!review) {
    return res.json({ message: "No review provided" });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Agregar o modificar reseña
  book.reviews[username] = review;

  return res.json({ message: "Review successfully added/updated", reviews: book.reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session?.authorization?.username;
  
    // Verificar que el usuario esté logueado
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    // Verificar que el libro existe
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Verificar que haya reseñas
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "Review by user not found" });
    }
  
    // Eliminar la reseña del usuario
    delete book.reviews[username];
  
    return res.status(200).json({ message: "Review deleted successfully" });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
