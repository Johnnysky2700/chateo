// Core modules
const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();

// Initialize express
const app = express();

// ------------------ MIDDLEWARE ------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------ CORS ------------------
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://chateo-app.netlify.app", // your real frontend UI
    ],
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

// Logging middleware
app.use((req, res, next) => {
  console.log(`🟦 [REQUEST] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📦 Request body:", req.body);
  }
  next();
});

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ------------------ UPLOAD ROUTE ------------------
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No file uploaded" });

  res.json({
    message: "File uploaded successfully",
    file: req.file,
  });
});

// ------------------ MONGODB SETUP ------------------
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  phone: String,
  avatar: String,
  address: String,
  country: String,
  otp: String,
  otpExpires: Date,
});
const User = mongoose.model("User", UserSchema);

// ------------------ NODEMAILER SETUP (Render compatible) ------------------
// ❗ DO NOT USE: service: "gmail" → Render will block it
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // must be a Gmail app password
  },
});

// ------------------ REQUEST OTP ------------------
app.post("/request-otp", async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ error: "Email is required" });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) user = new User({ email: normalizedEmail });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Attempt sending the OTP email
    try {
      await transporter.sendMail({
        from: `"Chateo App" <${process.env.MAIL_USER}>`,
        to: normalizedEmail,
        subject: "Your OTP Code",
        html: `<h1>${otp}</h1><p>This OTP expires in 5 minutes.</p>`,
      });
    } catch (mailError) {
      console.error("❌ EMAIL ERROR:", mailError);
      return res.status(500).json({
        error: "Email not sent",
        details: mailError.message,
      });
    }

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("❌ OTP SEND ERROR:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ------------------ VERIFY OTP ------------------
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ error: "Email and OTP required" });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (Date.now() > user.otpExpires)
      return res.status(400).json({ error: "OTP expired" });

    // Clear OTP
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("❌ OTP VERIFY ERROR:", err);
    res.status(500).json({ error: "Verification error" });
  }
});

// ------------------ CONTACTS API ------------------
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await User.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// ------------------ TEST ROUTE ------------------
app.get("/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

// ------------------ ROOT ------------------
app.get("/", (req, res) => {
  res.send("<h1>Backend running successfully</h1>");
});

// ------------------ CATCH ALL 404 ------------------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on port ${PORT}`)
);
