async function loadAllmaps() {
  // Select all map sections (e.g. map-section-03-09-25)
  const mapSections = document.querySelectorAll('[id^="map-section-"]');
  if (!mapSections.length) return;

  for (const section of mapSections) {
    const sectionId = section.id; // map-section-03-09-25
    const datePart = sectionId.replace("map-section-", ""); // 03-09-25
    const jsonPath = `./res/json/${datePart.replace(/-25$/, "-2025")}/map.json`;

    // Optional loading placeholder
    section.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center; padding:10px; font-style:italic; color:#999;">
          Loading maps for ${datePart}...
        </td>
      </tr>
    `;

    try {
      const response = await fetch(jsonPath);
      if (!response.ok) throw new Error(`Failed to fetch ${jsonPath}`);

      const data = await response.json();
      const maps = Object.keys(data)
        .filter((key) => !isNaN(key))
        .map((key) => data[key]);

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

      maps.forEach((map) => {
        const row = document.createElement("tr");
        let imageHTML = `<img src="${map.image}" style="width: 220px" />`;
        if (map.image2) {
          imageHTML += `<br /><img src="${map.image2}" style="width: 220px; margin-top: 6px;" />`;
        }
        const textInfo = map.location ? map.location : map.description || "—";
        row.innerHTML = `
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content">${imageHTML}</span><br />
              <span style="font-weight:bold">${map.name}</span><br />
              <span>${map.mode}</span>
            </p>
          </td>
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content" style="font-size:11px">${textInfo}</span>
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
            ⚠️ Unable to load maps for ${datePart}
          </td>
        </tr>
      `;
    }
  }
}

window.addEventListener("DOMContentLoaded", loadAllmaps);
