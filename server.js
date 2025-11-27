// Core modules
const http = require("http");
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

// Load service account credentials (download from Firebase console)
const serviceAccount = require("./firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// NPM modules
const express = require("express");
const cors = require("cors");
const multer = require("multer");

// Initialize express
const app = express();
app.use(cors());
app.use(express.json());

// Logging middleware – logs every request hitting your backend
app.use((req, res, next) => {
  console.log(`🟦 [REQUEST] ${req.method} ${req.url}`);
  if (req.body) {
    console.log("📦 Request body:", req.body);
  }
  next();
});


// Static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("./public"));

// === Multer storage setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// === Upload endpoint ===
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("File uploaded:", req.file);
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    file: {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  });
});

// === Optional test endpoint ===
app.get("/data", (req, res) => {
  const myObj = {
    name: "Sky",
    job: "Website",
    age: 26,
  };
  res.json(myObj);
});

// === 🚀 Verify Login Endpoint (Firebase OTP Integration) ===
let users = []; // temporary memory store; replace with DB or json-server later

app.post("/verify-login", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, phone_number } = decodedToken;

    // Check if user exists in our memory
    let user = users.find((u) => u.uid === uid);

    if (!user) {
      // Create new user record
      user = {
        uid,
        phone: phone_number,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
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

// === Serve index.html ===
app.get("/", (req, res) => {
  fs.readFile(__dirname + "/index.html", "utf8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading index.html");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    }
  });
});

// === Create and start HTTP server ===
const server = http.createServer(app);
const PORT = 5000;

server.listen(PORT, "127.0.0.1", () => {
  console.log(`✅ Server running at http://127.0.0.1:${PORT}`);
});
