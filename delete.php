<?php
include 'auth.php';

if (isset($_GET['file'])) {
    $file = basename($_GET['file']);
    $filePath = 'uploads/' . $_SESSION['username'] . '/' . $file;

    if (file_exists($filePath)) {
        unlink($filePath);
    }
}
header('Location: index.php');
exit;
