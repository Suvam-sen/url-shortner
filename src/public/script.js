const shortenButton = document.querySelector("#shortenButton");
const urlInput = document.querySelector("#urlInput");
const shortUrlAnchor = document.querySelector("#shortUrl");
const clicksSpan = document.querySelector("#clicks");
const outputDiv = document.querySelector("#output");

shortenButton.addEventListener("click", () => {
  const longUrl = urlInput.value;

  fetch("/url/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: longUrl }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        console.error(data.message);
        return;
      }

      const shortUrl = window.location.origin + "/" + data.data.shortId;
      shortUrlAnchor.href = shortUrl;
      shortUrlAnchor.textContent = shortUrl;
      outputDiv.style.display = "block";

      // Fetch click analytics
      fetch(`/url/stats/${data.data.shortId}`)
        .then((response) => response.json())
        .then((stats) => {
          if (stats.success) {
            clicksSpan.textContent = stats.data.clicks;
          } else {
            clicksSpan.textContent = "0";
          }
        })
        .catch((error) => console.error("Error fetching stats:", error));
    })
    .catch((error) => console.error(error));
});
