const express = require("express");
const { Router } = express;
const {
  newUser,
  login,
  logout,
  newMember,
} = require("../controllers/authController");
const passport = require("passport");
const {
  isAuthorized,
  isNotAuthorized,
} = require("../middlewares/authMiddlewares");
const { getMessages } = require("../controllers/messageController");

const authRouter = Router();

authRouter.get("/", getMessages);

authRouter.get("/signup", isNotAuthorized, (req, res) => res.render("signup"));

authRouter.get("/login", isNotAuthorized, (req, res) => res.render("login"));

authRouter.post("/signup", newUser);
authRouter.post("/login", login);

authRouter.get("/logout", logout);

authRouter.get("/join", (req, res) => res.render("newMember"));
authRouter.post("/join", newMember);

authRouter.get("/admin", (req, res) => res.render("admin"));

module.exports = authRouter;
