const pool = require("../config/database");

async function newUser({ fname, lname, username, password }) {
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

async function findUserById(id) {
  const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return user.rows[0];
}

async function newMessage({ title, message, userId }) {
  const query =
    "INSERT INTO messages (title, message, user_id) VALUES ($1, $2, $3)";
  await pool.query(query, [title, message, userId]);
}

async function getMessages() {
  const query = `
  SELECT messages.*, users.username
  FROM messages
  LEFT JOIN users ON messages.user_id = users.id;`;
  const messages = await pool.query(query);
  return messages.rows;
}

async function deleteMessage(messageId) {
  const query = `
  DELETE FROM messages WHERE id = $1`;
  await pool.query(query, [messageId]);
}

async function newMember(id) {
  const query = `
  UPDATE users
  SET ismember = true 
  WHERE id = $1`;
  await pool.query(query, [id]);
}

module.exports = {
  findUser,
  findUserById,
  newUser,
  getMessages,
  newMessage,
  newMember,
  deleteMessage,
};
