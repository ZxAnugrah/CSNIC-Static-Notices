// Add responsive styles once
if (!document.getElementById("map-responsive-styles")) {
  const styleTag = document.createElement("style");
  styleTag.id = "map-responsive-styles";
  styleTag.textContent = `
    /* Desktop defaults */
    .map-img { width: 220px; }
    .map-img2 { width: 220px; margin-top: 6px; }
    .map-name { font-weight: bold; font-size: 12px; }
    .map-mode { font-size: 11px; }
    .map-info { font-size: 11px; }
    
    /* Tablet */
    @media (max-width: 900px) {
      .map-img { width: 150px; }
      .map-img2 { width: 150px; margin-top: 4px; }
      .map-name { font-size: 10px; }
      .map-mode { font-size: 9px; }
      .map-info { font-size: 9px; }
    }
    
    /* Phone */
    @media (max-width: 600px) {
      .map-img { width: 100px; }
      .map-img2 { width: 100px; margin-top: 3px; }
      .map-name { font-size: 9px; }
      .map-mode { font-size: 8px; }
      .map-info { font-size: 8px; }
    }
  `;
  document.head.appendChild(styleTag);
}

async function loadAllmaps() {
  const mapSections = document.querySelectorAll('[id^="map-section-"]');
  if (!mapSections.length) return;

  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);

  for (const section of mapSections) {
    const sectionId = section.id;
    const datePart = sectionId.replace("map-section-", "");
    const jsonPath = `https://zxanugrah.github.io/maps/${datePart.replace(`-${currentYear}-`, /-\d{2}$/)}/map.json`;
    // const chnjsonPath = `https://zxanugrah.github.io/chn_patch/maps/${datePart.replace(`-${currentYear}-`, /-\d{2}$/)}/map.json`;

    // Loading placeholder
    section.innerHTML = `
      <tr>
        <td colspan="2" style="text-align:center; padding:10px; font-style:italic; color:#999;">
          Loading maps for ${datePart}...
        </td>
      </tr>
    `;

    try {
      // const [response, response_chn] = await Promise.allSettled([fetch(jsonPath), fetch(chnjsonPath)]);
      const [response] = await Promise.allSettled([fetch(jsonPath)]);

      let allMaps = [];

      // Process global maps
      if (response.status === "fulfilled" && response.value.ok) {
        const data = await response.value.json();
        const maps = Object.keys(data)
          .filter((key) => !isNaN(key))
          .map((key) => ({ ...data[key], source: "global" }))
          .filter((map) => !map.hidden);
        allMaps = [...allMaps, ...maps];
      }

      // Process China maps
      // if (response_chn.status === "fulfilled" && response_chn.value.ok) {
      //   const data_chn = await response_chn.value.json();
      //   const maps_chn = Object.keys(data_chn)
      //     .filter((key) => !isNaN(key))
      //     .map((key) => ({ ...data_chn[key], source: "china", isChina: true }))
      //     .filter((map) => !map.hidden);
      //   allMaps = [...allMaps, ...maps_chn];
      // }

      if (allMaps.length === 0) {
        throw new Error("No map data found");
      }

      // Header
      section.innerHTML = `
        <tr>
          <td class="tr-box-title" colspan="2">
            <p class="MsoNormal p-normal-tr-box">
              <span class="span-text-title-box">Map</span>
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
              <span class="span-text-title-box">Lokasi / Deskripsi</span>
            </p>
          </td>
        </tr>
      `;

      // Build rows
      allMaps.forEach((map) => {
        const chinaIndicator = map.isChina ? "" : "";

        const textInfo = map.location ? map.location : map.description || "—";

        const row = document.createElement("tr");

        // === PREVIEW CELL ===
        const previewCell = document.createElement("td");
        previewCell.className = "border-box-content";

        let imageHTML = `<img src="${map.image}" class="map-img" title="${map.name}" />`;
        if (map.image2) {
          imageHTML += `<br /><img src="${map.image2}" class="map-img2" title="${map.name}" />`;
        }

        previewCell.innerHTML = `
          <p class="MsoNormal p-normal-tr-box">
            <span class="text-box-content">${imageHTML}</span><br />
            <span class="map-name">
              ${map.name}
              ${chinaIndicator}
            </span><br />
            <span class="map-mode">${map.mode}</span>
          </p>
        `;

        // === DESCRIPTION CELL ===
        const descCell = document.createElement("td");
        descCell.className = "border-box-content";
        descCell.innerHTML = `
          <p class="MsoNormal p-normal-tr-box">
            <span class="map-info text-box-content">
              ${textInfo}
              ${chinaIndicator}
            </span>
          </p>
        `;

        row.appendChild(previewCell);
        row.appendChild(descCell);
        section.appendChild(row);
      });
    } catch (err) {
      console.error(`Error loading maps for ${datePart}:`, err);
      section.innerHTML = `
        <tr>
          <td colspan="2" style="text-align:center; padding: 15px; color:#e74c3c;">
            ⚠️ Unable to load maps for ${datePart}
          </td>
        </tr>
      `;
    }
  }
}

window.addEventListener("DOMContentLoaded", loadAllmaps);
