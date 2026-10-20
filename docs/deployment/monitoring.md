# 4.5 Monitoring

To ensure a machine learning (ML) system meets performance expectations, continuous monitoring is essential. The most common approach is to use dashboards to track key metrics over time, providing insights into system health and performance.

  - Is the model server running?
  - Are the model inputs and outputs as expected?
  - Also known as post-deployment monitoring

Practice good alerting hygiene: make every alert actionable and give the system a dashboard page. *(Rules of ML, Monitoring)*

## 4.5.1 Dashboard Monitoring

Dashboards should be tailored to the specific application, tracking metrics relevant to its operation. Examples include:

  - **Server Load**: Monitors computational resource usage to detect overloading.
  - **Fraction of Non-Null Outputs**: For a speech recognition system, a null output occurs when no speech is detected. A significant change in the frequency of null outputs may signal an issue.
  - **Fraction of Missing Inputs**: Common in structured data tasks, this metric tracks incomplete or missing input data, which could indicate data quality issues.

| Metric | Trend in the example (time 0 to 100) | Alarm threshold |
|---|---|---|
| Server load | Rises from about 0.86 and levels off near 0.90 | Above 0.91 |
| Fraction of non-null outputs | Climbs from about 0.86 to about 0.96 | Outside 0.89 to 0.96 |
| Fraction of missing input values | Dips to about 0.33, then climbs to about 0.6 | Outside 0.2 to 0.6 |

*Three example dashboard metrics and the thresholds set on them; the last two reach their upper threshold by the end of the period. Adapted from DeepLearning.AI, MLOps Specialization.*

To determine what to monitor, follow these steps:

1.  **Brainstorm Potential Issues**: Collaborate with your team to identify everything that could go wrong with the system.
2.  **Design Metrics**: For each potential issue, define statistics or metrics to detect it. For example, if you’re concerned about traffic spikes overloading the service, track server load as a key metric.

## 4.5.2 Types of Monitoring

A. **Statistical Monitoring:** focuses on the input and output data, including predictions. Examples: customer X has a 72% probability of churning, customer Y has a 31% probability of not churning.

B. **Computational Monitoring:** Focuses on technical metrics. Examples: server CPU usage, number of incoming requests, number of predictions, downtime of server.

**Feedback Loop:** The process through which the ground truth is used to improve the machine learning model.

```mermaid
flowchart LR
  N([New data:<br>customer records]) -->|data flow| M[ML model<br>in production<br>on a server]
  M -->|data flow| P([Churn probability:<br>189283: 0.98<br>785469: 0.21])
  G([Ground truth:<br>189283:#nbsp;no#nbsp;churn<br>785469: churned]) -.->|compare| P
```

*What each type of monitoring watches: statistical monitoring covers the new data and the predictions, computational monitoring covers the data flow and the server, and the feedback loop compares predictions with the ground truth.*

## 4.5.3 Types of Metrics

Metrics fall into two broad categories:

1.  **Software Metrics**: These assess the health of the software implementation, including:

      - Memory usage
      - Compute resources
      - Latency
      - Throughput
      - Server load

     Many MLOps tools automatically track these metrics.
2.  **Statistical Metrics**: These evaluate the learning algorithm’s performance and are divided into:

      - **Input Metrics**: Monitor changes in the input distribution (X). For example:

          - In a speech recognition system, track the average length of audio clips. A shift in this metric could indicate a change in user behavior or hardware (e.g., new microphones) that might affect performance.
          - For structured data, monitor the percentage of missing values.
          - In manufacturing visual inspection, track average image brightness to detect changes in lighting conditions.
      - **Output Metrics**: Assess the algorithm’s outputs to gauge performance. For example:

          - In speech recognition, monitor the frequency of null outputs (e.g., when no speech is detected).
          - For voice-based web search, track how often users repeat similar searches in quick succession, which may indicate misrecognition of the initial query.
          - Monitor instances where users switch from voice to typing, suggesting frustration or degraded performance.

Since input and output metrics are application-specific, MLOps tools typically require custom configuration to track them effectively.

## 4.5.4 Iterative Monitoring Process

