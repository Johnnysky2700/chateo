// Core modules
const http = require("http");
const fs = require("fs");
const path = require("path");

// NPM modules
const express = require("express");
const cors = require("cors");
const multer = require("multer");

// Initialize express
const app = express();
app.use(cors());
app.use(express.json());

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
