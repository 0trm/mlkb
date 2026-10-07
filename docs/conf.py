# Sphinx configuration for the MLKB site.
project = "Machine Learning Knowledge Base"
author = "Tomás Ravalli"
copyright = "2026, Tomás Ravalli"

extensions = ["myst_parser"]
myst_heading_anchors = 4

exclude_patterns = ["_build", "requirements.txt"]

html_theme = "sphinx_book_theme"
html_title = "ML Knowledge Base"
html_show_sphinx = False
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
    "extra_footer": (
        "Study notes; examples come from the listed sources. "
        "<em>Rules of Machine Learning</em> by Martin Zinkevich is paraphrased under "
        '<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.'
    ),
}
