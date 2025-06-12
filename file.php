<?php include 'auth.php'; ?>
<?php
$uploadDir = 'uploads/' . $_SESSION['username'] . '/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0775, true);
$files = array_diff(scandir($uploadDir), ['.', '..']);
?>



<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>File Manager - Dashboard</title>
  <style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  height: 100vh;
}

.dashboard-container {
  display: flex;
  width: 100%;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.nav-menu a {
  display: block;
  color: white;
  text-decoration: none;
  margin: 1rem 0;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-menu a:hover {
  background-color: #34495e;
}

/* Main Content */
.main-content {
  flex: 1;
  background-color: #ecf0f1;
  padding: 2rem;
}

.header h1 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>






</head>
<body>
  <div class="dashboard-container">
    <aside class="sidebar">
      <h2 class="logo">File Manager</h2>
      <nav class="nav-menu">
        <a href="index.php">🏠 Home</a>
        <a href="file.php">📁 Files</a>
        <a href="logout.php">🔓 Logout</a>
      </nav>
    </aside>
    <main class="main-content">
      <header class="header">
        <h1>Welcome to <?= htmlspecialchars($_SESSION['username']); ?></h1>
      </header>
      <section class="content">
        
      
 <div class="card">
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
    </div>


        
       
      </section>
    </main>
  </div>
</body>
</html>
