// Phones and tablets (below 992px, where the left menu is a drawer): one menu with the
// page's sections, a header that gets out of the way while reading, and tables that fit.
// Runs as a deferred script, before the theme's own script, so the theme hooks up the
// light/dark buttons added to the menu here.

{
const DRAWER = matchMedia("(max-width: 991.98px)");
const PHONE = matchMedia("(max-width: 767.98px)");
const menu = document.getElementById("pst-primary-sidebar-modal");
const sidebar = document.getElementById("pst-primary-sidebar");
const header = document.querySelector(".bd-header-article");

// ---- Menu: the page's sections under the current page ------------------------------
// Below 1200px the right-hand Contents panel is gone, so its sections move here.
{
  const current = document.querySelector(".bd-docs-nav li.toctree-l1.current");
  const sections = document.querySelectorAll("#pst-page-toc-nav > ul > li > a[href^='#']");
  if (current && sections.length) {
    const list = document.createElement("ul");
    list.className = "page-sections";
    for (const section of sections) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = section.getAttribute("href");
      link.textContent = section.textContent;
      item.append(link);
      list.append(item);
    }
    current.append(list);

    // Tapping a section closes the menu and goes there.
    list.addEventListener("click", (event) => {
      if (event.target.closest("a") && menu?.open) menu.close();
    });

    // Mark the section being read.
    const links = [...list.querySelectorAll("a")];
    const targets = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))));
    const markReading = () => {
      let reading = null;
      targets.forEach((target, i) => {
        if (target && target.getBoundingClientRect().top <= 96) reading = links[i];
      });
      links.forEach((link) => link.classList.toggle("is-reading", link === reading));
    };
    let pending = 0;
    addEventListener("scroll", () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(markReading);
    }, { passive: true });
    markReading();
  }
}

// ---- Menu: close button, light/dark and GitHub at the bottom -----------------------
if (sidebar && menu) {
  const close = document.createElement("button");
  close.type = "button";
  close.className = "menu-close";
  close.setAttribute("aria-label", "Close menu");
  close.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" /></svg>';
  close.addEventListener("click", () => menu.close());
  sidebar.prepend(close);

  // The theme gives every .theme-change-button its click handler and active state.
  const repo = document.querySelector(".btn-source-repository-button")?.getAttribute("href");
  const footer = document.createElement("div");
  footer.className = "menu-footer";
  footer.innerHTML = `
    <div class="menu-modes" role="group" aria-label="Color mode">
      <button type="button" class="theme-change-button" data-mode="light">Light</button>
      <button type="button" class="theme-change-button" data-mode="dark">Dark</button>
      <button type="button" class="theme-change-button" data-mode="auto">Auto</button>
    </div>
    ${repo ? `<a class="menu-repo" href="${repo}" target="_blank" rel="noopener">Source on GitHub</a>` : ""}`;
  sidebar.append(footer);

  // Search from the menu: close the menu first, so the search box isn't stacked on it.
  sidebar.querySelector(".search-button-field")?.addEventListener(
    "click",
    () => menu.open && menu.close(),
    { capture: true },
  );

  // Open the menu scrolled to the current page.
  document.querySelector(".primary-toggle")?.addEventListener("click", () =>
    requestAnimationFrame(() => {
      const here = menu.querySelector("li.toctree-l1.current");
      if (!menu.open || !here) return;
      const offset = here.getBoundingClientRect().top - menu.getBoundingClientRect().top;
      menu.scrollTop += offset - menu.clientHeight / 4;
    }),
  );
}

// ---- Header: page title, and out of the way while scrolling down --------------------
if (header) {
  const title = document.querySelector(".bd-article h1");
  if (title) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "header-title";
    button.textContent = title.textContent.replace(/[#¶]\s*$/, "").trim();
    button.setAttribute("aria-label", "Back to the top of the page");
    button.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
    header.querySelector(".header-article-items__start")?.append(button);
    // The title shows in the header once the page's own title has scrolled away.
    new IntersectionObserver(([entry]) => header.classList.toggle("show-title", !entry.isIntersecting), {
      rootMargin: "-56px 0px 0px 0px",
    }).observe(title);
  }

  let lastY = scrollY;
  let pending = 0;
  const update = () => {
    const y = scrollY;
    const bottom = document.documentElement.scrollHeight - innerHeight;
    // Ignore Safari's bounce past either end, and small movements.
    if (y < 0 || y > bottom || Math.abs(y - lastY) < 8) return;
    const hide = DRAWER.matches && y > lastY && y > header.offsetHeight && !menu?.open;
    header.classList.toggle("is-hidden", hide);
    lastY = y;
  };
  addEventListener("scroll", () => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(update);
  }, { passive: true });
  // Jumping to a section from a link leaves the header hidden; any focus inside it shows it.
  header.addEventListener("focusin", () => header.classList.remove("is-hidden"));
}

// ---- Tables ---------------------------------------------------------------------------
// On phones, tables of sentences become one card per row with labelled fields; tables of
// short values stay a grid that scrolls sideways with the first column pinned.
for (const table of document.querySelectorAll(".bd-article table")) {
  const heads = [...table.querySelectorAll("thead th")].map((th) => th.textContent.trim());
  const rows = [...table.querySelectorAll("tbody tr")];
  if (!heads.length || !rows.length) continue;
  const cells = rows.flatMap((row) => [...row.children]);
  const average = cells.reduce((sum, cell) => sum + cell.textContent.trim().length, 0) / cells.length;
  const cards = average >= (heads.length >= 3 ? 20 : 40);
  table.classList.add(cards ? "table-cards" : "table-grid");
  if (cards) rows.forEach((row) => [...row.children].forEach((cell, i) => (cell.dataset.label = heads[i] || "")));
}

// A fade on the right edge says a grid scrolls sideways; it goes once scrolled to the end.
const markScroll = (box) => {
  const more = box.scrollWidth - box.clientWidth - box.scrollLeft > 4;
  box.classList.toggle("has-more", more);
};
for (const box of document.querySelectorAll(".bd-article .pst-scrollable-table-container")) {
  box.addEventListener("scroll", () => markScroll(box), { passive: true });
  markScroll(box);
}
addEventListener("resize", () =>
  document.querySelectorAll(".bd-article .pst-scrollable-table-container").forEach(markScroll),
);
PHONE.addEventListener("change", () =>
  document.querySelectorAll(".bd-article .pst-scrollable-table-container").forEach(markScroll),
);
}
