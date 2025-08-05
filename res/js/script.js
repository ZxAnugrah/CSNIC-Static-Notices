function dark_mode_theme() {
  var element = document.body;
  element.classList.toggle("dark-mode");

  var x = document.getElementById("changetheme");
  if (x.innerHTML === "Dark&nbsp;&nbsp;Mode") {
    x.innerHTML = "Light&nbsp;Mode";
  } else {
    x.innerHTML = "Dark&nbsp;&nbsp;Mode";
  }

  var element = document.getElementById("changetheme");
  element.classList.toggle("btn-lightmode");
}

function openModal(url) {
  document.getElementById("popupIframe").src = url;
  document.getElementById("popupModal").style.display = "block";
  // Add event listener to close modal when clicking outside iframe
  setTimeout(function () {
    document.addEventListener("mousedown", outsideModalHandler);
    setSidebarToggleVisible(false);
    document.body.classList.add("modal-open");
  }, 0);
}

function closeModal() {
  document.getElementById("popupModal").style.display = "none";
  document.getElementById("popupIframe").src = "";
  document.removeEventListener("mousedown", outsideModalHandler);
  setSidebarToggleVisible(true);
  document.body.classList.remove("modal-open");
}

// Handler to close modal when clicking outside the iframe
function outsideModalHandler(e) {
  var modal = document.getElementById("popupModal");
  var modalContent = document.querySelector(".modal-content");
  if (modal.style.display === "block" && modal && modalContent && !modalContent.contains(e.target)) {
    closeModal();
  }
}

function setupCountdown(liId, endDateStr) {
  var li = document.querySelector('li[data-board-id="' + liId + '"]');
  if (!li) return;

  // Create and append countdown span if not already present
  var tit = li.querySelector(".tit");
  var countdownSpan = tit.querySelector(".countdown-timer");
  if (!countdownSpan) {
    countdownSpan = document.createElement("span");
    // countdownSpan.className = "countdown-timer";
    // countdownSpan.style.marginLeft = "10px";
    // countdownSpan.style.fontWeight = "bold";
    // countdownSpan.style.color = "#d9534f";
    // tit.appendChild(countdownSpan);
  }

  var endDate = new Date(endDateStr);

  function updateCountdown() {
    var now = new Date();
    var diff = endDate - now;
    if (diff <= 0) {
      li.style.display = "none";
      clearInterval(timer);
      return;
    }
    var hours = Math.floor(diff / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);
    countdownSpan.textContent = `(${hours}h ${minutes}m ${seconds}s left)`;
  }

  updateCountdown();
  var timer = setInterval(updateCountdown, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  setupCountdown(6000, "2025-08-06T14:00:00");
  setupCountdown(6001, "2025-08-04T13:57:00");
});

function eventexpired() {
  alert("This event has expired. Please check the latest announcements for new events.");
}
