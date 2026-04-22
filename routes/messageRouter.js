const express = require("express");
const { Router } = express;
const {
  newMessage,
  deleteMessage,
} = require("../controllers/messageController");
const { isAuthorized } = require("../middlewares/authMiddlewares");

const messageRouter = new Router();

messageRouter.get("/new", isAuthorized, (req, res) => res.render("newMessage"));

messageRouter.post("/new", newMessage);

messageRouter.post("/delete", deleteMessage);

module.exports = messageRouter;
