# 4.1 Key Challenges in Deployment

Development environment is different from Production environment, and this poses a few challenges.

```mermaid
flowchart LR
  subgraph dev[Development environment]
    direction TB
    A[Data scientist] --> M([Developed<br>ML model])
    T([Training data]) --> M
  end
  subgraph prod[Production environment]
    direction TB
    R([Real data]) --> P([ML model<br>in production]) --> O([98% probability<br>that customer X<br>churns])
  end
  dev --> prod
```

*A data scientist builds the model from training data; in production the same model runs on real data and returns predictions.*

The trained model plus everything it needs to run (code, dependencies, configuration) makes up the **deployment package**; putting that package to use is **deployment**.

Deployment involves two primary challenge categories:

## 4.1.1 Machine Learning Challenges

In this scenario, a machine learning model is trained to detect defects in smartphone images. The training data includes:

  - Images of defect-free phones.
  - Images of phones with defects, such as a big scratch across the middle, with bounding boxes drawn around the defects.

The model is designed to classify images like the defect-free phone as "okay" while identifying and localizing defects in images with scratches or other imperfections. However, when deployed in a factory setting, the model encounters images that are significantly darker due to changes in lighting conditions compared to when the training set was collected. This discrepancy between the training and deployment environments poses a challenge to the model's performance.

The issue described is an example of **concept drift** or **data drift**:

  - **Concept Drift**: Occurs when the relationship between the input data (images) and the target variable (defect presence) changes over time. In this case, altered lighting conditions affect how defects appear in images, impacting the model's ability to detect them accurately.
  - **Data Drift**: Refers to changes in the distribution of the input data itself. Here, the darker images represent a shift in the data distribution from what the model was trained on.

Both phenomena can lead to a decline in model performance if not addressed, as the model may not generalize well to the new conditions. A critical task in deployment is detecting and addressing concept and data drift. This involves monitoring the system to identify changes in data distribution and updating the model as needed to maintain performance. Changes can be gradual or sudden, and you need to be alerted of both.

**Practical implications**

This scenario highlights a common challenge in machine learning deployment: the gap between the development environment (where the model is trained and tested) and the production environment (where it is applied). Key points include:

  - Even if a model performs well on a holdout test set, it may struggle in real-world conditions due to unforeseen changes like lighting variations.
  - Addressing such issues often requires additional work beyond initial model development, including:

      - Collecting new data that reflects current factory conditions.
      - Retraining the model with updated data.
      - Implementing mechanisms to monitor and adapt to changes over time.
  - Many projects achieve success in development but require months of additional effort (e.g., six months) to ensure practical deployment success.

## 4.1.2 Software Engineering Challenges

When implementing a prediction service that takes queries (X) and outputs predictions (Y), several software engineering decisions must be made. Below is a checklist to guide these choices:

