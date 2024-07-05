const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", schema);

module.exports = Contact;
