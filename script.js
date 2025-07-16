// Constants for localStorage keys
const usersKey = 'users';
const currentUserKey = 'currentUser';

// DOM Elements
const loginContainer = document.getElementById("login-container");
const registerContainer = document.getElementById("register-container");
const profileContainer = document.getElementById("profile-container");
const fileDashboardContainer = document.getElementById("file-dashboard-container");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const uploadBtn = document.getElementById("upload-btn");
const fileList = document.getElementById("file-list");
const logoutBtn = document.getElementById("logout-btn");
const profileBtn = document.getElementById("profile-btn");
const updateProfileBtn = document.getElementById("update-profile-btn");
const backToLoginBtn = document.getElementById("back-to-login");
const backToDashboardFromProfileBtn = document.getElementById("back-to-dashboard-from-profile");
const showRegisterBtn = document.getElementById("show-register");
const registerError = document.getElementById("register-error");
const loginError = document.getElementById("login-error");
const profileError = document.getElementById("profile-error");

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

// Show profile management section
profileBtn.addEventListener("click", function () {
    fileDashboardContainer.classList.add("hidden");
    profileContainer.classList.remove("hidden");

    document.getElementById("new-username").value = currentUser.username;
});

// Back to dashboard from profile
backToDashboardFromProfileBtn.addEventListener("click", function () {
    profileContainer.classList.add("hidden");
    fileDashboardContainer.classList.remove("hidden");
});

// Update profile information (username & password)
updateProfileBtn.addEventListener("click", function () {
    const newUsername = document.getElementById("new-username").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmNewPassword = document.getElementById("confirm-new-password").value;

    if (newPassword !== confirmNewPassword) {
        profileError.textContent = "Passwords do not match.";
        return;
    }

    const users = loadUsers();
    const userIndex = users.findIndex(u => u.username === currentUser.username);

    if (userIndex !== -1) {
        users[userIndex].username = newUsername;
       
