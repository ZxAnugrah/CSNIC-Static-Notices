async function loadAllweapons() {
  const weaponSections = document.querySelectorAll('[id^="weapon-section-"]');
  if (!weaponSections.length) return;

  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);

  for (const section of weaponSections) {
    const sectionId = section.id;
    const datePart = sectionId.replace("weapon-section-", "");

    // Two JSON paths
    const jsonPath = `https://zxanugrah.github.io/weapons/${datePart.replace(`-${currentYear}-`, /-\d{2}$/)}/weapon.json`;
    const chnjsonPath = `https://zxanugrah.github.io/chn_patch/weapons/${datePart.replace(`-${currentYear}-`, /-\d{2}$/)}/weapon.json`;

    section.innerHTML = `
      <tr>
        <td colspan="2" style="text-align:center; padding:10px; font-style:italic; color:#999;">
          Loading weapons for ${datePart}...
        </td>
      </tr>
    `;

    try {
      // Fetch both JSON files simultaneously
      const [response, response_chn] = await Promise.allSettled([fetch(jsonPath), fetch(chnjsonPath)]);

      let allWeapons = [];

      // Process global weapons
      if (response.status === "fulfilled" && response.value.ok) {
        const data = await response.value.json();
        const weapons = Object.keys(data)
          .filter((key) => !isNaN(key))
          .map((key) => ({ ...data[key], source: "global" }))
          .filter((weapon) => !weapon.hidden);
        allWeapons = [...allWeapons, ...weapons];
      }

      // Process China weapons
      if (response_chn.status === "fulfilled" && response_chn.value.ok) {
        const data_chn = await response_chn.value.json();
        const weapons_chn = Object.keys(data_chn)
          .filter((key) => !isNaN(key))
          .map((key) => ({ ...data_chn[key], source: "china", isChina: true }))
          .filter((weapon) => !weapon.hidden);
        allWeapons = [...allWeapons, ...weapons_chn];
      }

      if (allWeapons.length === 0) {
        throw new Error("No weapon data found");
      }

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

      // Append all weapons (global + china)
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
          : `height: 100px;`;

        // Create synthesis tooltip if synthesis is true and synthesis_desc exists
        const synthesisTooltip =
          weapon.synthesis === true && weapon.synthesis_desc
            ? `<span class="tooltip-synthesis" title="${weapon.synthesis_desc}">
                <img src="./res/img/icon/synthesis.png" alt="Synthesis" style="width:16px; margin-top: -2px; vertical-align:middle; cursor:help;" />
              </span>`
            : "";

        const row = document.createElement("tr");
        row.innerHTML = `
    <td class="border-box-content">
      <p class="MsoNormal p-normal-tr-box">
        <span class="text-box-content">
          <img src="${weapon.image}" style="${imageStyle}" title="${weapon.name}" />
        </span><br />
        <span style="font-weight:bold; font-size: 12px">
          ${synthesisTooltip}
          ${weapon.enhance ? '<img src="./res/img/icon/weaponenhance.png" alt="WeaponEnhance" title="Enhancement" style="width:16px; margin-top: -2px; vertical-align:middle;" />' : ""}
          ${weapon.part ? '<img src="./res/img/icon/weaponpart.png" alt="WeaponPart" title="Part" style="width:16px; margin-top: -2px; vertical-align:middle;" />' : ""}
          ${weapon.modification ? '<img src="./res/img/icon/weaponmodification.png" alt="WeaponModification" title="Weapon Modification" style="width:16px; margin-top: -2px; vertical-align:middle;" />' : ""}
          ${weapon.zb3classic ? "<bold>[ZHC] </bold>" : ""} ${weapon.name}
        </span>
        <br />
        <span style="font-weight: bold; color: ${gradeColor};">[${weapon.grade}]</span>
      </p>
    </td>
    <td class="border-box-content">
      <p class="MsoNormal p-normal-tr-box">
        <span class="text-box-content" style="font-size:11px">
          ${weapon.description}
        </span>
      </p>
    </td>
  `;
        section.appendChild(row);
      });
    } catch (err) {
      console.error(`Error loading weapons for ${datePart}:`, err);
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
