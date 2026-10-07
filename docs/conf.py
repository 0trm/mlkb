# Sphinx configuration for the MLKB site.
project = "Machine Learning Knowledge Base"
author = "Tomás Ravalli"
copyright = "2026, Tomás Ravalli"

extensions = ["myst_parser", "sphinxcontrib.mermaid"]
myst_heading_anchors = 4
myst_enable_extensions = ["dollarmath"]
# Plain ```mermaid fences render on GitHub and on the site alike.
myst_fence_as_directive = ["mermaid"]

mermaid_version = "12.1.0"
mermaid_light_theme = "neutral"
mermaid_fullscreen = False
mermaid_height = "auto"

exclude_patterns = ["_build", "requirements.txt"]

html_theme = "sphinx_book_theme"
html_title = "MLKB"
html_show_sphinx = False
html_static_path = ["_static"]
html_css_files = ["custom.css"]
html_js_files = ["mermaid-size.js"]
html_context = {"default_mode": "light"}
html_theme_options = {
    "repository_url": "https://github.com/0trm/mlkb",
    "repository_branch": "main",
    "path_to_docs": "docs",
    "use_repository_button": True,
    "use_download_button": False,
    "use_fullscreen_button": False,
    "navbar_persistent": [],
    "search_bar_text": "Search the notes...",
    "home_page_in_toc": True,
    "show_toc_level": 2,
    "footer_content_items": ["copyright.html", "extra-footer.html"],
    "extra_footer": (
        "<em>Rules of Machine Learning</em> by Martin Zinkevich is paraphrased under "
        '<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.'
    ),
}
