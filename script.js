// app.js

// Dummy user data for login validation
const validUsers = {
    "user1": "password123",
    "admin": "adminpass"
};

let currentUser = null;
let fileStorage = JSON.parse(localStorage.getItem('files')) || [];

// Handle user login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    
    if (validUsers[username] && validUsers[username] === password) {
        currentUser = username;
        localStorage.setItem('currentUser', currentUser);
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('file-management').style.display = 'block';
        document.getElementById('username-display').textContent = currentUser;
        displayFiles();
    } else {
        errorElement.textContent = "Invalid username or password.";
    }
}

// Handle user logout
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    document.getElementById('file-management').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Upload file
function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (file) {
        const fileObj = {
            name: file.name,
            size: file.size,
            date: new Date().toLocaleString()
        };

        fileStorage.push(fileObj);
        localStorage.setItem('files', JSON.stringify(fileStorage));
        fileInput.value = '';
        displayFiles();
    }
}

// Display files
function displayFiles() {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    
    fileStorage.forEach((file, index) => {
        const li = document.createElement('li');
        li.textContent = `${file.name} (${file.size} bytes) - Uploaded on ${file.date}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteFile(index);
        
        li.appendChild(deleteBtn);
        fileList.appendChild(li);
    });
}

// Delete file
function deleteFile(index) {
    fileStorage.splice(index, 1);
    localStorage.setItem('files', JSON.stringify(fileStorage));
    displayFiles();
}

// Initialize user session
(function checkUserSession() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = storedUser;
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('file-management').style.display = 'block';
        document.getElementById('username-display').textContent = currentUser;
        displayFiles();
    }
})();
