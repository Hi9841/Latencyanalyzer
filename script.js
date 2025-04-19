document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const file = document.getElementById('etlFile').files[0];
  if (!file) return alert("Please select a .etl file.");

  const formData = new FormData();
  formData.append('etlFile', file);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
    .then(async res => {
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Upload failed.');
      }
      return res.json();
    })
    .then(data => {
      const tbody = document.querySelector('#resultsTable tbody');
      tbody.innerHTML = '';

      data.forEach(item => {
        const row = `<tr>
          <td>${item.module}</td>
          <td>${item.max.toFixed(3)}</td>
          <td>${item.avg.toFixed(3)}</td>
        </tr>`;
        tbody.innerHTML += row;
      });
    })
    .catch(err => {
      console.error('❌ Upload Error:', err);
      alert(`Upload failed: ${err.message}`);
    });
});

// Sorting logic + arrows
let sortDirection = [true, true, true]; // true = ascending

function sortTable(columnIndex) {
  const table = document.getElementById("resultsTable");
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  const isNumeric = columnIndex > 0;
  const direction = sortDirection[columnIndex] ? 1 : -1;

  rows.sort((a, b) => {
    const aText = a.children[columnIndex].textContent.trim();
    const bText = b.children[columnIndex].textContent.trim();

    if (isNumeric) {
      return (parseFloat(aText) - parseFloat(bText)) * direction;
    } else {
      return aText.localeCompare(bText) * direction;
    }
  });

  sortDirection[columnIndex] = !sortDirection[columnIndex];
  rows.forEach(row => tbody.appendChild(row));

  updateArrows(columnIndex, direction);
}

function updateArrows(activeIndex, dir) {
  // Clear all arrows
  document.querySelectorAll('.arrow').forEach(el => el.textContent = '');

  // Only update for Max or Avg (index 1 or 2)
  if (activeIndex === 1 || activeIndex === 2) {
    const arrowId = `arrow${activeIndex}`;
    const arrowEl = document.getElementById(arrowId);
    arrowEl.textContent = dir === 1 ? '▼' : '▲';
  }
}
