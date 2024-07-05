const Model = require("../models/user");
const moment = require("moment");
const { v4: uuid } = require("uuid");

const Manager = {
  deleteAllAdmins: async () => {
    await Model.deleteMany({ type: "admin" });
    return true;
  },
  getAll: async (keyword) => {
    let query = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
      ],
      type: "user",
    };

    let t = await Model.find(query).sort({ createdAt: -1 });
    return t;
  },
  getCount: async () => {
    return await Model.countDocuments({ type: "user", active: true });
  },
  getById: async (id) => {
    let user = await Model.findById(id);
    return user;
  },
  getByEmail: async (email) => {
    const t = await Model.findOne({ email: email });
    return t ? t : false;
  },
  create: async (t) => {
    let user = new Model(t);
    user = await user.save();
    return user ? user : false;
  },
  updatePassword: async (id, obj) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        password: obj.password,
      },
      {
        new: true,
      }
    );
    return t ? t : false;
  },
  update: async (id, obj) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        name: obj.name,
        phone: obj.phone,
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
  updatePicture: async (id, obj) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        imageUrl: obj.imageUrl,
      },
      {
        new: true,
      }
    );
    return t ? t : false;
  },
  updateActiveStatus: async (id, newStatus) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        active: newStatus,
      },
      {
        new: true,
      }
    );

    return t ? t : false;
  },
  setTempPassword: async (email) => {
    const tempPassword = uuid();
    await Model.findOneAndUpdate(
      { email: email },
      {
        tempPassword: tempPassword,
      },
      {
        new: true,
      }
    );

    return tempPassword;
  },
  getByTempPassword: async (token) => {
    return await Model.findOne({ tempPassword: token });
  },
  delete: async (id) => {
    let t = await Model.findByIdAndDelete(id);
    return t ? true : false;
  },
  addFavourite: async (id, data) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        $addToSet: { favourites: data },
      },
      { new: true }
    );
    return t ? t : false;
  },
  removeFavourite: async (id, data) => {
    let t = await Model.findByIdAndUpdate(
      id,
      {
        $pull: { favourites: data },
      },
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
          type: "user",
          active: true,
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
};

module.exports = Manager;
