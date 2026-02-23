import { WidgetAPI, ReviewData } from "./api";
import { createSummary } from "./components/summary";
import { createReviewCard } from "./components/review-card";
import { createReviewForm } from "./components/review-form";
import { showLightbox } from "./components/lightbox";
import widgetCSS from "./styles/widget.css";

interface WidgetState {
  currentPage: number;
  totalPages: number;
  reviews: ReviewData[];
}

(function () {
  // Find our script tag
  const scripts = document.querySelectorAll("script[data-api-key]");
  let scriptEl: HTMLScriptElement | null = null;

  for (const s of scripts) {
    if ((s as HTMLScriptElement).src.includes("reviews-widget")) {
      scriptEl = s as HTMLScriptElement;
      break;
    }
  }

  if (!scriptEl) {
    // Fallback: use document.currentScript
    scriptEl = document.currentScript as HTMLScriptElement;
  }

  if (!scriptEl) {
    console.error("[MDB Reviews] Script tag not found");
    return;
  }

  const apiKey = scriptEl.getAttribute("data-api-key");
  const targetSelector =
    scriptEl.getAttribute("data-target") || "#reviews-widget";

  if (!apiKey) {
    console.error("[MDB Reviews] data-api-key attribute is required");
    return;
  }

  // Determine base URL from script src
  const scriptSrc = scriptEl.src;
  const baseUrl = scriptSrc
    ? new URL(scriptSrc).origin
    : window.location.origin;

  const api = new WidgetAPI(baseUrl, apiKey);

  function init() {
    const container = document.querySelector(targetSelector);
    if (!container) {
      console.error(
        `[MDB Reviews] Container "${targetSelector}" not found`
      );
      return;
    }

    // Inject CSS
    const style = document.createElement("style");
    style.textContent = widgetCSS;
    container.appendChild(style);

    // Set loading state
    const loadingEl = document.createElement("div");
    loadingEl.className = "rw-loading";
    loadingEl.textContent = "Loading reviews...";
    container.appendChild(loadingEl);

    // Load config + reviews
    Promise.all([api.fetchConfig(), api.fetchReviews(1)]).then(
      ([config, data]) => {
        // Remove loading
        loadingEl.remove();

        // Apply CSS custom properties
        const wc = config.widget;
        (container as HTMLElement).style.setProperty(
          "--rw-primary",
          wc.primaryColor
        );
        (container as HTMLElement).style.setProperty(
          "--rw-bg",
          wc.backgroundColor
        );
        (container as HTMLElement).style.setProperty(
          "--rw-text",
          wc.textColor
        );

        const wrapper = document.createElement("div");
        wrapper.className = "rw-container";

        const state: WidgetState = {
          currentPage: data.page,
          totalPages: data.totalPages,
          reviews: data.reviews,
        };

        // Summary
        if (data.stats.totalReviews > 0) {
          wrapper.appendChild(createSummary(data.stats));
        }

        // Review list
        const listEl = document.createElement("div");
        listEl.className = "rw-list";
        renderReviews(listEl, state.reviews, wc.showMedia);
        wrapper.appendChild(listEl);

        // Empty state
        if (data.stats.totalReviews === 0) {
          const empty = document.createElement("div");
          empty.className = "rw-empty";
          empty.textContent = "No reviews yet. Be the first!";
          wrapper.appendChild(empty);
        }

        // Pagination
        if (state.totalPages > 1) {
          const pagination = createPagination(state, listEl, wc.showMedia);
          wrapper.appendChild(pagination);
        }

        // Review form
        if (wc.showReviewForm) {
          const form = createReviewForm(api, () => {
            // Reload reviews after submission
            api.fetchReviews(1).then((freshData) => {
              state.currentPage = 1;
              state.totalPages = freshData.totalPages;
              state.reviews = freshData.reviews;
              renderReviews(listEl, state.reviews, wc.showMedia);
            });
          });
          wrapper.appendChild(form);
        }

        container.appendChild(wrapper);
      },
      (err) => {
        loadingEl.textContent = "Could not load reviews.";
        console.error("[MDB Reviews]", err);
      }
    );
  }

  function renderReviews(
    listEl: HTMLElement,
    reviews: ReviewData[],
    showMedia: boolean
  ) {
    listEl.innerHTML = "";
    for (const review of reviews) {
      listEl.appendChild(
        createReviewCard(review, showMedia, (url, type) =>
          showLightbox(url, type)
        )
      );
    }
  }

  function createPagination(
    state: WidgetState,
    listEl: HTMLElement,
    showMedia: boolean
  ): HTMLElement {
    const pag = document.createElement("div");
    pag.className = "rw-pagination";

    const prevBtn = document.createElement("button");
    prevBtn.className = "rw-btn";
    prevBtn.textContent = "← Previous";

    const pageInfo = document.createElement("span");
    pageInfo.className = "rw-page-info";

    const nextBtn = document.createElement("button");
    nextBtn.className = "rw-btn";
    nextBtn.textContent = "Next →";

    function updatePagination() {
      pageInfo.textContent = `Page ${state.currentPage} of ${state.totalPages}`;
      prevBtn.disabled = state.currentPage <= 1;
      nextBtn.disabled = state.currentPage >= state.totalPages;
    }

    async function loadPage(page: number) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      pageInfo.textContent = "Loading...";

      try {
        const data = await api.fetchReviews(page);
        state.currentPage = data.page;
        state.totalPages = data.totalPages;
        state.reviews = data.reviews;
        renderReviews(listEl, state.reviews, showMedia);

        // Scroll to top of widget
        listEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (err) {
        console.error("[MDB Reviews]", err);
      }

      updatePagination();
    }

    prevBtn.addEventListener("click", () => {
      if (state.currentPage > 1) loadPage(state.currentPage - 1);
    });

    nextBtn.addEventListener("click", () => {
      if (state.currentPage < state.totalPages)
        loadPage(state.currentPage + 1);
    });

    pag.appendChild(prevBtn);
    pag.appendChild(pageInfo);
    pag.appendChild(nextBtn);

    updatePagination();
    return pag;
  }

  // Boot: wait for DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
