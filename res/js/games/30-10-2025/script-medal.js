async function loadMedals() {
  try {
    const response = await fetch("./res/json/30-10-2025/medal.json");
    const data = await response.json();
    const medals = data.medals;
    const tableBody = document.getElementById("medal-section-30-10-25");

    if (!tableBody) return;

    // --- Add the header rows first ---
    tableBody.innerHTML = `
      <tr>
        <td class="tr-box-title" colspan="3">
          <p class="MsoNormal p-normal-tr-box">
            <span class="span-text-title-box">Medal</span>
          </p>
        </td>
      </tr>
      <tr style="height: 21.9333px">
        <td class="tr-box-title">
          <p class="MsoNormal p-normal-tr-box">
            <span class="span-text-title-box">Deskripsi</span>
          </p>
        </td>
        <td class="tr-box-title">
          <p class="MsoNormal p-normal-tr-box">
            <span class="span-text-title-box">Honor Point</span>
          </p>
        </td>
        <td class="tr-box-title">
          <p class="MsoNormal p-normal-tr-box">
            <span class="span-text-title-box">Preview</span>
          </p>
        </td>
      </tr>
    `;

    // --- Then load medals dynamically ---
    medals.forEach((medal) => {
      const row = document.createElement("tr");
      row.style.height = "8.2px";
      row.innerHTML = `
        <td class="border-box-content">
          <p class="MsoNormal p-normal-tr-box">
            <span class="text-box-content">${medal.description}</span>
          </p>
        </td>
        <td class="border-box-content">
          <p class="MsoNormal p-normal-tr-box">
            <span class="text-box-content">${medal.honor}</span>
          </p>
        </td>
        <td class="border-box-content">
          <p class="MsoNormal p-normal-tr-box">
            <span class="text-box-content">
              <img src="${medal.image}" width="100px" style="padding: 2px" />
            </span>
            <br />
            <span>${medal.name}</span>
          </p>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to load medals:", err);

    // Optional fallback message
    const tableBody = document.getElementById("medal-section");
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; padding: 15px;">
            <em>⚠️ Unable to load medals. Please check connection or file path.</em>
          </td>
        </tr>
      `;
    }
  }
}

window.addEventListener("DOMContentLoaded", loadMedals);