Like ML modeling, deployment is an iterative process. Initial dashboards and metrics are a starting point, but real-world data from live traffic enables performance analysis and system refinement. Key considerations:

  - **Evolving Metrics**: It’s common to deploy a system with an initial set of metrics, only to discover new issues after weeks of operation. You may need to add new metrics to address unforeseen problems or remove metrics that prove uninformative.
  - **Thresholds and Alarms**: Set thresholds for metrics to trigger alerts. For example, if server load exceeds 0.91, an alarm could notify the team to investigate and potentially scale up resources. Adjust thresholds over time to focus on the most relevant issues.
  - **Responding to Issues**:

      - **Software Issues**: High server load may require changes to the software implementation.
      - **Performance Issues**: Accuracy or statistical problems may necessitate model updates or retraining.
  - **Retraining**: Models often require periodic maintenance. Retraining can be:

      - **Manual**: Engineers manually retrain the model, which is more common.
      - **Automatic**: Some systems, particularly in consumer internet applications, support automatic retraining, though this is less common due to concerns about fully autonomous updates.
      - **How often to retrain?**

          - Business environment: how volatile is the data?
          - Cost: how much does it cost to retrain?
          - Business requirements: what is the required model performance?
          - Freshness: how much does performance degrade when the model is a day, a week, or a quarter old? This sets monitoring priorities. Ad systems see new ads every day and must update daily; Google Play Search degrades within a month without updates. Freshness needs can change as feature columns are added or removed. *(Rules of ML #8)*

```mermaid
flowchart LR
  subgraph modeling[ML modeling]
    direction TB
    A[ML model/<br>data] --> B[Experiment] --> C[Error<br>analysis] --> A
  end
  subgraph deploy[Deployment]
    direction TB
    D[Deployment/<br>monitoring] --> E[Traffic] --> F[Performance<br>analysis] --> D
  end
  modeling ~~~ deploy
```

*Just as ML modeling is iterative, so is deployment: an iterative process to choose the right set of metrics to monitor. Adapted from DeepLearning.AI, MLOps Specialization.*

Monitoring enables early detection of issues, prompting deeper error analysis or data collection to update the model and maintain or improve performance.

## 4.5.5 Pipeline Monitoring

Many AI systems involve complex pipelines with multiple components, not just a single ML model. For example, a speech recognition system typically includes:

  - **Voice Activity Detection (VAD) Module**: Identifies when someone is speaking, clipping audio to include only relevant segments before streaming to the cloud. This reduces bandwidth usage.
  - **Speech Recognition Module**: Generates the text transcript from the clipped audio.

Changes in one component can impact downstream performance. For instance, if a new smartphone microphone alters audio characteristics, the VAD module might clip audio differently (e.g., including more or less silence). This changes the input to the speech recognition module, potentially degrading its performance.

```mermaid
flowchart LR
  A1([Audio]) --> S1[Speech<br>recognition] --> T1([Transcript])
  A2([Audio]) --> V[VAD: voice<br>activity detection] --> S2[Speech<br>recognition] --> T2([Transcript])
```

*A speech pipeline without and with a voice activity detection (VAD) module. Some phones might have VAD clip audio differently, which degrades speech recognition downstream. Adapted from DeepLearning.AI, MLOps Specialization.*

Another example involves user profiles:

  - A system uses clickstream data to build user profiles, predicting attributes like whether a user owns a car to inform decisions (e.g., offering car insurance).
  - These profiles feed into a recommender system that generates product recommendations.
  - If the clickstream data changes (e.g., due to shifts in user behavior), the user profile’s accuracy may decline, increasing “unknown” labels for attributes like car ownership. This altered input can degrade the recommender system’s performance.

```mermaid
flowchart LR
  U([User data<br>e.g. clickstream]) --> P[User profile<br>e.g. own car?<br>y / n / unknown] --> R[Recommender<br>system] --> O([Product<br>recommendations])
  classDef hl stroke-width:2.5px
  class P hl
```

*Every stage can be monitored. A change in the clickstream data shows up first as more "unknown" values in the user profile, then as worse recommendations. Adapted from DeepLearning.AI, MLOps Specialization.*

**Monitoring Complex Pipelines**

To monitor pipelines with two or more components effectively:

  - **Brainstorm Metrics for Each Component**: Identify potential issues for each pipeline stage, including concept drift (changes in the X-to-Y mapping) and data drift (changes in X distribution). Design metrics to detect these issues.
  - **Track Software and Statistical Metrics**:

      - Monitor software metrics (e.g., memory, latency) for individual components or the entire pipeline.
      - Track input and output metrics for each component to detect changes in data or performance.
  - **Apply the Brainstorming Principle**: As with single-model systems, brainstorm everything that could go wrong across the pipeline and design metrics to track those risks.

## 4.5.6 Rate of Data Change

The speed at which data changes varies by application:

  - **Slow Changes**: In face recognition, people’s appearances evolve gradually due to fashion or aging. Higher-resolution cameras may improve image quality over time, but these shifts are typically slow.
  - **Rapid Changes**: In manufacturing, a factory switching to a new material for smartphones can instantly alter their appearance, requiring immediate model updates.
  - **General Trends**:

      - **Consumer Data**: In consumer-facing businesses with large user bases, data tends to change slowly. It’s rare for millions of users to alter their behavior simultaneously, though exceptions like COVID-19 (which shifted online shopping patterns) can cause rapid changes.
      - **B2B/Enterprise Data**: Business data can shift quickly. For example, a factory adopting a new phone coating or a CEO changing operational strategies can abruptly alter the dataset.

While these are general observations with exceptions, they provide a framework for anticipating the rate of data change in your application.

## 4.5.7 Silent Failures

ML systems fail in a way most software doesn't: they keep running and degrade gradually instead of crashing. If a joined table stops updating, the model adapts and stays "reasonably good" while getting worse. At Google Play, a table stale for 6 months was refreshed and install rate rose 2%, more than any other launch that quarter. Feature coverage can also shift with implementation changes, for example a column populated in 90% of examples that suddenly drops to 60%. Track data statistics (including per-feature coverage) and inspect the data by hand from time to time. *(Rules of ML #10)*

### Input Data Checks

Validate incoming data before it reaches training or serving: a bad batch caught early costs far less than repairing the pipeline or cleaning a contaminated feature store afterward. From the most basic checks up *(Yan, [Maintaining ML in Production](https://eugeneyan.com/writing/practical-guide-to-maintaining-machine-learning/))*:

| Level | Checks |
|---|---|
| Incoming files | All expected columns present; the file parses in the expected format and encoding; volume close to earlier deliveries; no sign of tampering if the file is encrypted. Don't assume the format stays fixed: a manual job may be producing it |
| Whole table | Row counts steady from day to day; no nulls where none belong and no sudden change in a column's share of nulls; no duplicate primary keys, which can multiply rows in a join |
| Each feature | Numeric minimums and maximums within sensible bounds (no negative ages), and medians, means and interquartile ranges that don't swing from day to day; the same set of categorical values in similar proportions; timestamps in one format (dd-mm-yyyy shouldn't turn into mm-dd-yyyy) and within plausible dates |
| Statistics | Stable correlations between features and the target (a sudden rise suggests a leak, a slow decline suggests drift); homogeneity tests such as chi-squared to flag shifted distributions, though on large data almost any difference is significant |

## 4.5.8 Training-Serving Skew

**Training-serving skew** is a gap between performance during training and performance during serving. It has three main causes *(Rules of ML)*:

  - Training and serving pipelines handle data differently.
  - The data changes between training time and serving time.
  - A feedback loop between the model and the algorithm.

The best defense is to monitor skew explicitly, so system and data changes don't introduce it unnoticed.

**Preventing skew**

  - **Log serving features and train on them** (#29): Save the features used at serving time and pipe them into training. Even logging a small fraction lets you verify consistency. When YouTube home page switched to logging features at serving time, quality improved and code got simpler.
  - **Beware of tables that change between training and serving** (#31): If features come from a joined table (e.g., comment counts per document), the values at serving time may differ from those at training time. Logging features at serving time avoids this; hourly or daily table snapshots get close, but not all the way.
  - **Share code between training and serving** (#32): Training is batch and serving is online, but both can build the same system-specific, human-readable object and then run one common function to convert it into model input. Avoid using two programming languages for the two pipelines, since that rules out sharing code.
  - **Compare serving inputs with training data**: Log the inputs at serving time both before and after processing, and check that they resemble the training data. If serving data is sparser, the training data may have been enriched upstream, for example with missing customer demographics imputed for daily reports. Training on the logged serving features also shrinks the training pipeline: the jobs that stitched clickstreams into training examples are no longer needed. *(Yan, [Maintaining ML in Production](https://eugeneyan.com/writing/practical-guide-to-maintaining-machine-learning/))*

**Feedback loops in ranking**

  - **Design for the skew ranking creates** (#35): A ranking change alters which results users see, and therefore the data the next model trains on. Ways to favor data the model has already seen: regularize broad features more than query-specific ones, allow only positive feature weights, and avoid document-only features (a popular app shouldn't appear for every query).
  - **Isolate positional features** (#36): Items in the first slot get clicked more regardless of quality. Train with positional features so the model attributes that effect to position, then serve with no positional feature (or one default value for all candidates), since items are scored before their order is known. Keep positional features separate from the rest of the model; don't cross them with document features.
  - **Explore on purpose**: A recommender that only exploits keeps promoting what earned engagement before, and items it never shows never get a chance to earn any. Bandits break the loop by modeling how uncertain each estimate is and spending some traffic to reduce that uncertainty, which matters most when items turn over fast (news, ads) or traffic is low. Exploration can be heavy for a few users or light for everyone: Yahoo shows uniformly random articles to a randomly chosen bucket of users and Twitter runs a random ad policy on 1% of traffic, while Netflix tries new artwork on every member and Schibsted mixes 5% random items into every list it reranks. *(Yan, [Bandits for Recommender Systems](https://eugeneyan.com/writing/bandits/))*
  - **Guide the exploration**: Epsilon-greedy explores uniformly at random; upper confidence bound (UCB) and Thompson sampling aim at the items they are least sure about, so they lose less to poor recommendations. Feedback usually arrives late in production, and there Thompson sampling holds up better: UCB is deterministic and repeats the same choice until new rewards come in, while sampling keeps varying it. In Yahoo's simulation, UCB led at a 10-minute delay but fell behind at 30 and 60 minutes. Warm-start the policy from logged interactions so early users don't see random results; Deezer got better results from a pessimistic prior, closer to real reward rates, than from a naive one. *(Yan, [Bandits for Recommender Systems](https://eugeneyan.com/writing/bandits/))*
  - **Check offline metrics against online results**: Metrics computed on data logged by the existing policy can mislead. In Twitter's comparison, a greedy policy scored best on PR-AUC over a standard test set but lagged on CTR, while UCB and Thompson sampling did the opposite *(Yan, [Bandits for Recommender Systems](https://eugeneyan.com/writing/bandits/))*. Check from time to time whether offline gains (AUC, NDCG) turn into online gains (clicks, conversions); offline metrics that predict online results pay off in every experiment and release decision *(Yan, [Maintaining ML in Production](https://eugeneyan.com/writing/practical-guide-to-maintaining-machine-learning/))*.

**Measuring skew** (#37)

Break the gap into three parts:

1.  **Training vs. holdout**: Always present, and not necessarily bad.
2.  **Holdout vs. next-day data**: Also always present. Tune regularization to maximize next-day performance. A large drop suggests time-sensitive features.
3.  **Next-day vs. live data**: Should be zero. The same example must score the same in training and serving, so a gap here usually means an engineering bug.

## 4.5.9 Maintaining Models in Production

Yan's three must-haves for most teams, drawn from start-up experience *(Yan, [Maintaining ML in Production](https://eugeneyan.com/writing/practical-guide-to-maintaining-machine-learning/))*:

1.  **Validate the model before deploying it** (see [4.4.3](reproducibility-cicd.md#validating-a-model-before-release)): a single check that stops most model misbehavior before users see it.
2.  **Validate the input data** (see [Input Data Checks](#input-data-checks)): row counts, duplicates and null rates first, then numeric and date ranges and the values allowed in categorical columns.
3.  **Make rollback easy** (see [Rollback Readiness](deployment-patterns.md#rollback-readiness)): it lets the team deploy often, because a release that breaks at night can be rolled back at once and fixed in the morning.

### Fast Detection and Recovery

No system catches everything before release, so balance what goes into preventing failures against what goes into recovering from them; monitoring, alerting, rollback and an Andon cord (a way for anyone to stop the line) go a long way. Expect every tenfold increase in traffic to surface new bugs and operational problems, and prepare for them early. *(Yan, [39 Lessons on Building ML Systems](https://eugeneyan.com/writing/conf-lessons/))*

Keep alerts precise. A team that gets too many alerts starts ignoring them, so favor the ones that are both likely to be real and costly to miss, such as those that affect the customer experience. *(Yan, [Maintaining ML in Production](https://eugeneyan.com/writing/practical-guide-to-maintaining-machine-learning/))*

### Ongoing Model Checks

Alongside the input checks, watch the model itself *(Yan, [Maintaining ML in Production](https://eugeneyan.com/writing/practical-guide-to-maintaining-machine-learning/))*:

  - **Model health**: How long since the production model was refreshed; whether it treats groups such as genders or age groups unfairly; and how its most important features shift from day to day, since a feature that suddenly jumps in importance may point to a leak.
  - **Decision thresholds**: A fixed threshold for turning probabilities into decisions goes stale as the data drifts. Choose it again at each refresh: state the production requirement (95% recall, as few false positives as possible, or a balance), evaluate a range of thresholds and ship the one that meets it.
  - **Output audits**: When predictions feed the next training set, errors compound; a classifier that flags spam or offensive reviews trains tomorrow on today's mistakes. Each week or month, have people review a small sample of outputs (1–5%), look for error patterns and new kinds of fraud, fix the matching cases with rules or regular expressions, and relabel the rest through active learning.

### Interfaces and Operational Tooling

When the system is split across teams, agree on deliverables instead of throwing work over the wall. For example, data engineers deliver timely table updates (the data scientists' input), and data scientists deliver a container that exposes a prediction API (their output). *(Yan, [Maintaining ML in Production](https://eugeneyan.com/writing/practical-guide-to-maintaining-machine-learning/))*

Build simple tools so the people around the model can act without asking the team: a form where customer service agents or account managers enter a product or customer ID to block an inappropriate product, honor a privacy request, or give a new product a temporary boost (which also helps with cold start). Give frontline staff explanations of individual predictions so they can answer customers. Both cut ad hoc requests and firefighting. *(Yan, [Maintaining ML in Production](https://eugeneyan.com/writing/practical-guide-to-maintaining-machine-learning/))*
