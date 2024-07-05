const router = require("express").Router();
const userValidations = require("../validations/user");
const getErrorDetails = require("../utils/error-details");
const auth = require("../middlewares/auth");
const userManager = require("../managers/user");
const bookManager = require("../managers/book");
const crypto = require("../utils/crypto");
const utils = require("../utils/utils");
const tokens = require("../utils/tokens");
const emailManager = require("../managers/email");

router.post("/signup", async (req, res) => {
  try {
    const error = userValidations.signup(req.body).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    let user = await userManager.getByEmail(req.body.email);
    if (user)
      return res
        .status(400)
        .send(
          `E-mailul există deja, vă rugăm să alegeți o altă adresă de e-mail.`
        );

    const obj = {
      ...req.body,
      password: await crypto.hash(req.body.password),
    };

    user = await userManager.create(obj);

    const link = `${process.env.ACTIVATE_ACCOUNT_URL}?token=${user._id}`;
    let html = await utils.readTemplate(`activate`);
    html = utils.replaceAll(`{{appName}}`, process.env.APP_NAME, html);
    html = utils.replaceAll(`{{link}}`, link, html);
    await emailManager.send({
      to: req.body.email,
      subject: "Verificati-va adresa de email",
      html: html,
    });

    return res.status(200).send(true);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/activate", async (req, res) => {
  try {
    const error = userValidations.activate(req.body).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    let user = await userManager.getById(req.body.token);
    if (!user)
      return res
        .status(400)
        .send(`Activare cont invalid cu token-ul furnizat.`);

    user = await userManager.updateActiveStatus(req.body.token, true);

    let html = await utils.readTemplate(`welcome`);
    html = utils.replaceAll(`{{name}}`, user.name, html);
    html = utils.replaceAll(`{{appName}}`, process.env.APP_NAME, html);
    emailManager.send({
      to: user.email,
      subject: `Bine ai venit pe  ${process.env.APP_NAME}`,
      html: html,
    });

    return res.status(200).json(true);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const error = userValidations.login(req.body).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    const user = await userManager.getByEmail(req.body.email);
    if (!user) return res.status(400).send(`Nu există user cu acest email.`);

    const passwordMatches = await crypto.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatches)
      return res.status(400).send(`Parola nu se potrivește.`);

    if (user.active === false)
      return res
        .status(400)
        .send(
          `Utilizatorul nu este activ. Vă rugăm să activați contul prin email.`
        );

    const token = await tokens.getJwt(user._id);
    const result = {
      token: token,
      user: user,
    };
    return res.status(200).send(result);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const error = userValidations.forgotPassword(req.body).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    const user = await userManager.getByEmail(req.body.email);
    if (!user) return res.status(400).send(`Nu există user cu acest email.`);

    const temp = await userManager.setTempPassword(req.body.email);
    const link = `${process.env.RESET_PASSWORD_URL}?token=${temp}`;
    let html = await utils.readTemplate(`forgot-password`);
    html = utils.replaceAll(`{{appName}}`, process.env.APP_NAME, html);
    html = utils.replaceAll(`{{link}}`, link, html);
    await emailManager.send({
      to: req.body.email,
      subject: "Resetează-ți parola",
      html: html,
    });

    return res.status(200).send(true);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const error = userValidations.resetPassword(req.body).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    let user = await userManager.getByTempPassword(req.body.token);
    if (!user)
      return res
        .status(400)
        .send(`Parolă invalidă, resetează token-ul furnizat.`);

    const obj = { password: await crypto.hash(req.body.newPassword) };

    user = await userManager.updatePassword(user._id, obj);

    let html = await utils.readTemplate(`reset-password`);
    html = utils.replaceAll(`{{name}}`, user.name, html);
    html = utils.replaceAll(`{{appName}}`, process.env.APP_NAME, html);
    emailManager.send({
      to: user.email,
      subject: "Parolă resetată.",
      html: html,
    });

    return res.status(200).send(true);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/update-password", auth, async (req, res) => {
  try {
    const error = userValidations.updatePassword(req.body).error;
    if (error) return res.status(400).send(getErrorDetails(error));

    let user = await userManager.getById(req.tokenData.userId);
    const passwordMatches = await crypto.compare(
      req.body.currentPassword,
      user.password
    );
    if (!passwordMatches)
      return res.status(400).send(`Parolă curentă greșită.`);

    const encryptedPassword = await crypto.hash(req.body.newPassword);
    user = await userManager.updatePassword(req.tokenData.userId, {
      password: encryptedPassword,
    });
    return res.status(200).send(true);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/update-picture", auth, async (req, res) => {
  try {
    let user = await userManager.updatePicture(req.tokenData.userId, req.body);
    return res.status(200).send(user);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/update", auth, async (req, res) => {
  try {
    let user = await userManager.update(req.tokenData.userId, req.body);
    return res.status(200).send(user);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/add-favourite", auth, async (req, res) => {
  try {
    let user = await userManager.addFavourite(
      req.tokenData.userId,
      req.body.id
    );
    return res.status(200).send(user);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/remove-favourite", auth, async (req, res) => {
  try {
    let user = await userManager.removeFavourite(
      req.tokenData.userId,
      req.body.id
    );
    return res.status(200).send(user);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

router.post("/get-favourite", auth, async (req, res) => {
  try {
    let user = await userManager.getById(req.tokenData.userId);
    let arr = user?.favourites || [];
    let favs = await bookManager.getByIds(arr);
    return res.status(200).send(favs);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
});

module.exports = router;
