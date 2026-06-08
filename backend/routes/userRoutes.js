const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/test", (req, res) => {
  res.json({ message: "User routes working" });
});

module.exports = router;