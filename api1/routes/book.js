const router = require("express").Router();
const admin = require("../middlewares/admin");
const bookManager = require("../managers/book");
const reviewManager = require("../managers/review");
const borrowManager = require("../managers/borrow");

router.post("/list", async (req, res) => {
  try {
    let keyword = req.body.keyword || "";
    let list = await bookManager.getAll(keyword);
    return res.status(200).send(list);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/similar", async (req, res) => {
  try {
    let genre = req.body.genre || "";
    let list = await bookManager.getSimilar(genre);
    return res.status(200).send(list);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/", admin, async (req, res) => {
  try {
    let book = await bookManager.create(req.body);
    return res.status(200).json(book);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/details/:id", async (req, res) => {
  try {
    let book = await bookManager.getById(req.params?.id);
    let reviews = await reviewManager.getByBookId(req.params?.id);
    let borrowed = await borrowManager.getByBookId(req.params?.id);
    borrowed = borrowed?.filter((k) => k?.status === "active")?.length;
    return res.status(200).json({ book, reviews, borrowed });
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.get("/:id", admin, async (req, res) => {
  try {
    let book = await bookManager.getById(req.params?.id);
    return res.status(200).json(book);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.put("/:id", admin, async (req, res) => {
  try {
    let book = await bookManager.update(req.params?.id, req.body);
    return res.status(200).json(book);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.delete("/:id", admin, async (req, res) => {
  try {
    let book = await bookManager.deleteById(req.params?.id);
    return res.status(200).json(book);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

module.exports = router;
