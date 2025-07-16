// Hardcoded users for simulation
const users = [
    { username: "user1", password: "password1", files: [] },
    { username: "user2", password: "password2", files: [] },
];

// DOM elements
const loginContainer = document.getElementById("login-container");
const registerContainer = document.getElementById("register-container");
const fileDashboardContainer = document.getElementById("file-dashboard-container");
const changePasswordContainer = document.getElementById("change-password-container");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const uploadBtn = document.getElementById("upload-btn");
const fileList = document.getElementById("file-list");
const logoutBtn = document.getElementById("logout-btn");
const changePasswordBtn = document.getElementById("change-password-btn");
const backToLoginBtn = document.getElementById("back-to-login");
const backToDashboardBtn = document.getElementById("back-to-dashboard");
const showRegisterBtn = document.getElementById("show-register");
const registerError = document.getElementById("register-error");
const loginError = document.getElementById("login-error");
const changePasswordError = document.getElementById("change-password-error");

let currentUser = null;

// User Registration
registerBtn.addEventListener("click", function() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        registerError.textContent = "Passwords do not match.";
        return;
    }

    // Check if user already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        registerError.textContent = "Username already taken.";
        return;
    }

    // Add user
    users.push({ username, password, files: [] });
    localStorage.setItem("users", JSON.stringify(users));
    registerContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
});

// Show registration form
showRegisterBtn.addEventListener("click", function() {
    loginContainer.classList.add("hidden");
    registerContainer.classList.remove("hidden");
});

// Back to login from register
backToLoginBtn.addEventListener("click", function() {
    registerContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
});

// Login functionality
loginBtn.addEventListener("click", function() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        loginContainer.classList.add("hidden");
        fileDashboardContainer.classList.remove("hidden");

        loadFileList();
    } else {
        loginError.textContent = "Invalid credentials. Please try again.";
    }
});

// Logout functionality
logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("currentUser");

    loginContainer.classList.remove("hidden");
    fileDashboardContainer.classList.add("hidden");
});

// File upload
uploadBtn.addEventListener("click", function() {
    const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileData = {
                name: file.name,
                content: event.target.result
            };

            currentUser.files.push(fileData);
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            loadFileList();
        };
        reader.readAsText(file);
    }
});

// Load file list
function loadFileList() {
    fileList.innerHTML = "";
    currentUser.files.forEach((file, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${file.name} <button onclick="downloadFile(${index})">Download</button> <button onclick="deleteFile(${index})">Delete</button>`;
        fileList.appendChild(li);
    });
}

// File download
function downloadFile(index) {
    const file = currentUser.files[index];
    const blob = new Blob([file.content], { type: 'text/plain' });
    const link = document.createElement("a");
   
