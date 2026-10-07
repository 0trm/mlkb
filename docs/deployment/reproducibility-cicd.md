# 4.4 Reproducibility and CI/CD

A model that works in a notebook still has to be rebuilt, validated, and shipped the same way every time. This section covers what makes that possible: tracking where a model came from, validating its data, versioning everything, and automating the build.

## i. Transparency and Reproducibility

A model handed over for deployment raises questions the person who trained it may not have answered: will it run on the production infrastructure, can anyone see how it was built, can it be reproduced, are its inputs validated, and how will it be monitored and debugged? Answering these early is cheaper than answering them at deployment time.

![](../images/image65.png)

Each model should carry a record of where it came from: the code version, the data version, and the parameters used to train it. That record makes the model auditable and lets you reproduce a result or trace a problem back to its cause.

![](../images/image41.png)

Logging experiments in a metadata store (see [3.9 Experiment Tracking](../development/experiment-tracking.md)) gives you that record as a side effect.

![](../images/image116.png)

Common concerns when putting a model in production:

  - Input data validation - data profiles (aka data expectations)

![](../images/image101.png)

  - Performance deterioration

![](../images/image113.png)

  - Debugging

![](../images/image50.png)

  - Testing

![](../images/image19.png)

## ii. Profiling, Versioning, and Feature Stores

### Data Profiling

Automated data analysis and creation of high-level summaries (a.k.a. data profiles, expectations), used for validating and monitoring data in production.

![](../images/image126.png)

Risks of **not** using data profiles:

  - Clients complaining, although they submitted erroneous inputs to the model
  - No way to identify that data has drifted and our model is no longer valid

A training pipeline reads raw data from a **data store** and the model definition from a **code repository**, trains the model, and stores it in a **model registry**. It should also write to a **metadata store**: the dataset version, the train/test split, and a fingerprint of the data, so the exact build can be recreated.

![](../images/image119.png)

A popular tool for data profiling is Great Expectations.

### Versioning

Versioning in machine learning engineering is the practice of systematically tracking and managing changes to all components of an ML project, including code, data, models, and hyperparameters, over time. Unlike traditional software development where Git excels at versioning code, ML projects involve large datasets and model artifacts that Git cannot efficiently handle.

![](../images/image75.png)

Tools like DVC (Data Version Control) extend Git's capabilities by providing a lightweight mechanism to version large files and directories by storing their metadata (like checksums) in Git, while the actual data resides in external storage (e.g., cloud storage, local drives). This allows teams to precisely reproduce past experiments, revert to previous states, track data lineage, and ensure that a specific model was trained with an exact version of data and code, which is crucial for collaboration, debugging, and maintaining reliable production systems.

### Feature Stores

A feature store in machine learning engineering is a centralized repository that standardizes the management, storage, and serving of features for both model training and real-time inference. It acts as a bridge between data engineering and data science, allowing for the consistent definition, computation, and reuse of features across different models and teams, thereby preventing training-serving skew (where features used for training differ from those used in production; see [4.5 viii](monitoring.md#viii-training-serving-skew)). Typically, a feature store includes an offline store for historical, large-volume data used in training and an online store optimized for low-latency, single-record retrieval during live predictions, significantly streamlining the MLOps lifecycle by improving efficiency, reproducibility, and model reliability.

![](../images/image135.png)

Training and serving read data in different ways. Training scans large volumes in batch, so it needs storage optimized for throughput (the **offline store**). Serving fetches the features of one record at a time with low latency (the **online store**). A feature store provides both, computed from the same definitions.

![](../images/image115.png)

Its main benefits are reusability (features are built once and shared across models) and consistency (training and serving use the same feature values).

![](../images/image59.png)

## iii. CI/CD

![](../images/image23.png)

### Model Build Pipeline

Two pipelines are worth keeping apart: the **model pipeline** defines what the model does with an input, and the **model build pipeline** defines how the model is created and saved. The build pipeline is the one that runs in CI/CD.

![](../images/image100.png)

The build pipeline loads the model definition from version-controlled code and the training data from a versioned data store, checked against data profiles. Its output is a **model package**: the trained model plus the metadata needed for deployment, reproducibility, and monitoring.

![](../images/image28.png)

At its simplest, the build pipeline loads the model definition, loads the training data, trains the model, and saves it. Running it inside CI/CD is what makes deployment automatic and results reproducible.

![](../images/image21.png)

Its inputs are code from the repository, raw data from data stores, and engineered features from the feature store. Its outputs are the trained model, registered in a model registry, and the build metadata, stored in a metadata store.

![](../images/image35.png)

### Testing and Pre-export Checks

Keep the learning part of the system encapsulated so everything around it can be tested on its own *(Rules of ML #5)*:

  - **Data into the algorithm**: Check that feature columns that should be populated are populated. Where privacy allows, inspect the training input by hand, and compare pipeline statistics against the same data processed elsewhere.
  - **Models out of the algorithm**: The model must give the same score in the training environment and in the serving environment.
  - **Code paths**: Test the code that creates examples in both training and serving, and make sure serving can load and use a fixed model.

Run sanity checks right before exporting a model, since a bad exported model is a user-facing problem. Check performance on held-out data (many continuously deploying teams gate on AUC), and don't export if you still have doubts about the data. A problem caught before export costs an email alert; a problem in a live model may cost a page. *(Rules of ML #9)*
