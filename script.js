// Store users data in localStorage (for simplicity, no backend)
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let files = JSON.parse(localStorage.getItem('files')) || [];

// Show login form initially
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const dashboard = document.getElementById('dashboard');
const fileList = document.getElementById('file-list');
const userNameElement = document.getElementById('user-name');
const profileUsername = document.getElementById('profile-username');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-upload');
const editProfileButton = document.getElementById('edit-profile');
const editProfileForm = document.getElementById('edit-profile-form');
const newUsernameInput = document.getElementById('new-username');
const saveProfileButton = document.getElementById('save-profile');

// Check if logged in
if (currentUser) {
  showDashboard();
} else {
  showLogin();
}

// Show Login page
function showLogin() {
  loginSection.style.display = 'block';
  registerSection.style.display = 'none';
  dashboard.style.display = 'none';
}

// Show Registration page
function showRegister() {
  loginSection.style.display = 'none';
  registerSection.style.display = 'block';
  dashboard.style.display = 'none';
}

// Show Dashboard page
function showDashboard() {
  loginSection.style.display = 'none';
  registerSection.style.display = 'none';
  dashboard.style.display = 'block';
  userNameElement.textContent = currentUser.username;
  profileUsername.textContent = `Username: ${currentUser.username}`;
  loadFiles();
}

// Register new user
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  if (users.some(user => user.username === username)) {
    alert('Username already exists!');
  } else {
    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! Please log in.');
    showLogin();
  }
});

// Login user
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showDashboard();
  } else {
    alert('Invalid username or password');
  }
});

// Edit Profile
editProfileButton.addEventListener('click', () => {
  editProfileForm.style.display = 'block';
});

// Save new profile username
saveProfileButton.addEventListener('click', () => {
  const newUsername = newUsernameInput.value;
  currentUser.username = newUsername;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  profileUsername.textContent = `Username: ${newUsername}`;
  editProfileForm.style.display = 'none';
});

// Upload File
uploadBtn.addEventListener('click', () => {
  const file = fileInput.files[0];
  if (file) {
    const fileData = { name: file.name, size: file.size };
    files.push(fileData);
    localStorage.setItem('files', JSON.stringify(files));
    loadFiles();
  } else {
    alert('Please select a file to upload');
  }
});

// Load files
function loadFiles() {
  fileList.innerHTML = '';
  files.forEach((file, index) => {
    const li = document.createElement('li');
    li.textContent = `${file.name} (${file.size} bytes)`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteFile(index));
    li.appendChild(deleteButton);
    fileList.appendChild(li);
  });
}

// Delete File
function deleteFile(index) {
  files.splice(index, 1);
  localStorage.setItem('files', JSON.stringify(files));
  loadFiles();
}

// Show Register link
document.getElementById('register-link').addEventListener('click', (e) => {
  e.preventDefault();
  showRegister();
});

// Show Login link
document.getElementBy
