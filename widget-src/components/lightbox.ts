export function showLightbox(url: string, type: string) {
  const overlay = document.createElement("div");
  overlay.className = "rw-lightbox";

  const close = document.createElement("button");
  close.className = "rw-lightbox-close";
  close.textContent = "✕";
  close.addEventListener("click", () => overlay.remove());
  overlay.appendChild(close);

  if (type === "video") {
    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    video.autoplay = true;
    overlay.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Review media";
    overlay.appendChild(img);
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
}
