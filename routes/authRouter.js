const express = require("express");
const { Router } = express;
const { newUser, login, logout } = require("../controllers/authController");
const passport = require("passport");
const {
  isAuthorized,
  isNotAuthorized,
} = require("../middlewares/authMiddlewares");

const authRouter = Router();

authRouter.get("/", (req, res) => {
  res.render("index");
});

authRouter.get("/signup", isNotAuthorized, (req, res) => {
  res.render("signup");
});

authRouter.get("/login", isNotAuthorized, (req, res) => {
  res.render("login");
});

authRouter.post("/signup", newUser);
authRouter.post("/login", login);

authRouter.get("/logout", logout);

module.exports = authRouter;
