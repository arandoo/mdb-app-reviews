import { ReviewStats } from "../api";
import { createStars } from "./stars";

export function createSummary(stats: ReviewStats): HTMLElement {
  const section = document.createElement("div");
  section.className = "rw-summary";

  // Left: big number + stars
  const avg = document.createElement("div");
  avg.className = "rw-summary-avg";

  const num = document.createElement("div");
  num.className = "rw-summary-number";
  num.textContent = stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—";
  avg.appendChild(num);

  avg.appendChild(createStars(Math.round(stats.averageRating), "rw-stars-lg"));

  const count = document.createElement("div");
  count.className = "rw-summary-count";
  count.textContent = `${stats.totalReviews} Review${stats.totalReviews !== 1 ? "s" : ""}`;
  avg.appendChild(count);

  section.appendChild(avg);

  // Right: distribution bars
  const bars = document.createElement("div");
  bars.className = "rw-summary-bars";

  for (let star = 5; star >= 1; star--) {
    const rowCount = stats.distribution[star] || 0;
    const pct = stats.totalReviews > 0 ? (rowCount / stats.totalReviews) * 100 : 0;

    const row = document.createElement("div");
    row.className = "rw-bar-row";

    const label = document.createElement("span");
    label.className = "rw-bar-label";
    label.textContent = `${star} ★`;

    const track = document.createElement("div");
    track.className = "rw-bar-track";

    const fill = document.createElement("div");
    fill.className = "rw-bar-fill";
    fill.style.width = `${pct}%`;
    track.appendChild(fill);

    const countEl = document.createElement("span");
    countEl.className = "rw-bar-count";
    countEl.textContent = String(rowCount);

    row.appendChild(label);
    row.appendChild(track);
    row.appendChild(countEl);
    bars.appendChild(row);
  }

  section.appendChild(bars);

  return section;
}
