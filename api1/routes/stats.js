const router = require("express").Router();
const admin = require("../middlewares/admin");
const bookManager = require("../managers/book");
const userManager = require("../managers/user");
const borrowManager = require("../managers/borrow");

router.get("/counts", admin, async (req, res) => {
  try {
    let books = await bookManager.getCount();
    let users = await userManager.getCount();
    let lateBooks = await borrowManager.getLateCount();
    return res.status(200).send({ books, users, lateBooks });
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/users-by-date", admin, async (req, res) => {
  try {
    let startDate = req.body.range?.startDate;
    let endDate = req.body.range?.endDate;
    let counts = await userManager.getCountByDateRange(startDate, endDate);
    return res.status(200).send(counts);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/books-borrowed-by-date", admin, async (req, res) => {
  try {
    let startDate = req.body.range?.startDate;
    let endDate = req.body.range?.endDate;
    let counts = await borrowManager.getCountByDateRange(startDate, endDate);
    return res.status(200).send(counts);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/famous-books", admin, async (req, res) => {
  try {
    let startDate = req.body.range?.startDate;
    let endDate = req.body.range?.endDate;
    let books = await borrowManager.getTopBooksByDateRange(startDate, endDate);
    return res.status(200).send(books);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/books-by-genre", admin, async (req, res) => {
  try {
    let startDate = req.body.range?.startDate;
    let endDate = req.body.range?.endDate;
    let counts = await bookManager.getCountByDateRangeAndGenre(
      startDate,
      endDate
    );
    return res.status(200).send(counts);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

module.exports = router;
