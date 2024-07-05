const Model = require("../models/contact");

const Manager = {
  getAll: async (keyword) => {
    let query = { feedback: { $regex: keyword, $options: "i" } };
    let t = await Model.find(query)
      .populate("userId", "_id name email")
      .sort({ createdAt: -1 });
    return t;
  },
  getById: async (id) => {
    let record = await Model.findById(id);
    return record;
  },
  getByUserId: async (userId) => {
    const t = await Model.find({ userId: userId }).populate(
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
