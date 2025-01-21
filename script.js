document.addEventListener("DOMContentLoaded", function () {
  const qrReader = new Html5Qrcode("qr-reader");
  const status = document.getElementById("status");
  const playerContainer = document.getElementById("player-container");
  const player = document.getElementById("player");
  const startScanButton = document.getElementById("start-scan");
  document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Laad de Html5Qrcode library dynamisch
    const html5QrcodeModule = await import('https://cdn.jsdelivr.net/npm/html5-qrcode/minified/html5-qrcode.min.js');
    const Html5Qrcode = html5QrcodeModule.Html5Qrcode;

    // Nu kun je Html5Qrcode gebruiken zoals normaal
    const qrReader = new Html5Qrcode("qr-reader");
    console.log("Html5Qrcode geladen en klaar om te gebruiken.");

    // De rest van je QR-scanner-code hier
    const status = document.getElementById("status");
    const startScanButton = document.getElementById("start-scan");

    startScanButton.addEventListener("click", function () {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => {
          qrReader.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
              qrReader.stop();
              status.textContent = `QR-code gescand: ${decodedText}`;
            },
            (error) => {
              console.error(error);
            }
          );
        })
        .catch((err) => {
          console.error("Camera-toegang geweigerd:", err);
        });
    });
  } catch (err) {
    console.error("Error bij het laden van Html5Qrcode:", err);
  }
});

  // Start de QR-scanner wanneer op de knop wordt geklikt
  startScanButton.addEventListener("click", function () {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        console.log("Camera-toegang toegestaan.");
        startQrScanner();
        startScanButton.style.display = "none"; // Verberg de knop na starten
        status.textContent = "Houd een QR-code voor de camera.";
      })
      .catch((err) => {
        console.error("Camera-toegang geweigerd:", err);
        status.textContent =
          "Toegang tot de camera is vereist om de QR-scanner te gebruiken.";
      });
  });

  // Start de QR-scanner
  function startQrScanner() {
    const qrReaderDiv = document.getElementById("qr-reader");
    qrReaderDiv.style.display = "block";

    qrReader.start(
      { facingMode: "environment" }, // Gebruik de camera aan de achterkant
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        // Stop de QR-scanner
        qrReader.stop();

        // Controleer of het een YouTube-link is
        if (decodedText.includes("youtube.com") || decodedText.includes("youtu.be")) {
          status.textContent = "Geldige YouTube-link gevonden!";
          playYouTubeAudio(decodedText);
        } else {
          status.textContent = "Ongeldige link. Probeer opnieuw.";
        }
      },
      (errorMessage) => {
        console.error(errorMessage);
      }
    );
  }

  // Speel alleen audio van de YouTube-link
  function playYouTubeAudio(url) {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&showinfo=0`;
      player.src = embedUrl;
      player.style.height = "100px";
      player.style.visibility = "visible";
      playerContainer.style.display = "block";
    } else {
      status.textContent = "Kon geen video-ID vinden.";
    }
  }

  // Extract de YouTube-video-ID
  function extractYouTubeVideoId(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|v\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
});
