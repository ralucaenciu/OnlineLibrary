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
    days: { type: Number, required: true },
    status: { type: String, required: true, default: "active" }, //active, returned
  },
  { timestamps: true }
);

const Borrower = mongoose.model("Borrower", schema);

module.exports = Borrower;
