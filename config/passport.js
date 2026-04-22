const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models/queries");
const bcrypt = require("bcryptjs");

const verifyCallback = async (username, password, done) => {
  const user = await db.findUser(username);
  if (!user) {
    return done(null, false);
  }

  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    return done(null, false);
  } else {
    return done(null, user);
  }
};

const strategy = new LocalStrategy(verifyCallback);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(strategy);
