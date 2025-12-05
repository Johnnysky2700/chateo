const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// ------------------ MIDDLEWARE ------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------ CORS ------------------
app.use(
  cors({
    origin: ["https://chateo-app.netlify.app"], // your frontend
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

// ------------------ STATIC FILES ------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ MULTER ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "uploads");
    if (!require("fs").existsSync(dir)) require("fs").mkdirSync(dir);
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
  res.json({ message: "File uploaded successfully", file: req.file });
});

// ------------------ MONGODB ------------------
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

// ------------------ NODEMAILER (Vercel friendly) ------------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Gmail App Password
  },
});

// ------------------ OTP ------------------
// Request OTP
app.post("/request-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });
    if (!user) user = new User({ email: normalizedEmail });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    try {
      await transporter.sendMail({
        from: `"Chateo App" <${process.env.MAIL_USER}>`,
        to: normalizedEmail,
        subject: "Your OTP Code",
        html: `<h1>${otp}</h1><p>This OTP expires in 5 minutes.</p>`,
      });
    } catch (mailError) {
      console.error("❌ EMAIL ERROR:", mailError);
      return res.status(500).json({ error: "Email not sent", details: mailError.message });
    }

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("❌ OTP ERROR:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (Date.now() > user.otpExpires) return res.status(400).json({ error: "OTP expired" });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("❌ VERIFY OTP ERROR:", err);
    res.status(500).json({ error: "Verification error" });
  }
});

// ------------------ CONTACTS ------------------
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await User.find({}, "-otp -otpExpires"); // exclude OTP fields
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// ------------------ TEST ------------------
app.get("/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

// ------------------ ROOT ------------------
app.get("/", (req, res) => res.send("<h1>Backend running successfully</h1>"));

// ------------------ 404 ------------------
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// ------------------ EXPORT FOR VERCEL ------------------
module.exports = app;
