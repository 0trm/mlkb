# Sphinx configuration for the MLLC site.
project = "Machine Learning Life Cycle"
author = "Tomás Ravalli"
copyright = "2026, Tomás Ravalli"

extensions = ["myst_parser", "sphinxcontrib.mermaid"]
myst_heading_anchors = 4
myst_enable_extensions = ["dollarmath"]
# External links open in a new tab with rel="noopener".
myst_links_external_new_tab = True
# Plain ```mermaid fences render on GitHub and on the site alike.
myst_fence_as_directive = ["mermaid"]

mermaid_version = "12.1.0"
# Soft tint style: borderless tinted boxes, dashed groups, blue stage headers. Colors live in
# custom.css so they follow light and dark mode; the font is the site's, so labels are measured
# in the font they're drawn in.
DIAGRAM_FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
mermaid_light_theme = "base"
mermaid_dark_theme = "base"
mermaid_init_config = {
    "startOnLoad": False,
    "look": "classic",
    "fontFamily": DIAGRAM_FONT,
    "flowchart": {"nodeSpacing": 44, "rankSpacing": 52, "padding": 16},
    "themeVariables": {"fontSize": "14px", "fontFamily": DIAGRAM_FONT},
}
mermaid_fullscreen = False
mermaid_height = "auto"

exclude_patterns = ["_build", "requirements.txt"]

html_theme = "sphinx_book_theme"
html_title = "MLLC"
html_show_sphinx = False
html_static_path = ["_static"]
# The 🗃️ from the repo description, from Noto Emoji (Apache 2.0).
html_favicon = "_static/favicon.ico"
html_css_files = ["custom.css"]
html_js_files = [("diagrams.js", {"defer": "defer"}), ("mobile.js", {"defer": "defer"})]
html_context = {"default_mode": "light"}
html_theme_options = {
    "repository_url": "https://github.com/0trm/mllc",
    "repository_branch": "main",
    "path_to_docs": "docs",
    "use_repository_button": True,
    "use_download_button": False,
    "use_fullscreen_button": False,
    "navbar_persistent": [],
    "search_bar_text": "Search the notes...",
    "home_page_in_toc": False,
    "show_toc_level": 2,
    "footer_content_items": ["copyright.html", "extra-footer.html"],
    "extra_footer": (
        "<em>Rules of Machine Learning</em> by Martin Zinkevich and <em>Managing ML Projects</em> "
        "by Google for Developers are paraphrased under "
        '<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>.'
    ),
}
