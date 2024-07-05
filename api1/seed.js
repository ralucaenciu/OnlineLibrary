require("dotenv").config();
const mongoose = require("mongoose");
const adminManager = require("./managers/user");
const crypto = require("./utils/crypto");

const admins = [
  {
    name: "Admin",
    email: "admin@gmail.com",
    password: "admin",
    type: "admin",
    active: true,
  },
];

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("Connected with MongoDB for Seeding."))
  .catch((err) =>
    console.log(`Unable to connect with MongoDB: ${err.message}`)
  );

const saveAdmins = () =>
  new Promise(async (resolve, reject) => {
    await adminManager.deleteAllAdmins();
    for (let i = 0; i < admins.length; i++) {
      let t = admins[i];
      await adminManager.create({
        name: t.name,
        email: t.email,
        type: t.type,
        active: t.active,
        password: await crypto.hash(t.password),
      });
    }
    resolve();
  });

(async () => {
  await saveAdmins();
  console.log("Seeding completed.\nDisconnected.");
  mongoose.disconnect();
})();
