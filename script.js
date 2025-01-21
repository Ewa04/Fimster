document.addEventListener("DOMContentLoaded", function () {
    const qrReader = new Html5Qrcode("qr-reader");
    const status = document.getElementById("status");
    const playerContainer = document.getElementById("player-container");
    const player = document.getElementById("player");
  
    // Start de QR-scanner
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
  
    function extractYouTubeVideoId(url) {
      const regex = /(?:youtube\.com\/(?:.*v=|v\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    }
  });
  