const mongoose = require("mongoose");
const { isEmail } = require("validator");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: isEmail,
    },
    password: { type: String, required: true, minlength: 3 },
    tempPassword: { type: String, required: false },
    active: { type: Boolean, required: true, default: false },
    type: { type: String, required: true, default: "user" }, // user, admin
    imageUrl: { type: String, required: false, default: "" },
    phone: { type: String, required: false, default: "" },
    favourites: {
      type: mongoose.Schema.Types.Array,
      required: false,
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", schema);

module.exports = User;
