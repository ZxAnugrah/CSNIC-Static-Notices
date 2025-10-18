async function loadMedals() {
  try {
    const response = await fetch("./res/json/01-10-2025/weapon.json");
    const data = await response.json();
    const medals = data.medals;
    const tableBody = document.getElementById("weapon-section-01-10-25");

    if (!tableBody) return;

    // --- Add the header rows first ---
    tableBody.innerHTML = `
      <tr>
        <td class="tr-box-title" colspan="3">
          <p class="MsoNormal p-normal-tr-box">
            <span class="span-text-title-box">Weapon</span>
          </p>
        </td>
      </tr>
      <tr>
      <td class="tr-box-title">
          <p class="MsoNormal p-normal-tr-box">
            <span class="span-text-title-box">Preview</span>
          </p>
        </td>
        <td class="tr-box-title">
          <p class="MsoNormal p-normal-tr-box">
            <span class="span-text-title-box">Deskripsi</span>
          </p>
        </td>
      </tr>
    `;

    // --- Then load weapons dynamically ---
    weapons.forEach((weapon) => {
      const row = document.createElement("tr");
      row.style.height = "8.2px";
      row.innerHTML = `
        <td class="border-box-content">
          <p class="MsoNormal p-normal-tr-box">
            <span class="text-box-content">${weapon.description}</span>
          </p>
        </td>
        <td class="border-box-content">
          <p class="MsoNormal p-normal-tr-box">
            <span class="text-box-content">
              <img src="${weapon.image}" width="100px" style="padding: 2px" />
            </span>
            <br />
            <span>${weapon.name}</span>
          </p>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to load weapons:", err);

    // Optional fallback message
    const tableBody = document.getElementById("weapon-section");
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; padding: 15px;">
            <em>⚠️ Unable to load weapons. Please check connection or file path.</em>
          </td>
        </tr>
      `;
    }
  }
}

window.addEventListener("DOMContentLoaded", loadMedals);