1.  **Real-Time vs. Batch Predictions**:

      - **Real-Time**: Applications like speech recognition require rapid responses (e.g., within 500 milliseconds for a voice search query). This demands low-latency software capable of processing queries instantly.
      - **Batch**: Some systems, such as those analyzing hospital patient records, can use overnight batch processing to evaluate electronic health records. The choice between real-time and batch processing significantly impacts software design.
      - **Default to batch**: Most use cases don't need real-time predictions. A daily batch job is cheaper, since one run computes everything, and simpler to operate: predictions are precomputed into a key-value store and served by lookup, so when a job fails, users keep getting the previous (slightly stale) predictions instead of an outage. *(Yan, [Real-time ML for Recommendations](https://eugeneyan.com/writing/real-time-recommendations/))* For any new system, ask first whether the user experience allows the work to run asynchronously; batch and async workflows keep the design simpler and cost less to run. *(Yan, [39 Lessons on Building ML Systems](https://eugeneyan.com/writing/conf-lessons/))*
      - **When real-time pays off**: When what users want depends on context or on a short-lived goal that fades fast (shopping for one specific item, picking a film for whoever is watching, travel, ads), or when most users are new and have no history yet, as after a product launch or a move into a new market. Real-time costs more: work is done per request, often with no cache to fall back on, and the APIs must stay fast and available around the clock, which adds on-call work. Keep its infrastructure cost a small share of the value it is expected to add (Yan's example budget is 10% of the extra revenue). *(Yan, [Real-time ML for Recommendations](https://eugeneyan.com/writing/real-time-recommendations/))*
2.  **Deployment Location**:

      - **Cloud**: Many speech recognition systems run in the cloud to leverage powerful computational resources, enabling higher accuracy.
      - **Edge**: Systems like in-car speech recognition or mobile apps often run on edge devices to function offline or ensure reliability. For example, visual inspection systems in factories typically run at the edge to avoid disruptions from unstable internet connections.
      - **Web Browser**: Modern browsers increasingly support deploying ML models directly, offering new deployment options.
3.  **Resource Constraints**:

     Computational resources (CPU, GPU, memory) available for deployment often differ from those used during training. For instance, a neural network trained on powerful GPUs may have to run on less powerful hardware in deployment, which calls for model compression or simplification. Understanding resource constraints helps select an appropriate software architecture.

4.  **Latency and Throughput**:

      - **Latency**: For real-time applications like speech recognition, strict latency requirements (e.g., 300 milliseconds for transcription within a 500-millisecond budget) must be met.
      - **Throughput**: Measured as queries per second (QPS), throughput determines how many requests the system can handle. For example, a system designed for 1,000 QPS requires sufficient computational resources to meet this demand.
5.  **Logging**:

     Comprehensive logging of data is essential for post-deployment analysis, performance review, and collecting additional data for retraining. Logging supports ongoing system improvement.

6.  **Security and Privacy**:

     Requirements vary by application. For instance, when working with electronic health records, stringent security and privacy measures are critical due to the sensitive nature of patient data. Other applications may have less rigorous requirements.

Saving this checklist and reviewing it during software design can help ensure informed decisions when building a prediction service.

**Summary**

Deploying an ML system involves two key sets of tasks:

1.  **Software Development**: Writing software to deploy the system in production.
2.  **Monitoring and Maintenance**: Continuously tracking system performance and addressing issues like concept and data drift.

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
  classDef hl stroke-width:2.5px
  class deployment hl
```

*Deployment within the ML project lifecycle (see [1.2](../overview/lifecycle.md)). Deploying in production is mostly software work; monitoring and maintenance deal with concept and data drift, and send you back to the data and modeling stages. Adapted from DeepLearning.AI, MLOps Specialization.*

The practices for initial deployments differ significantly from those for updating or maintaining an already-deployed system. While some engineers view deployment as the finish line, it often marks only the halfway point. Post-deployment work—such as feeding new data back into the system, updating the model, and maintaining performance amid changing data—is equally critical to ensuring long-term success.

## 4.1.3 Challenges After Deployment

Some problems only appear once the model is live and other systems and people depend on it. Yan groups them by where they come from, starting with the data and ending with the users *(Yan, [Challenges After Deploying ML](https://eugeneyan.com/writing/challenges-after-deploying-machine-learning/))*; the remedies in the last column come from the follow-up post *(Yan, [Maintaining ML in Production](https://eugeneyan.com/writing/practical-guide-to-maintaining-machine-learning/))*.

| Area | What goes wrong | What helps |
|---|---|---|
| **Data** | Upstream changes reach the model unannounced. New or renamed categories (`male` becoming `Male`) get encoded as nulls: nothing errors, but online performance drops. Dropping a column breaks a team you didn't know read your tables. A field changes meaning and leaks information that isn't available at prediction time, as when a doctor's estimate of the hospital stay is overwritten with the actual stay. | Validate each incoming batch: schema, row counts, null rates, duplicate keys, value ranges and the set of category values. A sudden rise in a feature's correlation with the target suggests a leak. Train on the features logged at serving time. |
| **Model** | Features get added and rarely removed, so redundant ones keep costing pipeline work. Other models shown on the same page, and the ranker that orders them, shift your model's online results. | Prune features periodically (permutation importance is a cheap check). Validate each retrained model before release and shadow it on live traffic first. |
| **Engineering** | Glue code in several languages, "magic numbers" (decision thresholds, days of training data, hyperparameters) scattered through the code, configuration that outgrows the ML code, and a production environment you can no longer change at will. | Log every configuration with its commit hash, serve models from containers, keep rollback ready, and keep the system simple for as long as you can. |
| **Real world** | Inputs drift structurally (the schema changes) or semantically (the meaning changes). Feedback loops reinforce errors: a stock forecast penalized for overstock underestimates, stores sell out, and the model learns from the lower sales while still looking accurate. Adversaries probe the model and feed it misleading data. | In ranking, train with positional features ([4.5.8](monitoring.md#458-training-serving-skew)). Relearn decision thresholds at every refresh. Have people review a 1–5% sample of predictions regularly, above all when predictions become future training data. |
| **Organization** | More teams with clashing goals: data science wants the best model, engineering wants stability and low cost, the business wants results now. A fix one person once made in a day now needs a data engineer, a data scientist, an engineer and QA. | Have data scientists, or failing that whole teams, own the work end to end ([1.2.4](../overview/lifecycle.md#124-roles)). Where roles split, agree on clear deliverables between them. |
| **Users** | At scale, even a 0.001% error rate reaches thousands of people, who expect a quick fix. People want explanations when a decision affects them (a loan, an insurance quote, a hospital bill estimate). Privacy rules such as the GDPR limit how personal data can be used. | Give customer service simple tools to act directly (hide a product, opt a customer out, boost a new item) and to explain individual predictions. |

The checks behind the last column are spelled out in [Input Data Checks](monitoring.md#input-data-checks), [Validating a Model Before Release](reproducibility-cicd.md#validating-a-model-before-release), [Rollback Readiness](deployment-patterns.md#rollback-readiness) and [4.5.9 Maintaining Models in Production](monitoring.md#459-maintaining-models-in-production).
