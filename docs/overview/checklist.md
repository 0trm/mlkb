# 1.3 ML Project Checklist

This checklist, adapted from Géron's *Hands-On Machine Learning*, can guide you through your ML projects. It has eight steps, and each maps onto one of the three stages:

| Step | Stage |
|---|---|
| i–iii. Frame the problem, get the data, explore it | [Design](../index.md#design) |
| iv. Prepare the data | [Design](../design/data.md) and [Development](../development/modeling-overview.md#iv-feature-engineering) |
| v–vii. Model candidates, fine-tuning, presenting | [Development](../index.md#development) |
| viii. Launch, monitor, and maintain | [Deployment](../index.md#deployment) |

## i. Frame the problem and look at the big picture

  -  Define the objective in business terms
  -  How will your solution be used?
  -  What are the current solutions/workarounds (if any)?
  -  How should you frame this problem (supervised/unsupervised, online/offline, etc.)?
  -  How should performance be measured?
  -  Is the performance measure aligned with the business objective?
  -  What would be the minimum performance needed to reach the business objective?
  -  What are comparable problems? Can you reuse experience or tools?
  -  Is human expertise available?
  -  How would you solve the problem manually?
  -  List the assumptions you (or others) have made so far
  -  Verify assumptions if possible

## ii. Get the data

*Note: automate as much as possible so you can easily get fresh data.*

  -  List the data you need and how much you need
  -  Find and document where you can get that data
  -  Check how much space it will take
  -  Check legal obligations, and get authorization if necessary
  -  Get access authorization
  -  Create a workspace (with enough storage space)
  -  Get the data
  -  Convert the data to a format you can easily manipulate (without changing the data itself)
  -  Ensure sensitive information is deleted or protected (e.g., anonymized)
  -  Check the size and type of data (time series, sample, geographical, etc.)
  -  Sample a test set, put it aside, and never look at it (no data snooping!)

## iii. Explore the data

*Note: try to get insights from a field expert for these steps.*

  -  Create a copy of the data for exploration (sampling it down to a manageable size if necessary)
  -  Create a Jupyter notebook to keep a record of your data exploration
  -  Study each attribute and its characteristics:

      - Name
      - Type
      - % of missing values
      - Noisiness and type of noise (stochastic, outliers, rounding errors, etc.)
      - Usefulness for the task
      - Type of distribution (normal, uniform, logarithmic, etc.)
  -  For supervised learning tasks, identify the target attribute(s)
  -  Visualize the data
  -  Study the correlations between attributes
  -  Study how would you solve the problem manually
  -  Identify the promising transformations you may want to apply
  -  Identify extra data that would be useful (go back to “Get the data”)
  -  Document what you have learned

## iv. Prepare the data

… to better expose the underlying data patterns to machine learning algorithms.

*Notes:*

  - *Work on copies of the data (keep the original dataset intact)*
  - *Write functions for all data transformations you apply, for five reasons:*

      - *So you can easily prepare the data the next time you get a fresh dataset*
      - *So you can apply these transformations in future projects*
      - *To clean and prepare the test set*
      - *To clean and prepare the new instances once your solution is live*
      - *To make it easy to treat your preparation choices as hyperparameters*

| Data preprocessing | Examples |
|---|---|
| Data cleaning | Removing duplicates, handling missing values |
| Data transformation | Scaling, encoding |
| Data integration | Joining, merging |
| Data reduction | Sampling, dimensionality reduction |

*The four kinds of data preprocessing, with examples.*

  -  Clean the data

      - Fix or remove outliers (optional)
      - Fill in missing values (e.g., with zero, mean, median…) or drop their rows (or columns)
  -  Perform feature selection (optional)

      - Drop the features that provide no useful information for the task
  -  Perform feature engineering, where appropriate:

      - Discretize continuous features
      - Decompose features (e.g, categorical, date/time, etc.)
      - Add promising transformations of features (e.g., log(x), sqrt(x), x², etc.)
      - Aggregate features into promising new features
  -  Perform feature scaling

      - Standardize or normalize features

## v. Model candidates

*Notes:*

  - *If the data is huge, you may want to sample smaller training sets so you can train many different models in a reasonable time (be aware that this penalizes complex models such as large neural nets or random forests).*
  - *Try to automate these steps as much as possible.*

  -  Train many quick-and-dirty models from different categories (e.g., linear, tree-based) using standard parameters
  -  Measure and compare their performance

      - For each model, use *N*-fold cross-validation and compute the mean and standard deviation of the performance measure on the *N* folds
  -  Analyze the most significant variables for each algorithm
  -  Analyze the types of errors the models make

      - What data would a human have used to avoid these errors?
  -  Perform a quick round of feature selection and engineering
  -  Shortlist the top three to five most promising models, preferring models that make different types of errors

## vi. Fine-tune models

*Notes:*

  - *You will want to use as much data as possible for this step, especially as you move toward the end of fine-tuning.*
  - *As always, automate when you can.*

  -  Fine-tune the hyperparameters using cross-validation

      - Treat your data transformation choices as hyperparameters, especially when you are not sure about them (e.g., if you’re not sure whether to replace missing values with zeros or with the median value, or to just drop the rows)
      - Unless there are very few hyperparameter values to explore, prefer random search over grid search. If training is very long, you may prefer a Bayesian optimization approach (see [3.2 Validation and Hyperparameter Tuning](../development/validation-and-tuning.md)).
  -  Try ensemble methods. Combining your best models will often produce better performance than running them individually.
  -  Once you are confident about your final model, measure its performance on the test set to estimate the generalization error. Don’t tweak your model after measuring the generalization error; you would just start overfitting the test set.

## vii. Present your solution

  -  Document what you have done
  -  Create a nice presentation

      - Make sure you highlight the big picture first
  -  Explain why your solution achieves the business objective
  -  Don’t forget to present interesting points you noticed along the way

      - Describe what worked and what did not
      - List your assumptions and your system’s limitations
  -  Ensure your key findings are communicated through beautiful visualizations or easy-to-remember statements (e.g.: “The median income is the number-one predictor of housing prices.”)

## viii. Launch, monitor, and maintain

  -  Get your solution ready for production (plug into production data inputs, write unit tests, etc.)
  -  Write monitoring code to check your system’s live performance at regular intervals and trigger alerts when it drops

      - Beware of slow degradation: models tend to “rot” as data evolves
      - Measuring performance may require a human pipeline
      - Also monitor your inputs’ quality – this is particularly important for online learning systems
  -  Retrain your models on a regular basis on fresh data (automate as much as possible)
