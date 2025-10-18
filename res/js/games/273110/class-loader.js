async function loadAllcharacters() {
  // Select all character sections (e.g. character-section-03-09-25)
  const characterSections = document.querySelectorAll('[id^="character-section-"]');
  if (!characterSections.length) return;

  for (const section of characterSections) {
    const sectionId = section.id; // character-section-03-09-25
    const datePart = sectionId.replace("character-section-", ""); // 03-09-25
    const jsonPath = `./res/json/${datePart.replace(/-25$/, "-2025")}/character.json`;

    // Optional loading placeholder
    section.innerHTML = `
      <tr>
        <td colspan="2" style="text-align:center; padding:10px; font-style:italic; color:#999;">
          Loading characters for ${datePart}...
        </td>
      </tr>
    `;

    try {
      const response = await fetch(jsonPath);
      if (!response.ok) throw new Error(`Failed to fetch ${jsonPath}`);

      const data = await response.json();
      const characters = data.characters;

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

      // Append characters
      characters.forEach((character) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content">
                <img src="${character.image}" style="width: 440px" />
              </span><br />
              <span style="font-weight:bold">${character.name}</span>
              <br />
              <span>[${character.grade}]</span>
            </p>
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content" style="font-size:11px">${character.description}</span>
            </p>
          </td>
          </td>
        `;
        section.appendChild(row);
      });
    } catch (err) {
      console.error(`Error loading ${jsonPath}:`, err);
      section.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; padding: 15px; color:#e74c3c;">
            ⚠️ Unable to load characters for ${datePart}
          </td>
        </tr>
      `;
    }
  }
}

window.addEventListener("DOMContentLoaded", loadAllcharacters);
