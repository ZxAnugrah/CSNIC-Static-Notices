async function loadAllclasschars() {
  // Select all classchar sections (e.g. classchar-section-03-09-25)
  const classcharSections = document.querySelectorAll('[id^="classchar-section-"]');
  if (!classcharSections.length) return;

  for (const section of classcharSections) {
    const sectionId = section.id; // classchar-section-03-09-25
    const datePart = sectionId.replace("classchar-section-", ""); // 03-09-25
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
      const classchars = data.classchars;

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
        const sectionColor = classchar.section === "CT" ? "#3498db" : classchar.section === "TR" ? "#e74c3c" : "#95a5a6";
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content">
                <img src="${classchar.image}" style="width: 440px; margin-top: 8px" />
                <span style="font-weight:bold; color: ${sectionColor}; position: absolute; margin-left: -25px;margin-top: 10px">${classchar.section}</span>
              </span><br />
              <span style="font-weight:bold">${classchar.name}</span>
              <br />
              <span>[${classchar.grade}]</span>
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
