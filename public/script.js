async function loadFiles() {
  const res = await fetch('/files');
  const files = await res.json();
  const list = document.getElementById('file-list');
  list.innerHTML = '';
  files.forEach(file => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${file}
      <form method="POST" action="/delete" style="display:inline;">
        <input type="hidden" name="filename" value="${file}">
        <button type="submit">Delete</button>
      </form>
    `;
    list.appendChild(li);
  });
}

loadFiles();
