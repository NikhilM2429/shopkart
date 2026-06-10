const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// USER ROUTES (YOUR EXISTING)
// =====================
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   USER ROUTES
========================= */
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

/* =========================
   RAZORPAY INIT
========================= */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* =========================
   CREATE ORDER (PAYMENT)
========================= */
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const amount = req.body.amount;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Order creation failed" });
  }
});

/* =========================
   VERIFY PAYMENT (SECURE)
========================= */
app.post("/api/payment/verify", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({
        success: true,
        message: "Payment Verified ✅"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid Signature ❌"
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Verification failed" });
  }
});

/* =========================
   HOME ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend Working 🚀");
});

/* =========================
   START SERVER
========================= */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});