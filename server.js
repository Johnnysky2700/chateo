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

// Firebase Admin (optional)
const adminExists = fs.existsSync(path.join(__dirname, "firebaseServiceAccount.json"));
let admin;
if (adminExists) {
  try {
    admin = require("firebase-admin");
    const serviceAccount = require("./firebaseServiceAccount.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized");
  } catch (err) {
    console.warn("⚠️ Failed to initialize Firebase Admin:", err);
    admin = null;
  }
}

// Initialize express
const app = express();
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`🟦 [REQUEST] ${req.method} ${req.url}`);
  if (req.body) console.log("📦 Request body:", req.body);
  next();
});

// Static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("File uploaded:", req.file);
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ message: "File uploaded successfully", file: req.file });
});

// Optional test endpoint
app.get("/data", (req, res) => {
  res.json({ name: "Sky", job: "Website", age: 26 });
});

// ------------------ Firebase token login ------------------
if (admin) {
  let usersMemory = []; // in-memory users (replace with DB as needed)

  app.post("/verify-login", async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Missing token" });

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { uid, phone_number } = decodedToken;

      let user = usersMemory.find((u) => u.uid === uid);
      if (!user) {
        user = { uid, phone: phone_number, createdAt: new Date().toISOString() };
        usersMemory.push(user);
        console.log("🆕 New user created:", user);
      } else {
        console.log("✅ Existing user verified:", user);
      }

      res.json({ user });
    } catch (error) {
      console.error("❌ Error verifying token:", error);
      res.status(401).json({ error: "Invalid or expired token" });
    }
  });
}

// ------------------ MongoDB Setup ------------------
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
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

// ------------------ Nodemailer Setup ------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});

// ------------------ OTP Endpoints ------------------

// Request OTP
app.post("/request-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required for OTP" });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });
    if (!user) user = new User({ email: normalizedEmail });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min expiry
    await user.save();

    await transporter.sendMail({
      from: `"WhatsApp Clone" <${process.env.MAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your Login OTP",
      text: `Your OTP is: ${otp}`,
      html: `<h2>Your OTP is:</h2> <h1>${otp}</h1>`,
    });

    console.log("📨 OTP sent to:", normalizedEmail);
    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("❌ OTP email error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    // Auto-create user if not exists
    if (!user) {
      user = new User({ email: normalizedEmail });
      await user.save();
    }

    if (!user.otp || user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (Date.now() > user.otpExpires) return res.status(400).json({ error: "OTP expired" });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    console.log(`✅ LOGIN SUCCESSFUL: ${normalizedEmail}`);
    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("❌ OTP verification error:", error);
    res.status(500).json({ error: "OTP verification error" });
  }
});

// ------------------ Users Endpoint (JSON-server style) ------------------
app.get("/users", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.json([]); // return empty array if not found
    res.json([user]); // return as array to match JSON-server
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

// ------------------ Get user by ID ------------------
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    res.status(500).json({ error: "Error fetching user" });
  }
});

// ------------------ Update user by ID ------------------
app.patch("/user/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ error: "Update failed" });
  }
});

// ------------------ Root ------------------
app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "index.html");
  if (fs.existsSync(indexPath)) res.sendFile(indexPath);
  else res.send("<h1>Server is running</h1>");
});

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
