// Diagrams: natural size on wide screens; on phones and tablets a diagram shown smaller
// than its natural size becomes a card that opens full screen, where it can be panned
// and zoomed.

{
// Phones and tablets: a diagram shown below EXPAND_BELOW of its size can be opened full screen.
const NARROW = matchMedia("(max-width: 991.98px)");
const EXPAND_BELOW = 0.85;
const MAX_ZOOM = 3;

const naturalSize = (svg) => {
  const box = svg.viewBox?.baseVal;
  return box?.width ? [box.width, box.height] : [parseFloat(svg.style.maxWidth) || 0, 0];
};

// Show each diagram at its natural size, shrinking it only when the column is narrower.
// Without this, sphinxcontrib-mermaid stretches every diagram to the full column width.
const fit = (svg) => {
  const [width] = naturalSize(svg);
  if (width) svg.style.setProperty("max-width", `min(100%, ${width}px)`, "important");
};

const ICON = (path) => `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${path}" /></svg>`;
const ICON_EXPAND = ICON("M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4");
const ICON_CLOSE = ICON("M3 3l10 10M13 3L3 13");
const ICON_MINUS = ICON("M3 8h10");
const ICON_PLUS = ICON("M3 8h10M8 3v10");

// Mark the diagrams shown too small to read, and give them an Expand button.
const markExpandable = (pre) => {
  const svg = pre.querySelector(":scope > svg");
  if (!svg) return;
  const [natural] = naturalSize(svg);
  const shown = svg.getBoundingClientRect().width;
  const small = NARROW.matches && natural > 0 && shown > 0 && shown / natural < EXPAND_BELOW;
  pre.classList.toggle("is-expandable", small);
  let button = pre.querySelector(":scope > .diagram-expand");
  if (!small) button?.remove();
  else if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.className = "diagram-expand";
    button.innerHTML = `${ICON_EXPAND}<span>Expand</span>`;
    button.setAttribute("aria-label", "Open the diagram full screen");
    pre.append(button);
  }
};

// ---- Full-screen view --------------------------------------------------------------

let viewer = null;

