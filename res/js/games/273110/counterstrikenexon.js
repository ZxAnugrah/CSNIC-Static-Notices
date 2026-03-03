const NEXON_API_URL = "https://csn-statsapi-csonline.nexon.com/v1/api/wic/steam/home/news/list?limit=1";
const PROXY_URL = "https://api.allorigins.win/raw?url=";

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
          // Replace image tags
          .replace(/\[img\](.*?)\[\/img\]/g, '<img src="$1" style="max-width:200px;height:auto;display:table-caption;margin-top:10px;margin-bottom:-10px;" />')
          // Replace bold tags
          .replace(/\[b\](.*?)\[\/b\]/g, "<strong>$1</strong>")
          // Replace headers
          .replace(/\[h1\](.*?)\[\/h1\]/g, '<h4 style="color:#ff6b00;">$1</h5>')
          .replace(/\[h2\](.*?)\[\/h2\]/g, '<h5 style="color:#ff6b00;">$1</h5>')
          .replace(/\[h3\](.*?)\[\/h3\]/g, '<h6 style="color:#ffa500;">$1</h6>')
          // Replace lists
          .replace(/\[list\]/g, '<ul style="margin:5px 0; padding-left:20px;">')
          .replace(/\[\/list\]/g, "</ul>")
          .replace(/\[\*\]/g, "<li>")

          .replace(/\[i\](.*?)\[\/i\]/g, "<i>$1</i>")
          // Replace color tags
          .replace(/\[color=#(.*?)\](.*?)\[\/color\]/g, '<span style="color:#$1;">$2</span>')
          // Replace URLs
          .replace(/\[url=(.*?)\](.*?)\[\/url\]/g, '<a href="$1" target="_blank" style="color:#4da6ff;">$2</a>')
          // Replace line breaks
          .replace(/\n/g, "<br />");

        // Handle Steam clan images specifically
        contents = contents.replace(/{STEAM_CLAN_IMAGE}\/([^}]+)/g, "https://clan.cloudflare.steamstatic.com/images//$1");

        newsContainer.innerHTML += `
          <a href="${item.url}" target="_blank" style="text-decoration: none;">
            <div class="news-item">
               <h4>${item.title}</h4>
              <div class="news-meta" style="font-size:12px;">
                <span>By: ${item.author}</span> | 
                <span>Posted: ${date}</span>
              </div>
              <div class="news-content">${contents}</div>
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
    document.getElementById("steam-news").innerHTML = "<p style='color:red;'>Failed to load news. Please try again later.</p>";
  });
