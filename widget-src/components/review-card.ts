import { ReviewData } from "../api";
import { createStars } from "./stars";

export function createReviewCard(
  review: ReviewData,
  showMedia: boolean,
  onImageClick: (url: string, type: string) => void
): HTMLElement {
  const card = document.createElement("div");
  card.className = "rw-card";

  // Header: stars + author
  const header = document.createElement("div");
  header.className = "rw-card-header";

  const left = document.createElement("div");
  left.appendChild(createStars(review.rating));
  const author = document.createElement("span");
  author.className = "rw-card-author";
  author.textContent = ` ${review.customerName}`;
  left.appendChild(author);
  header.appendChild(left);

  card.appendChild(header);

  // Title
  const title = document.createElement("div");
  title.className = "rw-card-title";
  title.textContent = review.title;
  card.appendChild(title);

  // Body
  const body = document.createElement("div");
  body.className = "rw-card-body";
  body.textContent = review.body;
  card.appendChild(body);

  // Media
  if (showMedia && review.media && review.media.length > 0) {
    const mediaContainer = document.createElement("div");
    mediaContainer.className = "rw-card-media";

    for (const item of review.media) {
      if (item.type === "image") {
        const img = document.createElement("img");
        img.src = item.thumbnailUrl || item.url;
        img.alt = "Review photo";
        img.addEventListener("click", () => onImageClick(item.url, "image"));
        mediaContainer.appendChild(img);
      } else {
        const video = document.createElement("video");
        video.src = item.url;
        video.setAttribute("preload", "metadata");
        video.addEventListener("click", () => onImageClick(item.url, "video"));
        mediaContainer.appendChild(video);
      }
    }

    card.appendChild(mediaContainer);
  }

  // Admin Reply
  if (review.adminReply) {
    const reply = document.createElement("div");
    reply.className = "rw-card-reply";

    const replyLabel = document.createElement("div");
    replyLabel.className = "rw-card-reply-label";
    replyLabel.textContent = "Response from the team";

    const replyText = document.createElement("div");
    replyText.className = "rw-card-reply-text";
    replyText.textContent = review.adminReply;

    reply.appendChild(replyLabel);
    reply.appendChild(replyText);
    card.appendChild(reply);
  }

  return card;
}
