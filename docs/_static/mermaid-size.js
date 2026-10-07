// Show each diagram at its natural size, shrinking it only when the column is narrower.
// Without this, sphinxcontrib-mermaid stretches every diagram to the full column width.
const fitDiagram = (svg) => {
  const natural = parseFloat(svg.style.maxWidth);
  if (natural) svg.style.setProperty("max-width", `min(100%, ${natural}px)`, "important");
};
new MutationObserver(() => document.querySelectorAll("pre.mermaid > svg").forEach(fitDiagram))
  .observe(document.documentElement, { childList: true, subtree: true });
