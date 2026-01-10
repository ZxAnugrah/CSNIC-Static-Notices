async function loadAllmaps() {
  // Select all map sections (e.g. map-section-MM-DD-YY)
  const mapSections = document.querySelectorAll('[id^="map-section-"]');
  if (!mapSections.length) return;

  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);

  for (const section of mapSections) {
    const sectionId = section.id; // map-section-MM-DD-YY
    const datePart = sectionId.replace("map-section-", ""); // MM-DD-YY
    const jsonPath = `https://zxanugrah.github.io/maps/${datePart.replace(/-\d{2}$/, `-${currentYear}`)}/map.json`;
    const chnjsonPath = `https://zxanugrah.github.io/chn_patch/maps/${datePart.replace(/-\d{2}$/, `-${currentYear}`)}/map.json`;

    // Optional loading placeholder
    section.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center; padding:10px; font-style:italic; color:#999;">
          Loading maps for ${datePart}...
        </td>
      </tr>
    `;

    try {
      // Fetch both JSON files simultaneously
      const [response, response_chn] = await Promise.allSettled([fetch(jsonPath), fetch(chnjsonPath)]);

      let allMaps = [];

      // Process global maps
      if (response.status === "fulfilled" && response.value.ok) {
        const data = await response.value.json();
        const maps = Object.keys(data)
          .filter((key) => !isNaN(key))
          .map((key) => ({ ...data[key], source: "global" }));
        allMaps = [...allMaps, ...maps];
      }

      // Process China maps
      if (response_chn.status === "fulfilled" && response_chn.value.ok) {
        const data_chn = await response_chn.value.json();
        const maps_chn = Object.keys(data_chn)
          .filter((key) => !isNaN(key))
          .map((key) => ({ ...data_chn[key], source: "china", isChina: true }));
        allMaps = [...allMaps, ...maps_chn];
      }

      if (allMaps.length === 0) {
        throw new Error("No map data found");
      }

      // Insert header
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

      // Append all maps (global + china)
      allMaps.forEach((map) => {
        // Add China indicator if from China JSON
        const chinaIndicator = map.isChina ? "" : "";

        let imageHTML = `<img src="${map.image}" style="width: 220px" />`;
        if (map.image2) {
          imageHTML += `<br /><img src="${map.image2}" style="width: 220px; margin-top: 6px;" />`;
        }

        const textInfo = map.location ? map.location : map.description || "—";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content">${imageHTML}</span><br />
              <span style="font-weight:bold">
                ${map.name}
                ${chinaIndicator}
              </span><br />
              <span>${map.mode}</span>
            </p>
          </td>
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content" style="font-size:11px">
                ${textInfo}
                ${chinaIndicator}
              </span>
            </p>
          </td>
        `;
        section.appendChild(row);
      });
    } catch (err) {
      console.error(`Error loading maps for ${datePart}:`, err);
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
