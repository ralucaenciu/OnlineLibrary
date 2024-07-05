const router = require("express").Router();
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const contactManager = require("../managers/contact");

router.post("/list", admin, async (req, res) => {
  try {
    let keyword = req.body.keyword;
    let list = await contactManager.getAll(keyword);
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
    let review = await contactManager.create(obj);
    return res.status(200).json(review);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

module.exports = router;
