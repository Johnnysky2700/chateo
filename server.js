const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json()); // for normal JSON APIs

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file); // See uploaded file info
  res.json({ message: "File uploaded successfully", file: req.file });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
