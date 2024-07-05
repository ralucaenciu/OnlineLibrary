const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    feedback: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", schema);

module.exports = Review;
