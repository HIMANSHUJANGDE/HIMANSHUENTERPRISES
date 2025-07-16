// Hardcoded users for simulation
const users = [
    { username: "user1", password: "password1" },
    { username: "user2", password: "password2" },
];

// DOM elements
const loginContainer = document.getElementById("login-container");
const fileDashboardContainer = document.getElementById("file-dashboard-container");
const loginBtn = document.getElementById("login-btn");
const createFileBtn = document.getElementById("create-file-btn");
const fileList = document.getElementById("file-list");
const logoutBtn = document.getElementById("logout-btn");
const loginError = document.getElementById("login-error");

// Login functionality
loginBtn.addEventListener("click", function() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Store the logged-in user's username in localStorage
        localStorage.setItem("currentUser", username);

        loginContainer.classList.add("hidden");
        fileDashboardContainer.classList.remove("hidden");

        loadFileList();
    } else {
        loginError.textContent = "Invalid credentials. Please try again.";
    }
});

// Logout functionality
logoutBtn.addEventListener("click", function() {
    // Remove the logged-in user from localStorage
    localStorage.removeItem("currentUser");

    loginContainer.classList.remove("hidden");
    fileDashboardContainer.classList.add("hidden");
});

// Create a new file
createFileBtn.addEventListener("click", function() {
    const fileName = prompt("Enter the file name:");

    if (fileName) {
        const fileContent = prompt("Enter the content for the file:");

        if (fileContent) {
            const currentUser = localStorage.getItem("currentUser");
            const fileData = { name: fileName, content: fileContent };

            let userFiles = JSON.parse(localStorage.getItem(currentUser)) || [];
            userFiles.push(fileData);
            localStorage.setItem(currentUser, JSON.stringify(userFiles));

            loadFileList();
        }
    }
});

// Load the list of files for the logged-in user
function loadFileList() {
    const currentUser = localStorage.getItem("currentUser");
    const userFiles = JSON.parse(localStorage.getItem(currentUser)) || [];
    fileList.innerHTML = "";

    userFiles.forEach((file, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${file.name} <button onclick="deleteFile(${index})">Delete</button>`;
        fileList.appendChild(li);
    });
}

// Delete a file
function deleteFile(index) {
    const currentUser = localStorage.getItem("currentUser");
    let userFiles = JSON.parse(localStorage.getItem(currentUser)) || [];
    userFiles.splice(index, 1);
    localStorage.setItem(currentUser, JSON.stringify(userFiles));

    loadFileList();
}

// Check if user is already logged in
document.addEventListener("DOMContentLoaded", function() {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        loginContainer.classList.add("hidden");
        fileDashboardContainer.classList.remove("hidden");
        loadFileList();
    }
});
