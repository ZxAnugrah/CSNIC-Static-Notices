async function loadAllMedals() {
  // Select all medal sections (e.g. medal-section-MM-DD-YY)
  const medalSections = document.querySelectorAll('[id^="medal-section-"]');
  if (!medalSections.length) return;

  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);

  for (const section of medalSections) {
    const sectionId = section.id; // medal-section-MM-DD-YY
    const datePart = sectionId.replace("medal-section-", ""); // MM-DD-YY
    const jsonPath = `https://zxanugrah.github.io/medals/${datePart.replace(`-${currentYear}-`, /-\d{2}$/)}/medal.json`;
    const chnjsonPath = `https://zxanugrah.github.io/chn_patch/medals/${datePart.replace(`-${currentYear}-`, /-\d{2}$/)}/medal.json`;

    // Optional loading placeholder
    section.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center; padding:10px; font-style:italic; color:#999;">
          Loading medals for ${datePart}...
        </td>
      </tr>
    `;

    try {
      // Fetch both JSON files simultaneously
      const [response, response_chn] = await Promise.allSettled([fetch(jsonPath), fetch(chnjsonPath)]);

      let allMedals = [];

      // Process global medals
      if (response.status === "fulfilled" && response.value.ok) {
        const data = await response.value.json();
        const medals = Object.keys(data)
          .filter((key) => !isNaN(key))
          .map((key) => ({ ...data[key], source: "global" }));
        allMedals = [...allMedals, ...medals];
      }

      // Process China medals
      if (response_chn.status === "fulfilled" && response_chn.value.ok) {
        const data_chn = await response_chn.value.json();
        const medals_chn = Object.keys(data_chn)
          .filter((key) => !isNaN(key))
          .map((key) => ({ ...data_chn[key], source: "china", isChina: true }));
        allMedals = [...allMedals, ...medals_chn];
      }

      if (allMedals.length === 0) {
        throw new Error("No medal data found");
      }

      // Insert header
      section.innerHTML = `
        <tr>
          <td class="tr-box-title" colspan="3">
            <p class="MsoNormal p-normal-tr-box">
              <span class="span-text-title-box">Medal</span>
            </p>
          </td>
        </tr>
        <tr style="height: 21.9333px">
          <td class="tr-box-title">
            <p class="MsoNormal p-normal-tr-box">
              <span class="span-text-title-box" >Deskripsi</span>
            </p>
          </td>
          <td class="tr-box-title">
            <p class="MsoNormal p-normal-tr-box">
              <span class="span-text-title-box">Honor Point</span>
            </p>
          </td>
          <td class="tr-box-title">
            <p class="MsoNormal p-normal-tr-box">
              <span class="span-text-title-box">Preview</span>
            </p>
          </td>
        </tr>
      `;

      // Append all medals (global + china)
      allMedals.forEach((medal) => {
        // Add China indicator if from China JSON
        const chinaIndicator = medal.isChina ? "" : "";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content" style="font-size:11px">${medal.description}</span>
            </p>
          </td>
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content" style="font-size:11px">${medal.honor}</span>
            </p>
          </td>
          <td class="border-box-content">
            <p class="MsoNormal p-normal-tr-box">
              <span class="text-box-content">
                <img src="${medal.image}" width="80px" style="padding: 2px" title="${medal.name}"/>
                <br />
                <span style="font-size:11px;font-weight:bold">[${medal.name}]</span>
              </span>
            </p>
          </td>
        `;
        section.appendChild(row);
      });
    } catch (err) {
      console.error(`Error loading medals for ${datePart}:`, err);
      section.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; padding: 15px; color:#e74c3c;">
            ⚠️ Unable to load medals for ${datePart}
          </td>
        </tr>
      `;
    }
  }
}

window.addEventListener("DOMContentLoaded", loadAllMedals);
