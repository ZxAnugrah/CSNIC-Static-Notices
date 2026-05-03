// Add responsive styles once
if (!document.getElementById("classchar-responsive-styles")) {
  const styleTag = document.createElement("style");
  styleTag.id = "classchar-responsive-styles";
  styleTag.textContent = `
    /* Desktop defaults */
    .classchar-img { max-width: 100%; height: auto; }
    .classchar-section { font-weight: bold; position: absolute; margin-left: -40px; padding: 10px; text-shadow: 1px 1px 1px #000000; }
    .classchar-name { font-weight: bold; font-size: 12px; }
    .classchar-grade { font-weight: bold; }
    .classchar-desc { font-size: 11px; }
    
    /* Tablet */
    @media (max-width: 900px) {
      .classchar-img { max-width: 80px; }
      .classchar-section { font-size: 12px !important; margin-left: -28px !important; padding: 6px !important; }
      .classchar-name { font-size: 10px; }
      .classchar-grade { font-size: 10px; }
      .classchar-desc { font-size: 9px; }
    }
    
    /* Phone */
    @media (max-width: 600px) {
      .classchar-img { max-width: 60px; }
      .classchar-section { font-size: 10px !important; margin-left: 35px !important; padding: 3px !important; margin-top: -45px !important; }
      .classchar-name { font-size: 9px; }
      .classchar-grade { font-size: 9px; }
      .classchar-desc { font-size: 8px; }
    }
  `;
  document.head.appendChild(styleTag);
}

async function loadAllclasschars() {
  const classcharSections = document.querySelectorAll('[id^="classchar-section-"]');
  if (!classcharSections.length) return;

  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);

  for (const section of classcharSections) {
    const sectionId = section.id;
    const datePart = sectionId.replace("classchar-section-", "");
    const jsonPath = `https://zxanugrah.github.io/classchars/${datePart.replace(`-${currentYear}-`, /-\d{2}$/)}/classchar.json`;
    //const chnjsonPath = `https://zxanugrah.github.io/chn_patch/classchars/${datePart.replace(`-${currentYear}-`, /-\d{2}$/)}/classchar.json`;

    // Loading placeholder
    section.innerHTML = `
      <tr>
        <td colspan="2" style="text-align:center; padding:10px; font-style:italic; color:#999;">
          Loading classchars for ${datePart}...
        </td>
      </tr>
    `;

    try {
      //const [response, response_chn] = await Promise.allSettled([fetch(jsonPath), fetch(chnjsonPath)]);
      const [response] = await Promise.allSettled([fetch(jsonPath)]);

      let allClasschars = [];

      if (response.status === "fulfilled" && response.value.ok) {
        const data = await response.value.json();
        const classchars = Object.keys(data)
          .filter((key) => !isNaN(key))
          .map((key) => ({ ...data[key], source: "global" }));
        allClasschars = [...allClasschars, ...classchars];
      }

      // if (response_chn.status === "fulfilled" && response_chn.value.ok) {
      //   const data_chn = await response_chn.value.json();
      //   const classchars_chn = Object.keys(data_chn)
      //     .filter((key) => !isNaN(key))
      //     .map((key) => ({ ...data_chn[key], source: "china", isChina: true }));
      //   allClasschars = [...allClasschars, ...classchars_chn];
      // }

      if (allClasschars.length === 0) {
        throw new Error("No class character data found");
      }

      // Header
      section.innerHTML = `
        <tr>
          <td class="tr-box-title" colspan="2">
            <p class="MsoNormal p-normal-tr-box">
              <span class="span-text-title-box">Class</span>
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

      // Build rows
      allClasschars.forEach((classchar) => {
        const sectionColor = classchar.section === "CT" ? "#2489ccff" : classchar.section === "TR" ? "#d12a17ff" : classchar.section === "ZB" ? "#790c00ff" : "#95a5a6";

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

        // === PREVIEW CELL ===
        const previewCell = document.createElement("td");
        previewCell.className = "border-box-content";
        previewCell.innerHTML = `
          <p class="MsoNormal p-normal-tr-box">
            <span class="text-box-content">
              <img src="${classchar.image}" class="classchar-img" style="margin-top: 8px" title="${classchar.name}" />
              <span class="classchar-section" style="color: ${sectionColor};">${classchar.section}</span>
            </span><br />
            <span class="classchar-name">${classchar.name}</span>
            <br />
            <span class="classchar-grade" style="color: ${gradeColor};">[${classchar.grade}]</span>
          </p>
        `;

        // === DESCRIPTION CELL ===
        const descCell = document.createElement("td");
        descCell.className = "border-box-content";
        descCell.innerHTML = `
          <p class="MsoNormal p-normal-tr-box">
            <span class="classchar-desc text-box-content">${classchar.description}</span>
          </p>
        `;

        row.appendChild(previewCell);
        row.appendChild(descCell);
        section.appendChild(row);
      });
    } catch (err) {
      console.error(`Error loading class characters for ${datePart}:`, err);
      section.innerHTML = `
        <tr>
          <td colspan="2" style="text-align:center; padding: 15px; color:#e74c3c;">
            ⚠️ Unable to load class characters for ${datePart}
          </td>
        </tr>
      `;
    }
  }
}

window.addEventListener("DOMContentLoaded", loadAllclasschars);
