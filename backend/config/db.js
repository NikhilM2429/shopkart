const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306
});

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL NOT Connected");
    console.error(err);
  } else {
    console.log("✅ MySQL Connected Successfully");
  }
});

module.exports = db;