const mongoose = require("mongoose");
const books = require("./models/books");

const booksController = require("./controllers/booksController");
const express = require("express");
const app = express();
app.set("view engine", "ejs");

app.set("port", process.env.PORT || 3000);

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

require("dotenv").config();
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useUnifiedTopology: true });

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.get(
  "/booksList",
  booksController.getAllBooks,
  (req, res, next) => {
    console.log(req.data);
    res.render("booksList", { books: req.data });
  }
);

app.get(
  "/home",
  booksController.getAllBooks,
  (req, res, next) => {
    res.render("Home", { home: req.data });
  }
);

app.get(
  "/",
  booksController.getAllBooks,
  (req, res, next) => {
    res.render("Home", { home: req.data });
  }
);

app.get(
  "/books/:id",
  (req, res, next) => {
    const result = books.findOne({ID: req.params.id}).exec().then(function(result){
      console.log(result)
      res.render("Book", { book: result });
    })
  }
);

app.use(express.static('public'))

app.get('*', function(req, res){
  res.status(404).render('error404')
});
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
