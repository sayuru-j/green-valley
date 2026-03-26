const mysql = require("mysql2");
const config = require("./config");

const db = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("MySQL Connected");
    connection.release();
  }
});

module.exports = db;
