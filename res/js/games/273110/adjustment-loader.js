// Add responsive styles once
if (!document.getElementById("adjustment-styles")) {
  const styleTag = document.createElement("style");
  styleTag.id = "adjustment-styles";
  styleTag.textContent = `
    .adjustment-list ul { margin: 0; padding-left: 20px; }
    .adjustment-list li { margin-bottom: 12px; font-size: 14px; line-height: 1.5em; }
    .adjustment-list .adj-name { font-weight: bold; }
    .adjustment-list .adj-desc { color: #444; }
    
    .dark-mode .adjustment-list .adj-desc { color: #bbb; }
    
    @media (max-width: 900px) {
      .adjustment-list li { font-size: 13px; margin-bottom: 10px; }
    }
    @media (max-width: 600px) {
      .adjustment-list li { font-size: 12px; margin-bottom: 8px; }
      .adjustment-list ul { padding-left: 16px; }
    }
  `;
  document.head.appendChild(styleTag);
}

async function loadAllAdjustments() {
  const adjustmentSections = document.querySelectorAll('[id^="adjustment-section-"]');
  if (!adjustmentSections.length) return;

  for (const section of adjustmentSections) {
    const sectionId = section.id;
    const datePart = sectionId.replace("adjustment-section-", "");
    const jsonPath = `https://zxanugrah.github.io/adjustments/${datePart}/adjustment.json`;

    // Loading placeholder
    section.innerHTML = `
      <div style="text-align:center; padding:10px; font-style:italic; color:#999;">
        Loading adjustments for ${datePart}...
      </div>
    `;

    try {
      const response = await fetch(jsonPath);
      if (!response.ok) throw new Error("No adjustment data found");

      const data = await response.json();
      const adjustments = Object.keys(data)
        .filter((key) => !isNaN(key))
        .map((key) => data[key])
        .filter((item) => !item.hidden);

      if (adjustments.length === 0) {
        throw new Error("No adjustment data found");
      }

      // Build list
      let listHTML = '<div class="adjustment-list"><h4>Lainnya:</h4><ul>';
      adjustments.forEach((item) => {
        const descWithBreaks = item.description.replace(/\n/g, "<br />");
        listHTML += `
          <li>
            <span class="adj-name">${item.name}</span>
            <br />
            <span class="adj-desc">${descWithBreaks}</span>
          </li>
        `;
      });
      listHTML += "</ul></div>";

      section.innerHTML = listHTML;
    } catch (err) {
      console.error(`Error loading adjustments for ${datePart}:`, err);
      section.innerHTML = `
        <div style="text-align:center; padding: 15px; color:#e74c3c;">
          ⚠️ Unable to load adjustments for ${datePart}
        </div>
      `;
    }
  }
}

window.addEventListener("DOMContentLoaded", loadAllAdjustments);
