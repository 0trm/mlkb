# Machine Learning Knowledge Base

These are study notes on building machine learning systems end to end. They compress the process into three stages, **design**, **development**, and **deployment**, and follow one idea through all of them: most of the work in production ML is engineering and data, not algorithms.

*Scope: classic (predictive) ML systems. LLMs and foundation models are not covered.*

```mermaid
flowchart LR
  subgraph design[" "]
    direction TB
    T1["<b>Design</b><br>Problem → plan"] ~~~ A[Scope the<br>project] --> B[Define data and<br>a baseline] --> C[Label and<br>organize data] --> O1([Reviewed<br>design doc])
  end
  subgraph development[" "]
    direction TB
    T2["<b>Development</b><br>Data → model"] ~~~ D[Train a<br>model] --> E[Analyze<br>errors] --> F[Audit before<br>launch] --> O2([Production-<br>ready model])
  end
  subgraph deployment[" "]
    direction TB
    T3["<b>Deployment</b><br>Model#nbsp;→#nbsp;live#nbsp;system"] ~~~ G[Build<br>pipelines] --> H[Deploy in<br>production] --> I[Monitor and<br>maintain] --> O3([Pipelines running<br>in production])
  end
  design --> development --> deployment
  design <-.->|more data,<br>new framing| development
  development <-.->|retrain,<br>fix the model| deployment
  class T1,T2,T3 stagehead
  class O1,O2,O3 outcome
```

*From a business problem to a model serving users. Each stage turns one thing into the next and ends with an outcome you can check (see [1.2.4](overview/lifecycle.md#124-goals-and-exit-outcomes)). Work moves back and forth between stages: error analysis can call for more data or a new framing, and live data can call for retraining or a fix to the model. Adapted from DeepLearning.AI, MLOps Specialization, and Google for Developers, Managing ML Projects.*

## 1 · Overview

New here? Start with the [lifecycle](overview/lifecycle.md), which walks all three stages once, then use the [project checklist](overview/checklist.md) as a step-by-step guide. The [speech recognition case study](overview/case-study-speech-recognition.md) shows the stages applied to one system.

- [1.1 Introduction](overview/introduction.md): why ML, types of ML systems, and the main challenges
- [1.4 MLOps](overview/mlops.md): maturity levels and what to automate at each stage

## 2 · Design

Design decides what to build before anything is trained: which business problem is worth solving, whether ML is the right tool, which single objective the model should optimize, and what data it needs, defined consistently enough that a model can learn from it. It ends with a design doc reviewed with stakeholders.

- [2.1 Scoping](design/scoping.md)
- [2.2 Data](design/data.md)

## 3 · Development

Development turns scoped data into a working model: set up validation, get a baseline fast, then iterate with error analysis, more often by improving the data than the model. It ends with a model good enough for production, audited before anything reaches users.

- [3.1 Modeling Overview](development/modeling-overview.md)
- [3.2 Validation and Hyperparameter Tuning](development/validation-and-tuning.md)
- [3.3 Model Baseline](development/model-baseline.md)
- [3.4 Error Analysis](development/error-analysis.md)
- [3.5 Prioritizing Improvements](development/prioritizing-improvements.md)
- [3.6 Skewed Datasets](development/skewed-datasets.md)
- [3.7 Performance Auditing](development/performance-auditing.md)
- [3.8 Data-centric AI Development](development/data-centric-development.md)
- [3.9 Experiment Tracking](development/experiment-tracking.md)

## 4 · Deployment

Deployment puts the model in front of real data: building the pipelines that keep it fresh, choosing an architecture, rolling out gradually with a way back, making builds reproducible, and monitoring the system once it is live. It ends with validated pipelines running in production, yet a first deployment is only about halfway through the project, since live traffic reveals what development could not.

- [4.1 Key Challenges in Deployment](deployment/key-challenges.md)
- [4.2 Deployment Architecture](deployment/architecture.md)
- [4.3 Common Deployment Patterns](deployment/deployment-patterns.md)
- [4.4 Reproducibility and CI/CD](deployment/reproducibility-cicd.md)
- [4.5 Monitoring](deployment/monitoring.md)
- [4.6 Case Study: Defect Inspection in Manufacturing](deployment/case-study-defect-inspection.md)

## Appendix

- [Templates](templates.md): the documents worth writing along the way: one-pagers, design docs, process and handover docs, and after-action reviews
- [Sources](sources.md): the courses, books, and articles these notes draw on

```{toctree}
:hidden:
:caption: 1 · Overview

overview/introduction
overview/lifecycle
overview/checklist
overview/mlops
overview/case-study-speech-recognition
```

```{toctree}
:hidden:
:caption: 2 · Design

design/scoping
design/data
```

```{toctree}
:hidden:
:caption: 3 · Development

development/modeling-overview
development/validation-and-tuning
development/model-baseline
development/error-analysis
development/prioritizing-improvements
development/skewed-datasets
development/performance-auditing
development/data-centric-development
development/experiment-tracking
```

```{toctree}
:hidden:
:caption: 4 · Deployment

deployment/key-challenges
deployment/architecture
deployment/deployment-patterns
deployment/reproducibility-cicd
deployment/monitoring
deployment/case-study-defect-inspection
```

```{toctree}
:hidden:
:caption: Appendix

templates
sources
```
