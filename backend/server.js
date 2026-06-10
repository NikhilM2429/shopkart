const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

require("dotenv").config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */
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

console.log("RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID);
console.log(
  "RAZORPAY_KEY_SECRET =",
  process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Missing"
);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* =========================
   CREATE ORDER
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
    res.status(500).json({
      success: false,
      error: "Order creation failed"
    });
  }
});

/* =========================
   VERIFY PAYMENT
========================= */
app.post("/api/payment/verify", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({
        success: true,
        message: "Payment Verified"
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid Signature"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Verification failed"
    });
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
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});