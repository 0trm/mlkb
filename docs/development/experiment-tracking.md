# 3.9 Experiment Tracking

Efficient machine learning development requires robust experiment tracking and a focus on high-quality data. These practices ensure systematic improvements and reliable model performance, especially in applications where massive datasets are unavailable.

## i. What to Track

Record the following for each experiment:

1.  **Algorithm and Code Version**: Note the algorithm used and its code version to ensure replicability.
2.  **Dataset**: Document the dataset used, including any preprocessing steps.
3.  **Hyperparameters**: Log all hyperparameter settings.
4.  **Results**: Save high-level metrics (e.g., accuracy, F1 score) and, if possible, a copy of the trained model.
5.  **Execution Scripts and Environment Configuration**: Keep the scripts that ran the experiment and the environment they ran in (dependencies, hardware).

## ii. Tracking Tools

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

## iii. Key Features

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
