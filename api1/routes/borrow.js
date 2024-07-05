const router = require("express").Router();
const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const borrowerManager = require("../managers/borrow");
const bookManager = require("../managers/book");

router.post("/mine", auth, async (req, res) => {
  try {
    let list = await borrowerManager.getByUserId(req.tokenData.userId);
    return res.status(200).send(list);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    let list = await borrowerManager.getByBookId(req.body.bookId);
    let alreadyExists = list?.find(
      (k) =>
        k?.userId?._id?.toString() === req.tokenData?.userId?.toString() &&
        k?.status === "active"
    );
    if (alreadyExists) {
      return res
        .status(400)
        .send(
          "Ați împrumutat deja această carte. Puteți împrumuta doar un exemplar."
        );
    }

    let book = await bookManager.getById(req.body.bookId);
    if (list?.length >= book?.count) {
      return res
        .status(400)
        .send(
          "Toate exemplarele cărții sunt împrumutate momentan. Nu vă putem împrumuta această carte."
        );
    }

    let obj = {
      userId: req.tokenData.userId,
      bookId: req.body.bookId,
      days: req.body.days,
      status: "active",
    };
    await borrowerManager.create(obj);
    let usersList = await borrowerManager.getByUserId(req.tokenData?.userId);
    usersList = usersList
      ?.filter((k) => k?.status === "active")
      .map((k) => k?.bookId?._id);
    return res.status(200).json(usersList);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/return", auth, async (req, res) => {
  try {
    await borrowerManager.updateStatus(req.tokenData?.userId, req.body.bookId);
    let usersList = await borrowerManager.getByUserId(req.tokenData?.userId);
    usersList = usersList
      ?.filter((k) => k?.status === "active")
      .map((k) => k?.bookId?._id);
    return res.status(200).json(usersList);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.delete("/:id", admin, async (req, res) => {
  try {
    let record = await borrowerManager.deleteById(req.params?.id);
    return res.status(200).json(record);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

module.exports = router;
