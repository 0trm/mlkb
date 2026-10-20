# 1.2 ML Project Lifecycle

When building a machine learning (ML) system, planning the project lifecycle helps outline all necessary steps effectively. As you work on an ML system, this framework will help you identify critical tasks, ensure the system functions properly, and minimize unexpected challenges.

The ML project lifecycle consists of iterative stages that guide the development and deployment of an ML system.

```mermaid
flowchart LR
  subgraph design[Design]
    direction TB
    A[Define project] --> B[Define data and<br>establish baseline] --> C[Label and<br>organize data]
  end
  subgraph development[Development]
    direction TB
    D[Select and<br>train model] --> E[Perform<br>error analysis]
  end
  subgraph deployment[Deployment]
    direction TB
    F[Deploy in<br>production] --> G[Monitor and<br>maintain system]
  end
  design --> development --> deployment
```

*The ML project lifecycle. Each stage also loops back: error analysis can send you back to collect more data, and monitoring triggers retraining. Adapted from DeepLearning.AI, MLOps Specialization.*

The iterative nature of this lifecycle means feedback from later stages often informs adjustments to earlier ones. ML projects are often highly iterative. During error analysis, you may need to refine the model or revisit earlier steps to collect additional data. Before deployment, you typically perform a final check or audit to verify that the system’s performance is adequate and reliable for its intended application. Deploying a system for the first time means you’re only about halfway to completion. Live traffic often reveals critical insights needed to optimize performance.

## 1.2.1 Design

**Scoping**

Begin by defining the project and deciding what to focus on. Specify the ML application, including what X (input) and Y (output) represent.

  - Define project objectives, specifying inputs (X) and outputs (Y).
  - Establish performance metrics (e.g., accuracy, latency, throughput).
  - Estimate required resources (e.g., time, compute, budget).

**Data**

After selecting the project, gather the required data for your algorithm. This involves defining the data, establishing a baseline, labeling, and organizing it.

  - Collect, label, and organize data, ensuring quality and consistency.
  - Address issues such as inconsistent labeling or missing values.
  - Establish a performance baseline (covered in [3.3 Model Baseline](../development/model-baseline.md)).

Covered in depth in [2 · Design](../index.md#2--design), starting with [2.1 Scoping](../design/scoping.md).

## 1.2.2 Development

With data in hand, proceed to train the model. This phase includes selecting and training the model and conducting error analysis.

  - Select and train a model using the prepared dataset.
  - Conduct error analysis to identify improvement areas.
  - Iterate on model architecture, hyperparameters, or data as needed.

Covered in depth in [3 · Development](../index.md#3--development), starting with [3.1 Modeling Overview](../development/modeling-overview.md).

## 1.2.3 Deployment

To deploy the system, integrate it into production, develop the necessary software, and monitor the system. Continuously track incoming data and maintain the system’s performance. For instance, if the data distribution shifts, you may need to update the model.

  - Integrate the model into a production environment (e.g., via APIs).
  - Ensure compliance with performance requirements (e.g., latency, throughput).
  - Address operational constraints (e.g., resource availability, security).

**Maintenance**

Post-deployment maintenance often involves further error analysis, retraining the model, or incorporating new data. As the system runs on live data, its output can be fed back into the dataset to update the data, retrain the model, and deploy an improved version.

  - Monitor system performance for issues like concept or data drift.
  - Update the model with new data or retraining as required.
  - Refine the system based on real-world feedback.

Covered in depth in [4 · Deployment](../index.md#4--deployment), starting with [4.1 Key Challenges](../deployment/key-challenges.md).

## 1.2.4 Roles

An ML project needs both business and technical people. Business roles define the problem and judge whether the result is useful; technical roles build the data pipelines, the model, and the system around it.

  - Business roles

      - Business stakeholder
      - Subject matter expert
  - Technical roles

      - Data Engineer
      - Data Scientist
      - Machine Learning Engineer

### End-to-End Ownership

Splitting one project across many specialists has costs. Yan argues that a data scientist is more effective when they own the problem from framing to the deployed model and its measured outcome *(Yan, [Data Scientists Should Be More End-to-End](https://eugeneyan.com/writing/end-to-end-data-science/))*:

  - **Context to find the root cause**: when conversion drops and the request is "improve the search algorithm", the cause may lie elsewhere: low-quality products eroding customer trust, delayed or broken data pipelines, or a model that no longer refreshes. Someone who sees the whole chain is more likely to find it, and to know which engineering and product constraints rule a solution out.
  - **Lower coordination cost**: a team of N people has N(N-1)/2 relationships to maintain, so 7 people have 21 and 21 people have 210. With a data engineer, a data scientist, and an ML engineer working in sequence, each new dataset or model waits for the next person; the work itself may take days while the handoffs take weeks.
  - **Ownership**: when features, model code, and production code are thrown over the wall from one role to the next, no one is clearly responsible when results go wrong. At Lazada, a ranking model Yan built won its A/B test, yet business stakeholders didn't trust it and kept picking top products by hand, which pulled the online metrics down; visits to the regional markets to explain the model and hear their concerns reduced the overrides.

Specialists are still needed: some people want to go deep, research pushes the field forward, and in systems such as algorithmic trading or advertising a 0.01% gain is worth hyper-specialization. End-to-end work also depends on a solid platform: Stitch Fix's generalists rely on one that hides infrastructure setup, distributed processing, and monitoring, and at Netflix central teams built shared tooling for build and deploy pipelines, monitoring, and managed rollbacks. Yan later clarified that the point is end-to-end visibility and ownership, not full-stack skills: you need to use the tools well, not be able to build them from scratch. *(Yan, [Data Scientists Should Be More End-to-End](https://eugeneyan.com/writing/end-to-end-data-science/))*
