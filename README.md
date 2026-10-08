# Machine Learning Knowledge Base

Study notes on designing, developing, and deploying ML systems, compiled from the courses, books, and essays listed under [Sources](docs/sources.md). Examples and case studies come from those sources; they are not my own projects.

**Read them as a site: <https://0trm.dev/mlkb/>**

The process is split into three stages: **Design**, **Development**, and **Deployment**. The overview walks the whole lifecycle once; each stage then has its own pages.

*Scope: classic (predictive) ML systems. LLMs and foundation models are not covered.*

## Contents

### 1 · Overview

- [1.1 Introduction](docs/overview/introduction.md)
- [1.2 ML Project Lifecycle](docs/overview/lifecycle.md)
- [1.3 ML Project Checklist](docs/overview/checklist.md)
- [1.4 MLOps](docs/overview/mlops.md)
- [1.5 Case Study: Speech Recognition System](docs/overview/case-study-speech-recognition.md)

### 2 · Design

- [2.1 Scoping](docs/design/scoping.md)
- [2.2 Data](docs/design/data.md)

### 3 · Development

- [3.1 Modeling Overview](docs/development/modeling-overview.md)
- [3.2 Validation and Hyperparameter Tuning](docs/development/validation-and-tuning.md)
- [3.3 Model Baseline](docs/development/model-baseline.md)
- [3.4 Error Analysis](docs/development/error-analysis.md)
- [3.5 Prioritizing Improvements](docs/development/prioritizing-improvements.md)
- [3.6 Skewed Datasets](docs/development/skewed-datasets.md)
- [3.7 Performance Auditing](docs/development/performance-auditing.md)
- [3.8 Data-centric AI Development](docs/development/data-centric-development.md)
- [3.9 Experiment Tracking](docs/development/experiment-tracking.md)

### 4 · Deployment

- [4.1 Key Challenges in Deployment](docs/deployment/key-challenges.md)
- [4.2 Deployment Architecture](docs/deployment/architecture.md)
- [4.3 Common Deployment Patterns](docs/deployment/deployment-patterns.md)
- [4.4 Reproducibility and CI/CD](docs/deployment/reproducibility-cicd.md)
- [4.5 Monitoring](docs/deployment/monitoring.md)
- [4.6 Case Study: Defect Inspection in Manufacturing](docs/deployment/case-study-defect-inspection.md)

### Appendix

- [Templates](docs/templates.md)
- [Sources](docs/sources.md)

## Building the site locally

```bash
pip install -r docs/requirements.txt
sphinx-build -b html docs docs/_build/html
```

Pushes to `main` rebuild and deploy the site through `.github/workflows/pages.yml`.

The favicon is the card file box emoji from [Noto Emoji](https://github.com/googlefonts/noto-emoji) (Apache 2.0).
