async function loadAllweapons() {
  // Select all weapon sections (e.g. weapon-section-MM-DD-YY)
  const weaponSections = document.querySelectorAll('[id^="weapon-section-"]');
  if (!weaponSections.length) return;

  for (const section of weaponSections) {
    const sectionId = section.id; // weapon-section-MM-DD-YY
    const datePart = sectionId.replace("weapon-section-", ""); // MM-DD-YY
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
      const weapons = Object.keys(data)
        .filter((key) => !isNaN(key))
        .map((key) => data[key]);

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
        const gradeColor =
          weapon.grade === "Epic"
            ? "#ff1cc4"
            : weapon.grade === "Legendary"
            ? "#590fe4ff"
            : weapon.grade === "Transcendence"
            ? "#cb8f0f"
            : weapon.grade === "Unique"
            ? "#e02c2cff"
            : weapon.grade === "Rare"
            ? "#0b62aa"
            : weapon.grade === "Advanced"
            ? "#0e7216"
            : weapon.grade === "Basic"
            ? "#bbbbbbff"
            : "#000000ff";
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content">
                <img src="${weapon.image}" style="width: 440px" />
              </span><br />
              <span style="font-weight:bold">
                ${weapon.part ? '<img src="./res/img/icon/weaponpart.png" alt="WeaponPart" title="Part" style="width:16px; margin-top: -2px; vertical-align:middle;" />' : ""}
                ${weapon.enhance ? '<img src="./res/img/icon/weaponenhance.png" alt="WeaponEnhance" title="Enhancement" style="width:16px; margin-top: -2px; vertical-align:middle;" />' : ""}
                ${weapon.name}
              </span>
              <br />
              <span style="font-weight: bold; color: ${gradeColor};">[${weapon.grade}]</span>
            </p>
          </td>
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content" style="font-size:11px">${weapon.description}</span>
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
            ⚠️ Unable to load weapons for ${datePart}
          </td>
        </tr>
      `;
    }
  }
}

window.addEventListener("DOMContentLoaded", loadAllweapons);
