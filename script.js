document.getElementById('uploadBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  const status = document.getElementById('status');

  if (!fileInput.files.length) {
    status.textContent = "Please select a .zip file first.";
    status.style.color = "red";
    return;
  }

  status.textContent = "Uploading and building APK...";
  status.style.color = "black";

  const formData = new FormData();
  formData.append('websiteZip', fileInput.files[0]);

  try {
    const res = await fetch('/build-apk', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('Build failed');

    const blob = await res.blob();
    const apkURL = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = apkURL;
    a.download = 'YourWebsiteApp.apk';
    a.textContent = 'Download APK';
    a.style.display = 'block';
    a.style.marginTop = '20px';
    status.textContent = '';
    status.appendChild(a);
  } catch (err) {
    status.textContent = "Error building APK.";
    status.style.color = "red";
    console.error(err);
  }
});
