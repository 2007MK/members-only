const express = require("express");
const { Router } = express;
const { newUser } = require("../controllers/authController");

const authRouter = Router();

authRouter.get("/signup", (req, res) => {
  res.render("signup");
});

authRouter.post("/signup", newUser);

module.exports = authRouter;
