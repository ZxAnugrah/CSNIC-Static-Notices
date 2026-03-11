const NEXON_API_URL = "https://csn-statsapi-csonline.nexon.com/v1/api/wic/steam/home/news/list?limit=1";
const PROXY_URL = "https://api.allorigins.win/raw?url=";

function fetchNews() {
  fetch(PROXY_URL + encodeURIComponent(NEXON_API_URL))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const newsContainer = document.getElementById("steam-news");

      if (data && data.res && data.res.length > 0) {
        newsContainer.innerHTML = ""; // Clear container

        data.res.forEach((item) => {
          // Format the date
          const date = new Date(item.date * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          // Process the contents - replace Steam BBCode with HTML
          let contents = item.contents
            // Handle the new image format with src attribute
            .replace(/\[img src=\\?"(.*?)\\?"\]/g, '<img src="$1" style="max-width:200px; height:auto; margin:10px 0; border-radius:5px;" />')
            // Replace old image tags as fallback
            .replace(/\[img\](.*?)\[\/img\]/g, '<img src="$1" style="max-width:100%; height:auto; margin:10px 0; border-radius:5px;" />')
            // Replace paragraph tags
            .replace(/\[p\](.*?)\[\/p\]/g, "<p>$1</p>")
            .replace(/\[p align=\\"(.*?)\\"\](.*?)\[\/p\]/g, '<p style="text-align:$1;">$2</p>')
            // Replace bold tags
            .replace(/\[b\](.*?)\[\/b\]/g, "<strong>$1</strong>")
            // Replace headers
            .replace(/\[h1\](.*?)\[\/h1\]/g, '<h4 style="color:#ff6b00; margin:15px 0 10px;">$1</h4>')
            .replace(/\[h2\](.*?)\[\/h2\]/g, '<h5 style="color:#ff6b00; margin:15px 0 10px;">$1</h5>')
            .replace(/\[h3\](.*?)\[\/h3\]/g, '<h6 style="color:#ffa500; margin:15px 0 10px;">$1</h6>')
            // Replace lists (handling nested lists)
            .replace(/\[list\]/g, '<ul style="margin:10px 0; padding-left:20px;">')
            .replace(/\[\/list\]/g, "</ul>")
            .replace(/\[\*\]/g, '<li style="margin-bottom:5px;">')
            .replace(/\[\/\*\]/g, "</li>")
            // Replace italic tags
            .replace(/\[i\](.*?)\[\/i\]/g, "<i>$1</i>")
            // Replace color tags
            .replace(/\[color=#(.*?)\](.*?)\[\/color\]/g, '<span style="color:#$1;">$2</span>')
            // Replace URLs
            .replace(/\[url=(.*?)\](.*?)\[\/url\]/g, '<a href="$1" target="_blank" style="color:#4da6ff; text-decoration:underline;">$2</a>')
            // Replace horizontal rules
            .replace(/\[hr\]\[\/hr\]/g, '<hr style="margin:20px 0; border:0; border-top:1px solid #ddd;">')
            .replace(/\[hr\]/g, '<hr style="margin:20px 0; border:0; border-top:1px solid #ddd;">')
            // Replace line breaks
            .replace(/\n/g, "<br />")
            // Clean up any remaining BBCode tags
            .replace(/\[\/?(?:list|item|p|b|i|h1|h2|h3|color|url|img|hr|align)[^\]]*\]/g, "");

          // Handle Steam clan images specifically (both formats)
          contents = contents.replace(/{STEAM_CLAN_IMAGE}\/([^"}]+)/g, "https://clan.cloudflare.steamstatic.com/images//$1");
          contents = contents.replace(/\\"{STEAM_CLAN_IMAGE}\/([^"}]+)\\"/g, "https://clan.cloudflare.steamstatic.com/images//$1");

          newsContainer.innerHTML += `
            <a href="${item.url}" target="_blank" style="text-decoration: none;">
              <div class="news-item">
                <h4>${item.title}</h4>
                <div class="news-meta" style="font-size:12px;">
                  <span>By: ${item.author}</span> | 
                  <span>Posted: ${date}</span>
                </div>
                <div class="news-content">
                  ${contents}
                </div>
                <div class="news-footer" style="text-align:right;">
                  <small style="color:#999;">${item.feedlabel}</small>
                </div>
              </div>
            </a>
          `;
        });
      } else {
        newsContainer.innerHTML = "<p>No news found or API error.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching news:", error);
      const newsContainer = document.getElementById("steam-news");
      newsContainer.innerHTML = `
        <div style="text-align: center; padding: 20px; border: 1px solid #ff4444; border-radius: 5px; background-color: #ffeeee;">
          <p style="color: #ff4444; margin-bottom: 15px;">
            <strong>⚠️ Failed to load news</strong><br>
            <span style="font-size: 12px;">${error.message}</span>
          </p>
          <button onclick="fetchNews()" style="
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
          ">
            <span>🔄</span> Try Again
          </button>
        </div>
      `;
    });
}

// Initial fetch when page loads
document.addEventListener("DOMContentLoaded", function () {
  fetchNews();
});
