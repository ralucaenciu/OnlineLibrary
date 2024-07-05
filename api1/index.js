require("./db/connection");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const users = require("./routes/user");
const books = require("./routes/book");
const borrows = require("./routes/borrow");
const reviews = require("./routes/review");
const contact = require("./routes/contact");
const stats = require("./routes/stats");

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "50mb",
    parameterLimit: 50000,
  })
);

app.get("/", (req, res) => res.status(200).send("API is working..."));
app.use("/users", users);
app.use("/books", books);
app.use("/borrows", borrows);
app.use("/reviews", reviews);
app.use("/contacts", contact);
app.use("/stats", stats);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
