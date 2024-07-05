const Model = require("../models/borrower");
const moment = require("moment");

const Manager = {
  getAll: async (keyword) => {
    let query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { genre: { $regex: keyword, $options: "i" } },
      ],
    };

    let t = await Model.find(query).sort({ createdAt: -1 });
    return t;
  },
  getLateCount: async () => {
    let all = await Model.find({ status: "active" });
    let count = 0;
    for (let i = 0; i < all.length; i++) {
      let current = all[i];
      let dueDate = moment(current?.createdAt).add(current?.days, "days");
      let now = moment();
      if (now.diff(dueDate, "days") < 0) {
        count += 1;
      }
    }

    return count;
  },
  getById: async (id) => {
    let record = await Model.findById(id);
    return record;
  },
  getByUserId: async (userId) => {
    const t = await Model.find({ userId: userId }).populate("bookId");
    return t ? t : false;
  },
  getByBookId: async (bookId) => {
    const t = await Model.find({ bookId: bookId })
      .populate("userId", "_id name email")
      .populate("bookId");
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
  updateStatus: async (userId, bookId) => {
    let t = await Model.findOneAndUpdate(
      { userId: userId, bookId: bookId },
      { status: "returned" },
      { new: true }
    );
    return t ? t : false;
  },
  getCountByDateRange: async (from, to) => {
    return await Model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(moment(from)),
            $lte: new Date(moment(to)),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);
  },
  getTopBooksByDateRange: async (from, to) => {
    return await Model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(moment(from)),
            $lte: new Date(moment(to)),
          },
        },
      },
      {
        $group: {
          _id: "$bookId",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 4,
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: "$book",
      },
    ]);
  },
};

module.exports = Manager;
