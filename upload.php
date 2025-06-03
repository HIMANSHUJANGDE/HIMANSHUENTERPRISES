<?php
if (isset($_FILES['file'])) {
    $uploadDir = 'uploads/';
    
    // Check if the uploads directory exists, otherwise create it
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $uploadFile = $uploadDir . basename($_FILES['file']['name']);

    // Check if the file already exists
    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
        echo "File has been uploaded successfully!";
    } else {
        echo "File upload failed.";
    }
} else {
    echo "No file uploaded.";
}
?>
