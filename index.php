<?php include 'auth.php'; ?>
<?php
$uploadDir = 'uploads/' . $_SESSION['username'] . '/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0775, true);
$files = array_diff(scandir($uploadDir), ['.', '..']);
?>

<!DOCTYPE html>
<html>
<head><title>File Manager</title></head>
<body>
    <h1>Welcome, <?= htmlspecialchars($_SESSION['username']); ?></h1>
    <a href="logout.php">Logout</a>

    <h2>Upload File</h2>
    <form action="upload.php" method="post" enctype="multipart/form-data">
        <input type="file" name="uploaded_file" required>
        <button type="submit">Upload</button>
    </form>

    <h2>Your Files</h2>
    <ul>
        <?php foreach ($files as $file): ?>
            <li>
                <?= htmlspecialchars($file); ?>
                [<a href="<?= $uploadDir . urlencode($file); ?>" download>Download</a>]
                [<a href="delete.php?file=<?= urlencode($file); ?>" onclick="return confirm('Delete this file?');">Delete</a>]
            </li>
        <?php endforeach; ?>
    </ul>
</body>
</html>