function buildViewer() {
  const dialog = document.createElement("dialog");
  dialog.className = "diagram-viewer";
  dialog.setAttribute("aria-label", "Diagram");
  dialog.innerHTML = `
    <div class="diagram-viewer__bar">
      <button type="button" data-zoom="0.8" aria-label="Zoom out">${ICON_MINUS}</button>
      <button type="button" data-zoom="1.25" aria-label="Zoom in">${ICON_PLUS}</button>
      <span class="diagram-viewer__hint"></span>
      <button type="button" data-close aria-label="Close" autofocus>${ICON_CLOSE}</button>
    </div>
    <div class="diagram-viewer__canvas"></div>`;
  document.body.append(dialog);

  const canvas = dialog.querySelector(".diagram-viewer__canvas");
  const hint = dialog.querySelector(".diagram-viewer__hint");
  const state = { svg: null, width: 0, height: 0, zoom: 1, fit: 1 };

  // The zoom that shows the whole diagram, and never more than its natural size.
  const fitZoom = () =>
    Math.min(1, (canvas.clientWidth - 32) / state.width, (canvas.clientHeight - 32) / (state.height || state.width));

  // Zoom around a point of the canvas (its center by default), keeping that point still.
  const setZoom = (zoom, at) => {
    if (!state.svg) return;
    zoom = Math.min(MAX_ZOOM, Math.max(state.fit, zoom));
    const box = canvas.getBoundingClientRect();
    const x = at ? at.x - box.left : canvas.clientWidth / 2;
    const y = at ? at.y - box.top : canvas.clientHeight / 2;
    const ratio = zoom / state.zoom;
    const left = (canvas.scrollLeft + x) * ratio - x;
    const top = (canvas.scrollTop + y) * ratio - y;
    state.zoom = zoom;
    state.svg.style.width = `${state.width * zoom}px`;
    canvas.scrollLeft = left;
    canvas.scrollTop = top;
  };

  // Wide diagrams read better with the phone turned sideways.
  const updateHint = () => {
    const portrait = innerHeight > innerWidth;
    hint.textContent =
      portrait && state.width > canvas.clientWidth * 1.3
        ? "Turn your phone sideways for more"
        : "Pinch or double-tap to zoom";
  };

  const reset = () => {
    state.fit = fitZoom();
    state.zoom = 1;
    state.svg.style.width = `${state.width}px`;
    canvas.scrollTo(0, 0);
    updateHint();
  };

  dialog.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.hasAttribute("data-close")) dialog.close();
    else setZoom(state.zoom * Number(button.dataset.zoom));
  });
  dialog.addEventListener("close", () => {
    canvas.replaceChildren();
    state.svg = null;
  });
  addEventListener("resize", () => {
    if (!state.svg) return;
    state.fit = fitZoom();
    setZoom(state.zoom);
    updateHint();
  });

  // Two fingers pinch the diagram (not the page); a double tap switches between the
  // whole diagram and its natural size.
  let pinch = null;
  let lastTap = { time: 0, x: 0, y: 0 };
  let touchToggle = 0;
  const distance = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  const middle = (t) => ({ x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 });
  canvas.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length === 2) pinch = { distance: distance(event.touches), zoom: state.zoom };
    },
    { passive: true },
  );
  canvas.addEventListener(
    "touchmove",
    (event) => {
      if (!pinch || event.touches.length !== 2) return;
      event.preventDefault();
      setZoom((pinch.zoom * distance(event.touches)) / pinch.distance, middle(event.touches));
    },
    { passive: false },
  );
  canvas.addEventListener("touchend", (event) => {
    if (event.touches.length < 2) pinch = null;
    if (event.touches.length || event.changedTouches.length !== 1) return;
    const touch = event.changedTouches[0];
    const now = performance.now();
    const near = Math.hypot(touch.clientX - lastTap.x, touch.clientY - lastTap.y) < 30;
    if (now - lastTap.time < 320 && near) {
      event.preventDefault();
      const at = { x: touch.clientX, y: touch.clientY };
      setZoom(state.zoom > state.fit + 0.01 ? state.fit : 1, at);
      lastTap.time = 0;
      touchToggle = now;
    } else {
      lastTap = { time: now, x: touch.clientX, y: touch.clientY };
    }
  });
  canvas.addEventListener("dblclick", (event) => {
    if (performance.now() - touchToggle < 600) return; // already handled as a touch double tap
    setZoom(state.zoom > state.fit + 0.01 ? state.fit : 1, { x: event.clientX, y: event.clientY });
  });
  // Safari's own pinch gesture would zoom the whole page.
  dialog.addEventListener("gesturestart", (event) => event.preventDefault());

  return { dialog, canvas, state, reset };
}

function openViewer(pre) {
  const source = pre.querySelector(":scope > svg");
  if (!source) return;
  viewer ??= buildViewer();
  const { dialog, canvas, state, reset } = viewer;

  // A copy with its own ids, so its styles and arrowheads don't clash with the page's.
  const id = source.id;
  const holder = document.createElement("div");
  holder.innerHTML = id ? source.outerHTML.replaceAll(id, `${id}-full`) : source.outerHTML;
  const svg = holder.firstElementChild;
  svg.removeAttribute("style");
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  canvas.replaceChildren(svg);

  dialog.showModal();
  const [width, height] = naturalSize(source);
  Object.assign(state, { svg, width, height });
  reset();
}

document.addEventListener("click", (event) => {
  const pre = event.target.closest("pre.mermaid.is-expandable");
  if (pre && !event.target.closest("a")) openViewer(pre);
});

// ---- Keep sizes and buttons current --------------------------------------------------

const refresh = () =>
  document.querySelectorAll("pre.mermaid").forEach((pre) => {
    const svg = pre.querySelector(":scope > svg");
    if (!svg) return;
    fit(svg);
    markExpandable(pre);
  });

new MutationObserver(refresh).observe(document.documentElement, { childList: true, subtree: true });
let pending = 0;
let lastWidth = innerWidth;
addEventListener("resize", () => {
  // Safari resizes the viewport's height as its toolbar shrinks and grows while
  // scrolling; only a width change can change a diagram's size.
  if (innerWidth === lastWidth) return;
  lastWidth = innerWidth;
  cancelAnimationFrame(pending);
  pending = requestAnimationFrame(refresh);
});
}
