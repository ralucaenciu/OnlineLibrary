const Model = require("../models/book");
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
  getSimilar: async (genre) => {
    let t = await Model.find({
      genre: { $regex: genre?.trim(), $options: "i" },
    })
      .sort({
        createdAt: -1,
      })
      .limit(5);
    return t;
  },
  getCount: async () => {
    return await Model.countDocuments();
  },
  getById: async (id) => {
    let book = await Model.findById(id);
    return book;
  },
  getByIds: async (arr) => {
    let books = await Model.find({ _id: { $in: arr } });
    return books;
  },
  getByEmail: async (email) => {
    const t = await Model.findOne({ email: email });
    return t ? t : false;
  },
  create: async (t) => {
    let book = new Model(t);
    book = await book.save();
    return book ? book : false;
  },
  deleteById: async (id) => {
    let t = await Model.findByIdAndDelete(id);
    return t ? true : false;
  },
  update: async (id, obj) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        title: obj.title,
        description: obj.description,
        genre: obj.genre,
        author: obj.author,
        coverUrl: obj.coverUrl,
        year: obj.year,
        count: obj.count,
        isbn: obj?.isbn,
        pages: obj?.pages,
        publisher: obj?.publisher,
        aboutAuthor: obj?.aboutAuthor,
        aboutImageUrl: obj?.aboutImageUrl,
      },
      {
        new: true,
      }
    );
    return t ? t : false;
  },
  getCountByDateRangeAndGenre: async (from, to) => {
    return await Model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(moment(from)),
            $lte: new Date(moment(to)),
          },
        },
      },
      { $project: { genre: { $trim: { input: "$genre" } } } },
      {
        $group: {
          _id: "$genre",
          count: {
            $sum: 1,
          },
        },
      },
    ]);
  },
};

module.exports = Manager;
