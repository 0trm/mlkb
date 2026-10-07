# 1.4 MLOps

MLOps (Machine Learning Operations) is a set of practices that integrates Machine Learning, DevOps, and Data Engineering to streamline and automate the entire lifecycle of machine learning models, from development and experimentation to reliable deployment, monitoring, and continuous improvement in production environments.

```mermaid
flowchart LR
  subgraph ml[ML: non-linear, exploratory]
    direction TB
    explore[Explore] --> develop[Develop] --> train[Train]
  end
  subgraph ops[Ops: streamlined, structured]
    direction TB
    deploy[Deploy] --> serve[Serve] --> monitor[Monitor]
  end
  ml --> ops
```

*MLOps joins an exploratory ML loop to a structured operations loop; monitoring feeds back into exploration.*

It focuses on ensuring reproducibility, scalability, version control, and efficient collaboration among data scientists, ML engineers, and operations teams to deliver and maintain high-performing ML solutions.

```mermaid
flowchart TB
  subgraph mlops[MLOps]
    Code([Code]) --> BA
    subgraph devops[DevOps]
      BA[Build app] --> App([App]) --> DA[Deploy app] --> MA[Monitor app]
    end
    Code --> BM[Build model]
    Data([Data]) --> BM
    BM --> Model([Model]) --> DM[Deploy model] --> MM[Monitor model]
    Data --> MD[Monitor data]
  end
```

*DevOps builds, deploys and monitors an app from code. MLOps adds data as a second input to build a model, and monitors the data as well as the model.*

## 1.4.1 Maturity Levels

A usual starting point is:

  - Manual ML workflows
  - Manual deployment
  - Ad hoc monitoring

This leads to an accumulation of technical debt.

As companies progress through the maturity levels, the level of automation, collaboration, and monitoring rises. A higher level is not necessarily better for every team, and most of the progress happens in the development and deployment stages.

| | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| **Automation** | Manual processes | Automated development (CI) | Full automation |
| **Collaboration** | Distinction between machine learning and operations | Collaboration during handover from development | Close collaboration |
| **Monitoring** | No monitoring | Development tracking (experiments, feature store) | Full monitoring |

*Automation, collaboration and monitoring at each MLOps maturity level.*

**ML Workflows**

  - Data collection and preparation
  - Data-labeling
  - Model selection
  - Model training
  - Model packaging
  - Model deployment
  - Model monitoring and maintenance

The more of this workflow is automated, the higher the MLOps maturity.

### Level 1: Manual Processes

  - Manual process for development
  - Manual process for deployment
  - No collaboration between ML and operations
  - Teams work in isolation
  - No tracking of development
  - No monitoring after deployment

### Level 2: Automated Development

  - Automated development pipeline (Continuous integration)
  - Manual process for deployment
  - After development teams will collaborate to deploy model
  - Tracking of ML experiments and features
  - Little monitoring after deployment

### Level 3: Automated Development and Deployment

  - Automated development pipeline (CI)
  - Automated deployment pipeline (CD)
  - Close collaboration between teams
  - Monitoring of development and deployment
  - Potentially automatically triggering retraining

## 1.4.2 Automation by Stage

Which parts of each stage can be automated, and what that buys:

**Design**

  - Project design remains a manual process; templates help it scale (see [Templates](../templates.md)).
  - Data acquisition can be automated, which helps keep data quality high.

      - For example, an ETL pipeline extracts order data and weather data, combines them, and loads the result into a database, followed by automated data quality checks.

**Development**

  - A feature store saves time rebuilding the same features and helps scale across projects.
  - Automated experiment tracking ensures reproducibility.

      - It records the machine learning models, versions of data, environment configurations, model hyperparameters, and execution scripts.

```mermaid
flowchart TB
  Stream([Stream data]) --> FS
  Batch([Batch data]) --> FS
  subgraph FS[Feature store]
    direction LR
    Monitor[Monitor] ~~~ Register[Register]
    Transform[Transform] ~~~ Store[Store] ~~~ Serve[Serve]
  end
  FS -- feature vectors --> Model([ML model])
  DS[Data scientist] -- explore and<br>define features --> FS
  FS -- get training data --> DS
```

*A feature store ingests stream and batch data, serves feature vectors to models, and gives data scientists one place to define features and pull training data.*

**Deployment**

  - Containerization makes it easy to start up copies of the same application, which improves scalability.
  - A CI/CD pipeline automates development and deployment and speeds up both.

      - Continuous integration (CI) covers plan, code, build, and test; continuous deployment (CD) starts at test and continues with release, deploy, and operate.
  - A microservices architecture improves scalability and lets services be developed and deployed independently.

```mermaid
flowchart LR
  subgraph micro[Microservices architecture]
    UI2[UI] --> P2[Payment]
    UI2 --> C2[Shopping cart]
    UI2 --> I2[Inventory]
    P2 --> S2[Instance]
    C2 --> S3[Instance]
    I2 --> S4[Instance]
  end
  subgraph mono[Monolithic architecture]
    UI1[UI] --> app
    subgraph app[" "]
      direction TB
      P1[Payment]
      C1[Shopping cart]
      I1[Inventory]
    end
    app --> S1[Single instance]
  end
```

*In a monolith, payment, shopping cart and inventory ship together as a single instance; with microservices, each service runs as its own instance.*
