const router = require("express").Router();
const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const reviewManager = require("../managers/review");

router.post("/mine", auth, async (req, res) => {
  try {
    let list = await reviewManager.getByUserId(req.tokenData.userId);
    return res.status(200).send(list);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/book", async (req, res) => {
  try {
    let list = await reviewManager.getByBookId(req.body.bookId);
    return res.status(200).send(list);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    let obj = {
      userId: req.tokenData.userId,
      ...req.body,
    };
    let review = await reviewManager.create(obj);
    return res.status(200).json(review);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.delete("/:id", admin, async (req, res) => {
  try {
    let record = await reviewManager.deleteById(req.params?.id);
    return res.status(200).json(record);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

module.exports = router;
