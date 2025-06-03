<?php
// Define the directory where files will be uploaded
$uploadDir = 'uploads/';

// Check if the upload directory exists, if not, create it
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// List files in the upload directory
function listFiles($dir) {
    $files = scandir($dir);
    echo "<h2>Files in '$dir'</h2>";
    echo "<table border='1'>
            <tr><th>Filename</th><th>Size (bytes)</th><th>Actions</th></tr>";

    foreach ($files as $file) {
        if ($file == '.' || $file == '..') continue;
        $filePath = $dir . DIRECTORY_SEPARATOR . $file;
        echo "<tr>
                <td>" . htmlspecialchars($file) . "</td>
                <td>" . filesize($filePath) . "</td>
                <td>
                    <a href='?download=" . urlencode($file) . "'>Download</a> |
                    <a href='?delete=" . urlencode($file) . "' onclick='return confirm(\"Are you sure you want to delete $file?\");'>Delete</a>
                </td>
              </tr>";
    }
    echo "</table>";
}

// Handle file download
if (isset($_GET['download'])) {
    $file = $_GET['download'];
    $filePath = $uploadDir . $file;
    
    if (file_exists($filePath)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
        readfile($filePath);
        exit;
    } else {
        echo "File not found.";
    }
}

// Handle file deletion
if (isset($_GET['delete'])) {
    $file = $_GET['delete'];
    $filePath = $uploadDir . $file;

    if (file_exists($filePath) && unlink($filePath)) {
        echo "File deleted successfully.";
        header("Location: file_manager.php");
        exit;
    } else {
        echo "Failed to delete file.";
    }
}

// Handle file upload
if (isset($_FILES['file'])) {
    $uploadPath = $uploadDir . basename($_FILES['file']['name']);
    
    // Check if the file already exists
    if (file_exists($uploadPath)) {
        echo "File already exists.";
    } else {
        if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadPath)) {
            echo "File uploaded successfully.";
            header("Location: file_manager.php");
            exit;
        } else {
            echo "Failed to upload file.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple PHP File Manager</title>
</head>
<body>
    <h1>PHP File Manager</h1>

    <!-- Upload form -->
    <h3>Upload File</h3>
    <form method="post" enctype="multipart/form-data">
        <input type="file" name="file" required>
        <input type="submit" value="Upload">
    </form>

    <!-- Display the list of files -->
    <?php listFiles($uploadDir); ?>

</body>
</html>
