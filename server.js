const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');
const session = require('express-session');

const app = express();
const PORT = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const data = await fs.readFile('users.json');
  const users = JSON.parse(data);

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = username;
    res.redirect('/');
  } else {
    res.redirect('/login.html?error=1');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login.html'));
});

// Auth middleware
function auth(req, res, next) {
  if (!req.session.user) return res.redirect('/login.html');
  next();
}

// Serve dashboard
app.get('/', auth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload
app.post('/upload', auth, upload.single('file'), (req, res) => {
  res.redirect('/');
});

// List files
app.get('/files', auth, async (req, res) => {
  const files = await fs.readdir('./uploads');
  res.json(files);
});

// Delete file
app.post('/delete', auth, async (req, res) => {
  const { filename } = req.body;
  await fs.unlink(path.join(__dirname, 'uploads', filename));
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
