const bcrypt = require("bcryptjs");
const db = require("../models/queries");
const { body, validationResult, matchedData } = require("express-validator");

async function newUser(req, res) {
  const { fname, lname, username, password } = matchedData(req);
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { fname, lname, username, password: hashedPassword };
  try {
    await db.newUser(user);
    res.send("User created succesfully!");
  } catch (error) {
    throw error;
  }
}

const alphaError = "must contain only letter";
const lenError = "must be between 1 and 10 characters";

const validateUser = [
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
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be 3–20 characters")
    .custom(async (value) => {
      const user = await db.findUser(value);
      if (user) throw new Error("Username already exists");
    }),

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

module.exports.newUser = [
  validateUser,
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
