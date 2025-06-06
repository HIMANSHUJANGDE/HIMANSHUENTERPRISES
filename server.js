const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Setup database
const db = new sqlite3.Database("./database.db");
db.run(`CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  path TEXT,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Serve static frontend
app.use(express.static("public"));

// File storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  db.run(
    "INSERT INTO files (name, path) VALUES (?, ?)",
    [file.originalname, file.filename],
    function (err) {
      if (err) {
        return res.status(500).send("DB Error");
      }
      res.sendStatus(200);
    }
  );
});

// List files
app.get("/files", (req, res) => {
  db.all("SELECT id, name FROM files ORDER BY uploaded_at DESC", [], (err, rows) => {
    if (err) return res.status(500).send("DB error");
    res.json(rows);
  });
});

// Download endpoint
app.get("/download/:id", (req, res) => {
  const fileId = req.params.id;
  db.get("SELECT * FROM files WHERE id = ?", [fileId], (err, row) => {
    if (err || !row) return res.status(404).send("File not found");
    const filePath = path.join(__dirname, "uploads", row.path);
    res.download(filePath, row.name);
  });
});

app.listen(port, () => {
  if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
  console.log(`Server running at http://localhost:${port}`);
});
