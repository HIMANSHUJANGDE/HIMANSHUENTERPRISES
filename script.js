document.getElementById("uploadForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  const res = await fetch("/upload", {
    method: "POST",
    body: formData,
  });

  if (res.ok) {
    alert("File uploaded successfully!");
    loadFiles();
  } else {
    alert("Upload failed.");
  }
});

async function loadFiles() {
  const res = await fetch("/files");
  const files = await res.json();
  const list = document.getElementById("fileList");
  list.innerHTML = "";

  files.forEach(file => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="/download/${file.id}">${file.name}</a>`;
    list.appendChild(li);
  });
}

window.onload = loadFiles;
