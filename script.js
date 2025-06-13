function downloadVideo() {
  const url = document.getElementById("videoURL").value;
  const status = document.getElementById("status");

  if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
    status.textContent = "Please enter a valid YouTube URL.";
    return;
  }

  // Replace this with your server endpoint
  fetch("http://localhost:3000/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url: url })
  })
  .then(response => response.blob())
  .then(blob => {
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "video.mp4";
    downloadLink.click();
    status.textContent = "Download started.";
  })
  .catch(error => {
    console.error("Error:", error);
    status.textContent = "Failed to download video.";
  });
}
