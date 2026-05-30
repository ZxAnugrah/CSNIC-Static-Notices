// Add responsive styles once
if (!document.getElementById("weapon-responsive-styles")) {
  const styleTag = document.createElement("style");
  styleTag.id = "weapon-responsive-styles";
  styleTag.textContent = `
    /* Desktop defaults */
    .weapon-img { max-width: 100%; height: 100px; }
    .weapon-icons { display: inline-flex; align-items: center; gap: 2px; }
    .weapon-zhc-badge { font-weight: bold; font-size: 11px; }
    .weapon-name { font-weight: bold; font-size: 12px; }
    .weapon-grade { font-weight: bold; }
    .weapon-desc { font-size: 11px; }
    .weapon-adjustment { font-size: 11px; }
    .weapon-icon { width: 16px; height: 16px; vertical-align: middle; flex-shrink: 0; }
    
    /* Tablet */
    @media (max-width: 900px) {
      .weapon-img { max-width: 80px; height: auto; }
      .weapon-icons { gap: 1px; }
      .weapon-zhc-badge { font-size: 10px; }
      .weapon-name { font-size: 10px; }
      .weapon-grade { font-size: 10px; }
      .weapon-desc { font-size: 9px; }
      .weapon-adjustment { font-size: 9px; }
      .weapon-icon { width: 14px; height: 14px; }
    }
    
    /* Phone */
    @media (max-width: 600px) {
      .weapon-img { max-width: 60px; }
      .weapon-icons { gap: 1px; }
      .weapon-zhc-badge { font-size: 9px; display: block; }
      .weapon-name { font-size: 9px; }
      .weapon-grade { font-size: 9px; }
      .weapon-desc { font-size: 8px; }
      .weapon-adjustment { font-size: 8px; }
      .weapon-icon { width: 12px; height: 12px; }
    }
  `;
  document.head.appendChild(styleTag);
}

async function loadAllweapons() {
  const weaponSections = document.querySelectorAll('[id^="weapon-section-"]');
  if (!weaponSections.length) return;

  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);

  for (const section of weaponSections) {
    const sectionId = section.id;
    const datePart = sectionId.replace("weapon-section-", "");

    const jsonPath = `https://zxanugrah.github.io/weapons/${datePart.replace(`-${currentYear}-`, /-\d{2}$/)}/weapon.json`;

    // Loading placeholder
    section.innerHTML = `
      <tr>
        <td colspan="2" style="text-align:center; padding:10px; font-style:italic; color:#999;">
          Loading weapons for ${datePart}...
        </td>
      </tr>
    `;

    try {
      const [response] = await Promise.allSettled([fetch(jsonPath)]);

      let allWeapons = [];

      if (response.status === "fulfilled" && response.value.ok) {
        const data = await response.value.json();
        const weapons = Object.keys(data)
          .filter((key) => !isNaN(key))
          .map((key) => ({ ...data[key], source: "global" }))
          .filter((weapon) => !weapon.hidden);
        allWeapons = [...allWeapons, ...weapons];
      }

      if (allWeapons.length === 0) {
        throw new Error("No weapon data found");
      }

      // Check if ANY weapon has adjustment data
      const hasAnyAdjustment = allWeapons.some((w) => w.adjustment);

      // Header - dynamic colspan based on whether there are adjustments
      section.innerHTML = `
        <tr>
          <td class="tr-box-title" colspan="${hasAnyAdjustment ? "3" : "2"}">
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
          ${
            hasAnyAdjustment
              ? `
          <td class="tr-box-title">
            <p class="MsoNormal p-normal-tr-box">
              <span class="span-text-title-box">Lainnya</span>
            </p>
          </td>
          `
              : ""
          }
        </tr>
      `;

      // Build rows
      allWeapons.forEach((weapon) => {
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

        const imageStyle = weapon.zb3classic
          ? `height: 100px; background-image: url('https://static.wikia.nocookie.net/cso/images/0/0d/Zhc_best_item_bg.png'); background-size: contain; background-repeat: no-repeat; background-position: center;`
          : "";

        const synthesisTooltip =
          weapon.synthesis === true && weapon.synthesis_desc
            ? `<span title="${weapon.synthesis_desc}" style="cursor:help;">
                <img src="./res/img/icon/synthesis.png" alt="Synthesis" class="weapon-icon" />
              </span>`
            : "";

        const enhanceIcon = weapon.enhance ? '<img src="./res/img/icon/weaponenhance.png" alt="Enhancement" title="Enhancement" class="weapon-icon" />' : "";
        const partIcon = weapon.part ? '<img src="./res/img/icon/weaponpart.png" alt="Part" title="Part" class="weapon-icon" />' : "";
        const modificationIcon = weapon.modification ? '<img src="./res/img/icon/weaponmodification.png" alt="Weapon Modification" title="Weapon Modification" class="weapon-icon" />' : "";

        const row = document.createElement("tr");

        // === PREVIEW CELL ===
        const previewCell = document.createElement("td");
        previewCell.className = "border-box-content";
        previewCell.innerHTML = `
          <p class="MsoNormal p-normal-tr-box">
            <span class="text-box-content">
              <img src="${weapon.image}" class="weapon-img" style="${imageStyle}" title="${weapon.name}" />
            </span><br />
            <span class="weapon-icons" style="display: inline-flex; align-items: center; gap: 2px;">
              ${synthesisTooltip}
              ${enhanceIcon}
              ${partIcon}
              ${modificationIcon}
            </span>
            <br />
            <span class="weapon-name">
              ${weapon.zb3classic ? '<span class="weapon-zhc-badge">[ZHC]</span> ' : ""}${weapon.name}
            </span>
            <br />
            <span class="weapon-grade" style="color: ${gradeColor};">[${weapon.grade}]</span>
          </p>
        `;

        // === DESCRIPTION CELL ===
        const descCell = document.createElement("td");
        descCell.className = "border-box-content";
        descCell.innerHTML = `
          <p class="MsoNormal p-normal-tr-box">
            <span class="weapon-desc text-box-content">${weapon.description}</span>
          </p>
        `;

        row.appendChild(previewCell);
        row.appendChild(descCell);

        // === ADJUSTMENT CELL (only if any weapon has adjustment) ===
        if (hasAnyAdjustment) {
          const adjCell = document.createElement("td");
          adjCell.className = "border-box-content";
          adjCell.innerHTML = `
            <p class="MsoNormal p-normal-tr-box">
              <span class="weapon-adjustment text-box-content">${weapon.adjustment || "—"}</span>
            </p>
          `;
          row.appendChild(adjCell);
        }

        section.appendChild(row);
      });
    } catch (err) {
      console.error(`Error loading weapons for ${datePart}:`, err);
      section.innerHTML = `
        <tr>
          <td colspan="2" style="text-align:center; padding: 15px; color:#e74c3c;">
            ⚠️ Unable to load weapons for ${datePart}
          </td>
        </tr>
      `;
    }
  }
}

window.addEventListener("DOMContentLoaded", loadAllweapons);
