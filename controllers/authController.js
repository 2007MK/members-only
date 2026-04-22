const bcrypt = require("bcryptjs");
const db = require("../models/queries");
const { body, validationResult, matchedData } = require("express-validator");
const passport = require("passport");

const alphaError = "must contain only letter";
const lenError = "must be between 1 and 10 characters";

const validateNewUser = [
  body("fname")
    .trim()
    .isAlpha()
    .withMessage("First name must contain only letters")
    .isLength({ min: 1, max: 10 })
    .withMessage("First name must be 1–10 characters"),

  body("lname")
    .optional({ checkFalsy: true })
    .trim()
    .isAlpha()
    .withMessage("Last name must contain only letters")
    .isLength({ min: 1, max: 10 })
    .withMessage("Last name must be 1–10 characters"),

  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be 3–20 characters")
    .custom(async (value) => {
      const user = await db.findUser(value.toLowerCase());
      if (user) throw new Error("Username already exists");
    })
    .customSanitizer((value) => (value = value.toLowerCase())),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match!");
    }
    return true;
  }),
];

const validateLogin = [
  body("username").trim().notEmpty().withMessage("Username required"),
  body("password").notEmpty().withMessage("Password required"),
];

async function newUser(req, res) {
  const { fname, lname, username, password } = matchedData(req);
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    fname,
    lname,
    username,
    isadmin: req.body.isadmin == "yes",
    password: hashedPassword,
  };
  console.log(user);
  try {
    await db.newUser(user);
    res.send("User created succesfully! <a href = '/'>Go to Homepage</a");
  } catch (error) {
    throw error;
  }
}

module.exports.newUser = [
  validateNewUser,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        errors: errors.array(),
        formData: req.body,
      });
    }
    next();
  },
  newUser,
];

module.exports.login = [
  validateLogin,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        errors: errors.array(),
      });
    }
    next();
  },
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  }),
];

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

module.exports.newMember = [
  [body("secret_phrase").escape()],
  async (req, res) => {
    const { secret_phrase } = req.body;
    if (secret_phrase.toLowerCase() == process.env.SECRET_PHRASE) {
      await db.newMember(req.user.id);
      return res.send(
        "Congratulations on becoming the member! <a href = '/'>Return to Homepage</a>",
      );
    } else {
      return res.render("newMember", {
        message: "Oops thats the wrong phrase!",
      });
    }
  },
];
