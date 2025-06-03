<?php
session_start();

// Simple hardcoded credentials
define('USERNAME', 'admin');
define('PASSWORD', 'password123'); // Change this

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: file-manager.php');
    exit;
}

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    if ($_POST['username'] === USERNAME && $_POST['password'] === PASSWORD) {
        $_SESSION['logged_in'] = true;
    } else {
        $error = "Invalid login credentials!";
    }
}

// Show login form if not logged in
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
?>
    <h2>Login</h2>
    <?php if (isset($error)) echo "<p style='color:red;'>$error</p>"; ?>
    <form method="post">
        <input type="text" name="username" placeholder="Username" required><br><br>
        <input type="password" name="password" placeholder="Password" required><br><br>
        <button type="submit" name="login">Login</button>
    </form>
    <?php exit; ?>
<?php
}

// File manager logic
$directory = isset($_GET['dir']) ? $_GET['dir'] : '.';
$directory = realpath($directory);

// Security check: stay inside root
if (strpos($directory, realpath('.')) !== 0) {
    die("Access denied.");
}

// Upload file
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $uploadFile = $directory . DIRECTORY_SEPARATOR . basename($_FILES['file']['name']);
    move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile);
}

// Create folder
if (isset($_POST['newfolder'])) {
    $folder = basename($_POST['newfolder']);
    $path = $directory . DIRECTORY_SEPARATOR . $folder;
    if (!file_exists($path)) {
        mkdir($path);
    }
}

// Delete file/folder
if (isset($_GET['delete'])) {
    $delPath = realpath($directory . DIRECTORY_SEPARATOR . $_GET['delete']);
    if ($delPath && strpos($delPath, $directory) === 0) {
        if (is_dir($delPath)) {
            rmdir($delPath);
        } else {
            unlink($delPath);
        }
    }
}

// List directory
$files = scandir($directory);
echo "<h2>File Manager</h2>";
echo "<p><a href='?logout=1'>Logout</a></p>";
echo "<p>Current directory: " . htmlspecialchars($directory) . "</p>";

echo "<ul>";
if ($directory != realpath('.')) {
    echo '<li><a href="?dir=' . urlencode(dirname($directory)) . '">[..]</a></li>';
}
foreach ($files as $file) {
    if ($file === '.') continue;
    $filePath = $directory . DIRECTORY_SEPARATOR . $file;
    $link = '?dir=' . urlencode($filePath);
    echo "<li>";
    if (is_dir($filePath)) {
        echo "<a href=\"$link\">[DIR] $file</a>";
    } else {
        echo "$file";
    }
    echo " - <a href=\"?dir=" . urlencode($directory) . "&delete=" . urlencode($file) . "\" onclick=\"return confirm('Delete $file?')\">Delete</a>";
    echo "</li>";
}
echo "</ul>";
?>

<h3>Upload File</h3>
<form method="post" enctype="multipart/form-data">
    <input type="file" name="file" required>
    <button type="submit">Upload</button>
</form>

<h3>Create Folder</h3>
<form method="post">
    <input type="text" name="newfolder" required>
    <button type="submit">Create</button>
</form>
