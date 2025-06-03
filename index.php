<?php
$directory = isset($_GET['dir']) ? $_GET['dir'] : '.';
$directory = realpath($directory);

// Prevent directory traversal
if (strpos($directory, realpath('.')) !== 0) {
    die("Access Denied.");
}

// Handle file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $target = $directory . DIRECTORY_SEPARATOR . basename($_FILES['file']['name']);
    if (move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
        echo "<p>✅ File uploaded.</p>";
    } else {
        echo "<p>❌ Upload failed.</p>";
    }
}

// Handle folder creation
if (isset($_POST['newfolder'])) {
    $folderName = basename($_POST['newfolder']);
    $newPath = $directory . DIRECTORY_SEPARATOR . $folderName;
    if (!file_exists($newPath)) {
        mkdir($newPath);
        echo "<p>📁 Folder created.</p>";
    } else {
        echo "<p>⚠️ Folder already exists.</p>";
    }
}

// Handle deletion
if (isset($_GET['delete'])) {
    $delPath = realpath($directory . DIRECTORY_SEPARATOR . $_GET['delete']);
    if ($delPath && strpos($delPath, $directory) === 0) {
        if (is_dir($delPath)) {
            rmdir($delPath);
        } else {
            unlink($delPath);
        }
        echo "<p>🗑️ Deleted successfully.</p>";
    }
}

// List files
$items = scandir($directory);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Simple PHP File Manager</title>
    <style>
        body { font-family: Arial; background: #f0f0f0; padding: 20px; }
        h2 { margin-top: 0; }
        ul { list-style: none; padding: 0; }
        li { margin: 5px 0; }
        a { text-decoration: none; color: #333; }
        .action { margin-left: 10px; color: red; }
    </style>
</head>
<body>
    <h2>PHP File Manager</h2>
    <p>Current Directory: <?php echo htmlspecialchars($directory); ?></p>

    <ul>
        <?php if ($directory !== realpath('.')): ?>
            <li><a href="?dir=<?php echo urlencode(dirname($directory)); ?>">🔙 Up</a></li>
        <?php endif; ?>
        <?php foreach ($items as $item): if ($item === '.') continue;
            $itemPath = $directory . DIRECTORY_SEPARATOR . $item;
            ?>
            <li>
                <?php if (is_dir($itemPath)): ?>
                    📁 <a href="?dir=<?php echo urlencode($itemPath); ?>"><?php echo htmlspecialchars($item); ?></a>
                <?php else: ?>
                    📄 <?php echo htmlspecialchars($item); ?>
                <?php endif; ?>
                <a class="action" href="?dir=<?php echo urlencode($directory); ?>&delete=<?php echo urlencode($item); ?>" onclick="return confirm('Delete <?php echo $item; ?>?')">❌</a>
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
        <input type="text" name="newfolder" placeholder="New folder name" required>
        <button type="submit">Create</button>
    </form>
</body>
</html>
