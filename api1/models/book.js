const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    year: { type: Number, required: true },
    count: { type: Number, required: true },
    coverUrl: { type: String, required: true },
    isbn: { type: String, required: true },
    pages: { type: Number, required: true },
    publisher: { type: String, required: true },
    aboutAuthor: { type: String, required: true },
    aboutImageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", schema);

module.exports = Book;
