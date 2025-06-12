<?php
include 'auth.php';

$uploadDir = 'uploads/' . $_SESSION['username'] . '/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0775, true);

$targetFile = $uploadDir . basename($_FILES['uploaded_file']['name']);
move_uploaded_file($_FILES['uploaded_file']['tmp_name'], $targetFile);

header('Location: index.php');
exit;
