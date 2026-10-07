# 3.4 Error Analysis

Training a machine learning algorithm rarely yields perfect results on the first attempt. Error analysis is central to the development process, helping you identify and address model shortcomings systematically.

To understand errors in a system, such as a speech recognition model, follow this process:

  - **Examine Misclassified Examples**: Select a sample from your development set, such as 100 audio clips the model got wrong. Listen to each clip and annotate relevant characteristics in a spreadsheet (e.g., Google Sheets, Excel, or Numbers). For instance, note if an audio clip contains background car noise.
  - **Purpose**: This process reveals which categories or tags (e.g., car noise) contribute significantly to errors, helping you prioritize areas for improvement.

The process is iterative: examining and tagging examples suggests new tags, and each new tag sends you back to the examples. Tags that work in other applications:

  - **Visual inspection**: specific class labels (scratch, dent), image properties (blurry, dark or light background, reflection), other metadata (phone model, factory).
  - **Product recommendations**: user demographics, product features or category.

Error analysis has traditionally been manual, often performed in tools like Jupyter Notebooks or spreadsheets.

## 3.4.1 Key Metrics for Error Analysis

As you analyze tagged data, track these metrics to guide prioritization:

1.  **Fraction of Errors with a Tag**: For example, if 12 of the 100 misrecognized clips have the "car noise" tag, fixing car noise completely would remove at most 12% of the errors. That ceiling tells you how much the category is worth.
2.  **Misclassification Rate for a Tag**: Calculate the fraction of data with a specific tag that is misclassified. For instance, if 18% of car noise clips are incorrectly transcribed, this indicates the difficulty of that category and its accuracy ceiling.
3.  **Prevalence of a Tag**: Determine what fraction of the entire dataset has a specific tag. This shows the tag’s overall relevance.
4.  **Room for Improvement**: Assess the potential for improvement by comparing your model’s performance to human-level performance (HLP) for a given tag. This helps estimate the achievable gains.

## 3.4.2 Turn Error Patterns into Features

Errors the model *knows* it got wrong (a false positive, or a positive ranked below a negative) are the ones it will fix if given a feature that helps. Features built around cases the model doesn't count as mistakes get ignored: if the objective is installs and users do install a gag app after searching "free games", a "gag app" feature won't demote it. Look for trends in the errors that fall outside the current feature set (e.g., the model demotes long posts), then add a family of related features (a dozen post-length buckets) and let the model sort out which ones matter. *(Rules of ML #26)*

## 3.4.3 Quantify Undesirable Behavior

When team members dislike behavior that the loss function doesn't capture, turn the complaint into a number: for example, have human raters label gag apps in top search results. Once measured, the issue can become a feature, an objective, or a metric. "Measure first, optimize second." *(Rules of ML #27)*
