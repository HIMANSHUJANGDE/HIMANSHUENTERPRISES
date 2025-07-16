// User data is stored in localStorage
const usersKey = 'users';
const currentUserKey = 'currentUser';

// DOM Elements
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

// Load user data from localStorage
function loadUsers() {
    const users = JSON.parse(localStorage.getItem(usersKey)) || [];
    return users;
}

// Save user data to localStorage
function saveUsers(users) {
    localStorage.setItem(usersKey, JSON.stringify(users));
}

// Register functionality
registerBtn.addEventListener("click", function () {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        registerError.textContent = "Passwords do not match.";
        return;
    }

    const users = loadUsers();
    if (users.some(user => user.username === username)) {
        registerError.textContent = "Username already taken.";
        return;
    }

    users.push({ username, password, files: [] });
    saveUsers(users);

    registerContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
});

// Show the registration form
showRegisterBtn.addEventListener("click", function () {
    loginContainer.classList.add("hidden");
    registerContainer.classList.remove("hidden");
});

// Go back to login from registration
backToLoginBtn.addEventListener("click", function () {
    registerContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
});

// Login functionality
loginBtn.addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem(currentUserKey, JSON.stringify(currentUser));

        loginContainer.classList.add("hidden");
        fileDashboardContainer.classList.remove("hidden");

        loadFileList();
    } else {
        loginError.textContent = "Invalid credentials. Please try again.";
    }
});

// Logout functionality
logoutBtn.addEventListener("click", function () {
    localStorage.removeItem(currentUserKey);
    loginContainer.classList.remove("hidden");
    fileDashboardContainer.classList.add("hidden");
});

// Change password functionality
changePasswordBtn.addEventListener("click", function () {
    const newPassword = document.getElementById("new-password").value;
    const confirmNewPassword = document.getElementById("confirm-new-password").value;

    if (newPassword !== confirmNewPassword) {
        changePasswordError.textContent = "Passwords do not match.";
        return;
    }

    const users = loadUsers();
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        saveUsers(users);
        currentUser.password = newPassword;
        localStorage.setItem(currentUserKey, JSON.stringify(currentUser));

        changePasswordContainer.classList.add("hidden");
        fileDashboardContainer.classList.remove("hidden");
    }
});

// Back to file dashboard from change password
backToDashboardBtn.addEventListener("click", function () {
    changePasswordContainer.classList.add("hidden");
    fileDashboardContainer.classList.remove("hidden");
});

// Upload file functionality
uploadBtn.addEventListener("click", function () {
    const
