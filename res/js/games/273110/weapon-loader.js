async function loadAllweapons() {
  // Select all weapon sections (e.g. weapon-section-03-09-25)
  const weaponSections = document.querySelectorAll('[id^="weapon-section-"]');
  if (!weaponSections.length) return;

  for (const section of weaponSections) {
    const sectionId = section.id; // weapon-section-03-09-25
    const datePart = sectionId.replace("weapon-section-", ""); // 03-09-25
    const jsonPath = `./res/json/${datePart.replace(/-25$/, "-2025")}/weapon.json`;

    // Optional loading placeholder
    section.innerHTML = `
      <tr>
        <td colspan="2" style="text-align:center; padding:10px; font-style:italic; color:#999;">
          Loading weapons for ${datePart}...
        </td>
      </tr>
    `;

    try {
      const response = await fetch(jsonPath);
      if (!response.ok) throw new Error(`Failed to fetch ${jsonPath}`);

      const data = await response.json();
      const weapons = data.weapons;

      // Insert header
      section.innerHTML = `
        <tr>
          <td class="tr-box-title" colspan="2">
            <p class="MsoNormal p-normal-tr-box">
              <span class="span-text-title-box">Weapon</span>
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

      // Append weapons
      weapons.forEach((weapon) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content">
                <img src="${weapon.image}" style="width: 440px" />
              </span><br />
              <span style="font-weight:bold">${weapon.name}</span>
              <br />
              <span>[${weapon.grade}]</span>
            </p>
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content" style="font-size:11px">${weapon.description}</span>
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
            ⚠️ Unable to load weapons for ${datePart}
          </td>
        </tr>
      `;
    }
  }
}

window.addEventListener("DOMContentLoaded", loadAllweapons);
