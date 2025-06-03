<?php
$host = 'localhost';   // MySQL host
$dbname = 'file_manager'; // Database name
$username = 'root';     // Database username
$password = '';         // Database password

// Create a PDO connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Could not connect to the database: " . $e->getMessage());
}

function listFiles($pdo) {
    $stmt = $pdo->query("SELECT * FROM files");
    echo "<h2>Uploaded Files</h2>";
    echo "<table border='1'><tr><th>Filename</th><th>Filesize</th><th>Actions</th></tr>";

    while ($file = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "<tr>
                <td>" . htmlspecialchars($file['filename']) . "</td>
                <td>" . $file['filesize'] . " bytes</td>
                <td>
                    <a href='?download=" . urlencode($file['id']) . "'>Download</a> |
                    <a href='?delete=" . urlencode($file['id']) . "' onclick='return confirm(\"Delete " . htmlspecialchars($file['filename']) . "?\");'>Delete</a>
                </td>
              </tr>";
    }
    echo "</table>";
}

if (isset($_GET['download'])) {
    $fileId = $_GET['download'];
    $stmt = $pdo->prepare("SELECT * FROM files WHERE id = :id");
    $stmt->execute(['id' => $fileId]);
    $file = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($file) {
        $filepath = $file['filepath'];
        if (file_exists($filepath)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . basename($filepath) . '"');
            readfile($filepath);
            exit;
        } else {
            echo "File not found.";
        }
    } else {
        echo "Invalid file.";
    }
}

if (isset($_GET['delete'])) {
    $fileId = $_GET['delete'];
    $stmt = $pdo->prepare("SELECT * FROM files WHERE id = :id");
    $stmt->execute(['id' => $fileId]);
    $file = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($file) {
        $filepath = $file['filepath'];
        if (unlink($filepath)) {
            $pdo->prepare("DELETE FROM files WHERE id = :id")->execute(['id' => $fileId]);
            header("Location: file_manager.php");
            exit;
        } else {
            echo "Failed to delete the file.";
        }
    } else {
        echo "Invalid file.";
    }
}

if (isset($_FILES['file'])) {
    $uploadDir = 'uploads/'; // Directory to store uploaded files
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true); // Create the upload directory if it doesn't exist
    }

    $uploadPath = $uploadDir . basename($_FILES['file']['name']);
    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadPath)) {
        $filename = $_FILES['file']['name'];
        $filesize = $_FILES['file']['size'];

        // Store file metadata in the database
        $stmt = $pdo->prepare("INSERT INTO files (filename, filepath, filesize) VALUES (:filename, :filepath, :filesize)");
        $stmt->execute(['filename' => $filename, 'filepath' => $uploadPath, 'filesize' => $filesize]);

        header("Location: file_manager.php");
        exit;
    } else {
        echo "Failed to upload file.";
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP File Manager with MySQL</title>
</head>
<body>
    <h1>PHP File Manager</h1>

    <!-- Display file list -->
    <?php listFiles($pdo); ?>

    <!-- Upload form -->
    <h3>Upload File</h3>
    <form method="post" enctype="multipart/form-data">
        <input type="file" name="file" required>
        <input type="submit" value="Upload">
    </form>
</body>
</html>
