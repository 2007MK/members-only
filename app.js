const express = require("express");
const app = express();
const session = require("express-session");
require("dotenv").config();
const authRouter = require("./routes/authRouter");
const passport = require("passport");
const pool = require("./config/database");
const pgStore = require("connect-pg-simple")(session);
require("./config/passport");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.errors = [];
  res.locals.formData = {};
  next();
});

const sessionStore = new pgStore({
  pool: pool,
  createTableIfMissing: true,
});

app.use(
  session({
    secret: "lion",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use(passport.session());

// For easy access in all the views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", authRouter);

app.listen(3000, (error) => {
  if (error) throw error;
  console.log("Server Started Succesfully!");
});
