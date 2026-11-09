// One navigator on phones and tablets: below 1200px the right-hand Contents panel
// is gone, so the current page's sections are listed under it in the left menu.
document.addEventListener("DOMContentLoaded", () => {
  const current = document.querySelector(".bd-docs-nav li.toctree-l1.current");
  const sections = document.querySelectorAll("#pst-page-toc-nav > ul > li > a[href^='#']");
  if (!current || !sections.length) return;

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
    if (!event.target.closest("a")) return;
    const menu = document.getElementById("pst-primary-sidebar-modal");
    if (menu?.open) menu.close();
  });

  // Mark the section being read.
  const links = [...list.querySelectorAll("a")];
  const targets = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))));
  const markReading = () => {
    const line = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 64;
    let reading = null;
    targets.forEach((target, i) => {
      if (target && target.getBoundingClientRect().top <= line + 8) reading = links[i];
    });
    links.forEach((link) => link.classList.toggle("is-reading", link === reading));
  };
  let pending = 0;
  addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(markReading);
    },
    { passive: true },
  );
  markReading();
});
