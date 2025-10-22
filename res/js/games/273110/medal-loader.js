async function loadAllMedals() {
  // Select all medal sections (e.g. medal-section-03-09-25)
  const medalSections = document.querySelectorAll('[id^="medal-section-"]');
  if (!medalSections.length) return;

  for (const section of medalSections) {
    const sectionId = section.id; // medal-section-03-09-25
    const datePart = sectionId.replace("medal-section-", ""); // 03-09-25
    const jsonPath = `./res/json/${datePart.replace(/-25$/, "-2025")}/medal.json`;

    // Optional loading placeholder
    section.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center; padding:10px; font-style:italic; color:#999;">
          Loading medals for ${datePart}...
        </td>
      </tr>
    `;

    try {
      const response = await fetch(jsonPath);
      if (!response.ok) throw new Error(`Failed to fetch ${jsonPath}`);

      const data = await response.json();
      const medals = Object.keys(data)
        .filter((key) => !isNaN(key))
        .map((key) => data[key]);

      // Insert header
      section.innerHTML = `
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
              <span class="span-text-title-box" >Deskripsi</span>
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

      // Append medals
      medals.forEach((medal) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content" style="font-size:11px">${medal.description}</span>
            </p>
          </td>
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content" style="font-size:11px">${medal.honor}</span>
            </p>
          </td>
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content">
                <img src="${medal.image}" width="80px" style="padding: 2px" />
                <br />
                <span style="font-size:11px;font-weight:bold">[${medal.name}]</span>
              </span>
            </p>
          </td>
        `;
        section.appendChild(row);
      });
    } catch (err) {
      console.error(`Error loading ${jsonPath}:`, err);
      section.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; padding: 15px; color:#e74c3c;">
            ⚠️ Unable to load medals for ${datePart}
          </td>
        </tr>
      `;
    }
  }
}

window.addEventListener("DOMContentLoaded", loadAllMedals);
