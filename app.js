const express = require("express");
const app = express();
require("dotenv").config();
const authRouter = require("./routes/authRouter");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.errors = [];
  res.locals.formData = [];
  next();
});
app.use("/", authRouter);

app.listen(3000, (error) => {
  if (error) throw error;
  console.log("Server Started Succesfully!");
});
