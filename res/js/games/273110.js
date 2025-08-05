const API_URL = "https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=273110&count=2&maxlength=350&format=json";
const PROXY_URL = "https://cors-anywhere.herokuapp.com/"; // CORS proxy
const STEAM_CLAN_IMAGE_URL = "https://clan.cloudflare.steamstatic.com/images/"; // Official Steam clan image CDN

fetch(PROXY_URL + API_URL)
  .then((response) => response.json())
  .then((data) => {
    const newsContainer = document.getElementById("steam-news");
    if (data.appnews?.newsitems) {
      data.appnews.newsitems.forEach((item) => {
        let contents = item.contents.replace(/\{STEAM_CLAN_IMAGE\}/g, STEAM_CLAN_IMAGE_URL);
        // Optionally, convert image links to <img> tags for better display
        contents = contents.replace(/(https:\/\/clan\.cloudflare\.steamstatic\.com\/images\/[^\s]+(\.jpg|\.png|\.jpeg|\.gif))/g, '<img src="$1" style="max-width:200px;height:auto;margin:8px 0;display:table-caption;" />');

        newsContainer.innerHTML += `
            <a href="${item.url}" target="_blank" style="text-decoration: none;">
                <div class="news-item">
                    <h4>${item.title}</h4>
                    <div class="news-content">${contents}</div>
                    <small class="news-date">Posted: ${new Date(item.date * 1000).toLocaleString()}</small>
                </div>
            </a>            
        `;
      });
    } else {
      newsContainer.innerHTML = "<p>No news found or API error.</p>";
    }
  })
  .catch((error) => {
    console.error("Error:", error);
    document.getElementById("steam-news").innerHTML = `
      <p>Failed to load news. Try open this sites, and press the button. After that, refresh this pages.</p>
      <a onclick="openModal('https://cors-anywhere.herokuapp.com/corsdemo')" href="javascript:void(0)">
        <div class="icon-box">
            <span class="tit">Open site</span>
        </div>
      </a>
    `;
  });
