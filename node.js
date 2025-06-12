// Receives zip, unpacks into template, runs Gradle
app.post('/build-apk', async (req, res) => {
  const zip = req.files.websiteZip;
  const tmpDir = '/tmp/site-' + Date.now();
  fs.mkdirSync(tmpDir);
  
  await unzip(zip.data, tmpDir + '/assets');
  
  // Copy template Android project
  fs.copySync('./android-template', tmpDir + '/android');
  
  // Run Gradle to build APK
  exec('./gradlew assembleDebug', { cwd: tmpDir + '/android' }, () => {
    res.download(tmpDir + '/android/app/build/outputs/apk/debug/app-debug.apk');
  });
});
