# 3.9 Experiment Tracking

Efficient machine learning development requires robust experiment tracking and a focus on high-quality data. These practices ensure systematic improvements and reliable model performance, especially in applications where massive datasets are unavailable.

## 3.9.1 Running Experiments

An experiment is a testable, reproducible hypothesis. Run them like this *(Managing ML Projects, [Experiments](https://developers.google.com/machine-learning/managing-ml-projects/experiments))*:

1.  **Start from a baseline**: the current non-ML solution if there is one, otherwise a simple model with a few features (see [3.3 Model Baseline](model-baseline.md)).
2.  **Change one small thing at a time**: add feature X, take the log of feature Y, set the learning rate to 0.001. If the change helps, that model becomes the new baseline.
3.  **Record every result, failures included**: experiments that match or trail the baseline show which directions don't work, and because progress is non-linear, they are also how you show the work is moving.
4.  **Run independent experiments in parallel**, since one full training run on real data can take hours or days.

**Noise in results.** A difference between two runs can come from the run rather than the change: the order the data is shuffled in, how the weights are initialized, asynchronous parallel training, or an evaluation set too small to be representative. Rerun an experiment several times before trusting a small gain. *(Managing ML Projects, [Experiments](https://developers.google.com/machine-learning/managing-ml-projects/experiments))*

**Agree on what an experiment is.** Decide as a team which artifacts an experiment produces (usually the logged metadata, such as features and hyperparameters, that lets someone else reproduce it), whether people work in their own environments or in shared libraries, and the standard for reproducibility: the same data pipeline and versioning for everyone, or are plots enough? Also decide where results live: a doc, a spreadsheet, or a tracking system ([3.9.3](#393-tracking-tools)). *(Managing ML Projects, [Experiments](https://developers.google.com/machine-learning/managing-ml-projects/experiments))*

**Build toward the end-to-end system early.** If you have the people, start on parts of the final pipeline, such as data intake and retraining, while experiments run: an early path from data to served predictions lets the team start integrating the model into the product and testing it with users. Plan for wrong predictions too. A mail app that logs which messages users move into or out of the spam folder collects ground-truth labels it can retrain on, while in-app surveys give qualitative feedback that can't go back into the training data. *(Managing ML Projects, [Experiments](https://developers.google.com/machine-learning/managing-ml-projects/experiments))*

## 3.9.2 What to Track

Record the following for each experiment:

1.  **Algorithm and Code Version**: Note the algorithm used and its code version to ensure replicability.
2.  **Dataset**: Document the dataset used, including any preprocessing steps.
3.  **Hyperparameters**: Log all hyperparameter settings.
4.  **Results**: Save high-level metrics (e.g., accuracy, F1 score) and, if possible, a copy of the trained model.
5.  **Execution Scripts and Environment Configuration**: Keep the scripts that ran the experiment and the environment they ran in (dependencies, hardware).

## 3.9.3 Tracking Tools

Choose a tracking method based on your needs and scale:

  - **Text Files**: Suitable for small, individual experiments. Jot down a few lines per experiment to note key details. This approach doesn’t scale well but is simple for initial tests.
  - **Spreadsheets**: Shared spreadsheets (e.g., Google Sheets) support collaboration and scale better, allowing multiple team members to review and update experiment records.
  - **Formal Experiment Tracking Systems**: Tools like Weights & Biases, Comet, MLflow, SageMaker Studio, or LandingAI’s computer vision-focused tool offer advanced features. These systems are evolving rapidly and cater to larger teams or complex projects.

| Tool | Pro | Con |
|---|---|---|
| Spreadsheet | Straightforward, easy to use | Requires a lot of manual work |
| Proprietary platform | Custom solution specific to your process | Requires time and effort to build |
| Experiment tracking tool | Specifically designed for experiments | Requires getting familiar with the tool |

*Pros and cons of three ways to track experiments.*

## 3.9.4 Key Features

When selecting a tracking tool, prioritize:

1.  **Replicability**: Ensure the tool captures enough information to replicate results. Be cautious with algorithms that pull data from the internet, as changing online data can reduce replicability unless carefully managed.
2.  **Result Insights**: Choose tools that provide clear summaries of experimental results, including metrics and, ideally, in-depth analysis.
3.  **Additional Features**: Consider resource monitoring (e.g., CPU/GPU usage), model visualization, or support for detailed error analysis.

The most important takeaway is to use *some* tracking system—whether a text file, spreadsheet, or advanced tool—and include as much relevant information as practical. This ensures you can revisit and build upon past experiments efficiently.

**The Process**

1.  Formulate a hypothesis: "We expect that..."
2.  Gather images and labels
3.  Define experiments, e.g., types of models, hyperparameters, datasets
4.  Set up experiment tracking
5.  Train the machine learning model(s)
6.  Test the models on a hold-out test set
7.  Register the most suitable model
8.  Visualize and report back to team and stakeholders, and determine next steps
