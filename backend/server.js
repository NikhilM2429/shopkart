const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend Working 🚀");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});