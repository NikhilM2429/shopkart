const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Nikhil123",   // ⚠️ most MySQL80 setups use empty password
  database: "shopkart",
  waitForConnections: true,
  connectionLimit: 10
});

// TEST CONNECTION
db.getConnection((err, connection) => {
  if (err) {
    console.log("❌ MySQL NOT Connected");
    console.log(err.message);
  } else {
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  }
});

module.exports = db;