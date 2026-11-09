// Diagrams: natural size on wide screens, top to bottom on phones, full screen on tap.
// Loaded as a module after sphinxcontrib-mermaid's own module. Importing the same URL
// gives the same mermaid instance, wrapped here before the plugin's first render on
// window load. conf.py checks that this URL carries its mermaid_version.
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@12.1.0/dist/mermaid.esm.min.mjs";

// Phones: redraw left-to-right diagrams top to bottom when that makes the text larger.
const PHONE = matchMedia("(max-width: 767.98px)");
// Phones and tablets: a diagram still shown below EXPAND_BELOW of its size opens full screen.
const NARROW = matchMedia("(max-width: 991.98px)");
const EXPAND_BELOW = 0.85;
// Flip only when the text gets at least MIN_GAIN times larger and ends up at FLIP_MIN of
// its size or more. Below that the flipped diagram needs the full-screen view anyway,
// and there the layout as written reads better.
const MIN_GAIN = 1.1;
const FLIP_MIN = 0.65;
const MAX_ZOOM = 3;

const naturalWidth = (svg) => svg.viewBox?.baseVal?.width || parseFloat(svg.style.maxWidth) || 0;

// Show each diagram at its natural size, shrinking it only when the column is narrower.
// Without this, sphinxcontrib-mermaid stretches every diagram to the full column width.
const fit = (svg) => {
  const natural = naturalWidth(svg);
  if (natural) svg.style.setProperty("max-width", `min(100%, ${natural}px)`, "important");
};

// ---- Top to bottom on phones -------------------------------------------------------

// The top-level LR becomes TB, and so does every subgraph's LR.
const flip = (code) =>
  code
    .replace(/^(\s*(?:flowchart|graph)\s+)(?:LR|RL)\b/m, "$1TB")
    .replace(/^(\s*direction\s+)(?:LR|RL)\b/gm, "$1TB");

const svgWidth = (svg) => parseFloat(svg.match(/viewBox="[-\d.]+ [-\d.]+ ([\d.]+)/)?.[1]) || Infinity;

const choices = new Map(); // source -> { column, code }
let renders = 0;

// The layout that shows the text largest in this column: as written, or flipped.
// Returns the code, and the drawing too when it had to draw it to decide.
async function layoutFor(el) {
  const code = el.textContent;
  const flipped = flip(code);
  const column = el.clientWidth;
  if (flipped === code || !column) return { code };
  const known = choices.get(code);
  if (known?.column === column) return { code: known.code };

  const draw = async (c) => (await mermaid.render(`mllc-diagram-${++renders}`, c)).svg;
  const scale = (svg) => Math.min(1, column / svgWidth(svg));
  let best = { code, svg: await draw(code) };
  if (scale(best.svg) < 1) {
    const turned = { code: flipped, svg: await draw(flipped) };
    if (scale(turned.svg) >= FLIP_MIN && scale(turned.svg) >= scale(best.svg) * MIN_GAIN) best = turned;
  }
  choices.set(code, { column, code: best.code });
  return best;
}

const run = mermaid.run;
mermaid.run = async (options = {}) => {
  if (PHONE.matches && options.nodes) {
    const left = [];
    for (const el of options.nodes) {
      if (el.getAttribute("data-processed")) continue;
      try {
        const { code, svg } = await layoutFor(el);
        if (svg) {
          // Already drawn while deciding: use that drawing instead of drawing it again.
          el.innerHTML = svg;
          el.setAttribute("data-processed", "true");
        } else {
          el.textContent = code;
          left.push(el);
        }
      } catch (error) {
        console.warn("[diagrams] kept the written layout:", error);
        left.push(el);
      }
    }
    if (!left.length) return;
    options = { ...options, nodes: left };
  }
  return run.call(mermaid, options);
};

// Crossing the phone width (rotating the phone) redraws every diagram.
PHONE.addEventListener("change", () => window.runMermaid?.(true));

// ---- Full-screen view --------------------------------------------------------------

const ICON_EXPAND =
  '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" /></svg>';
const ICON_CLOSE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" /></svg>';
const ICON_MINUS = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10" /></svg>';
const ICON_PLUS = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M8 3v10" /></svg>';

// Mark the diagrams that are shown too small to read, and give them an expand button.
const markExpandable = (pre) => {
  const svg = pre.querySelector(":scope > svg");
  if (!svg) return;
  const natural = naturalWidth(svg);
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

let viewer = null;

function buildViewer() {
  const dialog = document.createElement("dialog");
  dialog.className = "diagram-viewer";
  dialog.setAttribute("aria-label", "Diagram");
  dialog.innerHTML = `
    <div class="diagram-viewer__bar">
      <button type="button" data-zoom="0.8" aria-label="Zoom out">${ICON_MINUS}</button>
      <button type="button" data-zoom="1.25" aria-label="Zoom in">${ICON_PLUS}</button>
      <span class="diagram-viewer__hint">Pinch to zoom, drag to move</span>
      <button type="button" data-close aria-label="Close" autofocus>${ICON_CLOSE}</button>
    </div>
    <div class="diagram-viewer__canvas"></div>`;
  document.body.append(dialog);

  const canvas = dialog.querySelector(".diagram-viewer__canvas");
  const state = { svg: null, natural: 0, zoom: 1, min: 1 };

  // Zoom around a point of the canvas (its center by default), keeping that point still.
  state.setZoom = (zoom, at) => {
    const { svg, natural } = state;
    if (!svg) return;
    zoom = Math.min(MAX_ZOOM, Math.max(state.min, zoom));
    const box = canvas.getBoundingClientRect();
    const x = at ? at.x - box.left : canvas.clientWidth / 2;
    const y = at ? at.y - box.top : canvas.clientHeight / 2;
    const ratio = zoom / state.zoom;
    const left = (canvas.scrollLeft + x) * ratio - x;
    const top = (canvas.scrollTop + y) * ratio - y;
    state.zoom = zoom;
    svg.style.width = `${natural * zoom}px`;
    canvas.scrollLeft = left;
    canvas.scrollTop = top;
  };

  dialog.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.hasAttribute("data-close")) dialog.close();
    else state.setZoom(state.zoom * Number(button.dataset.zoom));
  });
  dialog.addEventListener("close", () => {
    canvas.replaceChildren();
    state.svg = null;
  });

  // Two-finger pinch zooms the diagram, not the page.
  let pinch = null;
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
      state.setZoom((pinch.zoom * distance(event.touches)) / pinch.distance, middle(event.touches));
    },
    { passive: false },
  );
  canvas.addEventListener("touchend", (event) => {
    if (event.touches.length < 2) pinch = null;
  });
  // Safari's own pinch gesture would zoom the whole page.
  dialog.addEventListener("gesturestart", (event) => event.preventDefault());

  return { dialog, canvas, state };
}

function openViewer(pre) {
  const source = pre.querySelector(":scope > svg");
  if (!source) return;
  viewer ??= buildViewer();
  const { dialog, canvas, state } = viewer;

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
  const natural = naturalWidth(source);
  const naturalHeight = source.viewBox?.baseVal?.height || natural;
  const room = Math.min((canvas.clientWidth - 32) / natural, (canvas.clientHeight - 32) / naturalHeight);
  Object.assign(state, { svg, natural, zoom: 1, min: Math.min(1, room) });
  svg.style.width = `${natural}px`;
  canvas.scrollTo(0, 0);
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
addEventListener("resize", () => {
  cancelAnimationFrame(pending);
  pending = requestAnimationFrame(refresh);
});
