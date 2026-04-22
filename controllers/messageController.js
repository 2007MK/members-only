const { matchedData, validationResult, body } = require("express-validator");
const db = require("../models/queries");

const validateMessage = [
  body("title")
    .escape()
    .isLength({ min: 3, max: 25 })
    .withMessage("Please give a smaller title"),
  body("message")
    .escape()
    .isLength({ min: 3, max: 200 })
    .withMessage("Message should be between 3 and 200 characters."),
];

async function newMessage(req, res) {
  const { title, message } = matchedData(req);
  const userId = req.user.id;
  try {
    await db.newMessage({ title, message, userId });
  } catch (error) {
    throw error;
  }
  res.redirect("/");
}

module.exports.getMessages = async (req, res) => {
  const messages = await db.getMessages();
  res.render("index", { messages });
};

module.exports.newMessage = [
  validateMessage,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("newMessage", {
        errors: errors.array(),
        formData: req.body,
      });
    }
    next();
  },
  newMessage,
];
