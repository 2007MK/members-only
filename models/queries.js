const pool = require("../config/database");

async function newUser({
  fname,
  lname,
  username,
  password,
  isMember,
  isAdmin,
}) {
  await pool.query(
    "INSERT INTO users (fname, lname, username, password) VALUES ($1, $2, $3, $4)",
    [fname, lname, username, password],
  );
}

async function findUser(username) {
  const user = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return user.rows[0];
}

module.exports = { findUser, newUser };
