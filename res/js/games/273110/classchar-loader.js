async function loadAllclasschars() {
  // Select all classchar sections (e.g. classchar-section-MM-DD-YY)
  const classcharSections = document.querySelectorAll('[id^="classchar-section-"]');
  if (!classcharSections.length) return;

  for (const section of classcharSections) {
    const sectionId = section.id; // classchar-section-MM-DD-YY
    const datePart = sectionId.replace("classchar-section-", ""); // MM-DD-YY
    const jsonPath = `./res/json/${datePart.replace(/-25$/, "-2025")}/classchar.json`;

    // Optional loading placeholder
    section.innerHTML = `
      <tr>
        <td colspan="2" style="text-align:center; padding:10px; font-style:italic; color:#999;">
          Loading classchars for ${datePart}...
        </td>
      </tr>
    `;

    try {
      const response = await fetch(jsonPath);
      if (!response.ok) throw new Error(`Failed to fetch ${jsonPath}`);

      const data = await response.json();
      const classchars = Object.keys(data)
        .filter((key) => !isNaN(key))
        .map((key) => data[key]);

      // Insert header
      section.innerHTML = `
        <tr>
          <td class="tr-box-title" colspan="2">
            <p class="MsoNormal p-normal-tr-box">
              <span class="span-text-title-box">Class</span>
            </p>
          </td>
        </tr>
        <tr >
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

      // Append classchars
      classchars.forEach((classchar) => {
        const sectionColor = classchar.section === "CT" ? "#2489ccff" : classchar.section === "TR" ? "#d12a17ff" : "#95a5a6";
        const gradeColor =
          classchar.grade === "Epic"
            ? "#ff1cc4"
            : classchar.grade === "Legendary"
            ? "#300580"
            : classchar.grade === "Transcendence"
            ? "#cb8f0f"
            : classchar.grade === "Unique"
            ? "#b92222ff"
            : classchar.grade === "Rare"
            ? "#0b62aa"
            : classchar.grade === "Advanced"
            ? "#0e7216"
            : classchar.grade === "Basic"
            ? "#bbbbbbff"
            : "#000000ff";
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content">
                <img src="${classchar.image}" style="width: 440px; margin-top: 8px" />
                <span style="font-weight:bold; color: ${sectionColor}; position: absolute; margin-left: -40px; padding: 10px; font-size: 15px">${classchar.section}</span>
              </span><br />
              <span style="font-weight:bold">${classchar.name}</span>
              <br />
              <span style="font-weight: bold; color: ${gradeColor}">[${classchar.grade}]</span>
            </p>
          </td>
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content" style="font-size:11px">${classchar.description}</span>
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
            ⚠️ Unable to load classchars for ${datePart}
          </td>
        </tr>
      `;
    }
  }
}

window.addEventListener("DOMContentLoaded", loadAllclasschars);
