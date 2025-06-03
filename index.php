<?php
session_start();

// ---- Configuration ----
define('USERNAME', 'admin');
define('PASSWORD', 'password123'); // CHANGE THIS
$root = realpath('.'); // Lock to current directory
// ------------------------

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
        $error = "Invalid credentials";
    }
}

// Show login form
if (!isset($_SESSION['logged_in'])) {
    ?>
    <html>
    <head>
        <title>Login</title>
        <style>
            body { font-family: Arial; background: #f4f4f4; text-align: center; padding-top: 100px; }
            form { display: inline-block; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px #aaa; }
            input { margin: 10px 0; padding: 10px; width: 200px; }
            button { padding: 10px 20px; }
        </style>
    </head>
    <body>
        <form method="post">
            <h2>Login</h2>
            <?php if (isset($error)) echo "<p style='color:red;'>$error</p>"; ?>
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit" name="login">Login</button>
        </form>
    </body>
    </html>
    <?php exit;
}

// File Manager Logic
$currentDir = isset($_GET['dir']) ? realpath($_GET['dir']) : $root;
if (strpos($currentDir, $root) !== 0) die("Access denied!");

// Upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $target = $currentDir . DIRECTORY_SEPARATOR . basename($_FILES['file']['name']);
    move_uploaded_file($_FILES['file']['tmp_name'], $target);
}

// Create Folder
if (isset($_POST['newfolder'])) {
    $folder = basename($_POST['newfolder']);
    $newPath = $currentDir . DIRECTORY_SEPARATOR . $folder;
    if (!file_exists($newPath)) mkdir($newPath);
}

// Delete File/Folder
if (isset($_GET['delete'])) {
    $deletePath = realpath($currentDir . DIRECTORY_SEPARATOR . $_GET['delete']);
    if ($deletePath && strpos($deletePath, $currentDir) === 0) {
        if (is_dir($deletePath)) rmdir($deletePath);
        else unlink($deletePath);
    }
}

// File listing
$items = scandir($currentDir);
?>
<!DOCTYPE html>
<html>
<head>
    <title>PHP File Manager</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f0f0f0; margin: 0; padding: 0; }
        .container { max-width: 900px; margin: auto; padding: 20px; background: #fff; }
        h2 { margin-top: 0; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px; border-bottom: 1px solid #ddd; }
        a { text-decoration: none; color: #333; }
        a:hover { text-decoration: underline; }
        .actions { float: right; }
        form { margin-top: 20px; }
        input[type="text"], input[type="file"] { padding: 8px; width: 250px; }
        button { padding: 8px 12px; margin-top: 5px; }
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .logout { color: red; }
    </style>
</head>
<body>
<div class="container">
    <div class="top-bar">
        <h2>📁 File Manager</h2>
        <a href="?logout=1" class="logout">Logout</a>
    </div>

    <p><strong>Current Directory:</strong> <?php echo htmlspecialchars($currentDir); ?></p>

    <ul>
        <?php if ($currentDir !== $root): ?>
            <li><a href="?dir=<?php echo urlencode(dirname($currentDir)); ?>">🔙 Go Back</a></li>
        <?php endif; ?>
        <?php foreach ($items as $item): if ($item === '.') continue;
            $path = $currentDir . DIRECTORY_SEPARATOR . $item;
            $rel = urlencode($item);
            ?>
            <li>
                <?php if (is_dir($path)): ?>
                    📁 <a href="?dir=<?php echo urlencode($path); ?>"><?php echo htmlspecialchars($item); ?></a>
                <?php else: ?>
                    📄 <?php echo htmlspecialchars($item); ?>
                <?php endif; ?>
                <span class="actions">
                    <a href="?dir=<?php echo urlencode($currentDir); ?>&delete=<?php echo $rel; ?>" onclick="return confirm('Delete <?php echo $item; ?>?')">❌ Delete</a>
                </span>
            </li>
        <?php endforeach; ?>
    </ul>

    <h3>📤 Upload File</h3>
    <form method="post" enctype="multipart/form-data">
        <input type="file" name="file" required>
        <button type="submit">Upload</button>
    </form>

    <h3>📁 Create Folder</h3>
    <form method="post">
        <input type="text" name="newfolder" placeholder="Folder Name" required>
        <button type="submit">Create</button>
    </form>
</div>
</body>
</html>
