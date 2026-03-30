const STAR_SVG = `<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>`;

export function createStars(rating: number, className = ""): HTMLElement {
  const container = document.createElement("div");
  container.className = `rw-stars ${className}`;

  for (let i = 1; i <= 5; i++) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 20 20");
    svg.setAttribute("class", `rw-star ${i <= rating ? "rw-star-filled" : ""}`);
    svg.innerHTML = STAR_SVG;
    container.appendChild(svg);
  }

  return container;
}

export function createStarInput(
  onChange: (rating: number) => void,
  initialValue = 0
): { element: HTMLElement; getValue: () => number } {
  let currentValue = initialValue;
  let hoverValue = 0;
  const container = document.createElement("div");
  container.className = "rw-stars rw-stars-input";

  const buttons: HTMLButtonElement[] = [];

  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.style.cssText = "background:none;border:none;padding:0;margin:0;cursor:pointer;outline:none;";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 20 20");
    svg.setAttribute("class", `rw-star`);
    svg.innerHTML = STAR_SVG;
    svg.style.pointerEvents = "none";
    btn.appendChild(svg);

    btn.addEventListener("mouseenter", () => {
      hoverValue = i;
      updateStars();
    });

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      currentValue = i;
      hoverValue = 0;
      onChange(i);
      updateStars();
    });

    buttons.push(btn);
    container.appendChild(btn);
  }

  container.addEventListener("mouseleave", () => {
    hoverValue = 0;
    updateStars();
  });

  function updateStars() {
    const activeValue = hoverValue || currentValue;
    buttons.forEach((btn, idx) => {
      const svg = btn.querySelector("svg")!;
      if (idx + 1 <= activeValue) {
        svg.setAttribute("class", "rw-star rw-star-filled");
      } else {
        svg.setAttribute("class", "rw-star");
      }
    });
  }

  updateStars();

  return { element: container, getValue: () => currentValue };
}
