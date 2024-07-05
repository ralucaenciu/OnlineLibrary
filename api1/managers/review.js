const Model = require("../models/review");

const Manager = {
  getById: async (id) => {
    let record = await Model.findById(id);
    return record;
  },
  getByUserId: async (userId) => {
    const t = await Model.find({ userId: userId }).populate("bookId");
    return t ? t : false;
  },
  getByBookId: async (bookId) => {
    const t = await Model.find({ bookId: bookId }).populate(
      "userId",
      "_id name email"
    );
    return t ? t : false;
  },
  create: async (t) => {
    let record = new Model(t);
    record = await record.save();
    return record ? record : false;
  },
  deleteById: async (id) => {
    let t = await Model.findByIdAndDelete(id);
    return t ? true : false;
  },
};

module.exports = Manager;
