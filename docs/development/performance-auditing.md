# 3.7 Performance Auditing

Even when a machine learning model performs well on metrics like accuracy or F1 score, conducting a final performance audit before deployment is critical. This step can prevent significant post-deployment issues by identifying potential problems in accuracy, fairness, bias, and other areas.

After multiple iterations of model development, a performance audit serves as a final check to ensure the system is robust and equitable. It helps uncover issues that might not be evident from standard metrics, safeguarding against real-world failures.

## 3.7.1 Auditing Framework

Follow this structured approach to audit your machine learning system:

### Step 1: Brainstorm Potential Failure Modes

Identify ways the system might fail by considering its performance across various dimensions:

  - **Subgroup Performance**: Does the algorithm perform equally well across different demographic groups, such as individuals of varying ethnicities or genders?
  - **Error Types**: Are there specific patterns in false positives or false negatives? How does the model handle rare but critical cases?
  - **Context-Specific Issues**: For example, in speech recognition, consider:

      - Accuracy across different genders, ethnicities, or perceived accents.
      - Performance on various devices, as microphone quality can vary.
      - Mistranscriptions, especially those producing offensive or inappropriate outputs.

**Example**: In DeepLearning.AI’s courses, an instructor discussing **GANs** (generative adversarial networks) was mistranscribed as referencing "guns" and "gangs" due to the rarity of the term in English. This highlights the need to monitor for problematic mistranscriptions, such as swear words or offensive terms, that could misrepresent the speaker’s intent.

### Step 2: Establish Metrics for Evaluation

Define metrics to assess performance against identified risks, focusing on **data slices**—subsets of the dataset representing specific groups or conditions. Examples include:

  - Accuracy for different genders, accents, or devices in a speech recognition system.
  - Frequency of offensive or incorrect transcriptions (e.g., rude words or misinterpretations like "GANs" to "guns").
  - Precision and recall for rare defect types in manufacturing.

**MLOps Tools**: Tools like **TensorFlow Model Analysis (TFMA)** can automate the computation of detailed metrics across data slices, streamlining the auditing process for each model iteration.

### Step 3: Secure Stakeholder Buy-in

Engage business or product owners to validate the identified risks and metrics. Ensure they agree that these are the most relevant issues to address and that the chosen metrics effectively evaluate potential problems. This alignment fosters trust and ensures the audit addresses business priorities.

## 3.7.2 Industry-specific Considerations

The ways a system might fail are highly **problem-dependent**, and standards for fairness and bias vary across industries. These standards are still evolving in AI and specific sectors. To stay compliant and ethical:

  - **Research Industry Standards**: Investigate acceptable practices for your industry, keeping up with evolving guidelines on fairness and bias.
  - **Leverage Expertise**: Involve your team or external advisors to brainstorm potential issues, reducing the risk of overlooking critical failure modes.

## 3.7.3 Comparing Against Production

Before any user sees a new model, compare it with the one in production *(Rules of ML)*:

  - **Measure the delta between models** (#24): Run both models on a sample of queries through the full system and measure how different the results are (for ranking, the symmetric difference weighted by position). A tiny difference means little change; a large one needs a closer look at the queries that changed most. Sanity-check stability first: a model compared with itself should show almost no difference.
  - **Judge models by what the prediction is used for** (#25): If predictions rank documents, final ranking quality matters more than the predicted probability; if they feed a spam cutoff, the precision of what gets through matters most. If a change improves log loss but hurts the system, look for another feature. If this keeps happening, revisit the objective.
  - **Identical short-term behavior doesn't mean identical long-term behavior** (#28): A model keyed only on document ID and exact query can match production in side-by-sides and A/B tests, yet never surface new apps, because it can only show documents that already have history for that query. The only real test is training on data collected while the model is live, which is hard.

### Counterfactual Evaluation

Standard offline evaluation treats the model's job as **observational**: given the inputs, predict the outcome that was logged. That suits a product classifier, but not a system whose output changes what users do, such as recommendations. There the question is **interventional**: would users click or buy more if they had seen the new model's output instead? Scored on logged interactions, a new recommender is judged on how well it fits past behavior, not on whether it would change that behavior. An A/B test answers the question directly, but it takes effort, needs time to collect enough data, and risks showing users a bad model. *(Yan, [Counterfactual Evaluation](https://eugeneyan.com/writing/counterfactual-evaluation/))*

**Counterfactual evaluation** estimates what the A/B test would show, using the logs alone. The best-known estimator, **inverse propensity scoring (IPS)**, reweights each logged reward $r_i$ (a click, a purchase) by how much more or less often the new policy $\pi_e$ would take the logged action $a_i$ in context $x_i$ than the production policy $\pi_0$ did, and averages over the $n$ logged observations:

$$
\hat{V}_{\text{IPS}}(\pi_e) = \frac{1}{n} \sum_{i=1}^{n} w_i \, r_i, \qquad w_i = \frac{\pi_e(a_i \mid x_i)}{\pi_0(a_i \mid x_i)}
$$

If production recommends an item on a page with probability 0.4 and the new model would do so with probability 0.6, each logged click on that recommendation counts 1.5 times. *(Yan, [Counterfactual Evaluation](https://eugeneyan.com/writing/counterfactual-evaluation/))*

IPS has requirements and failure modes *(Yan, [Counterfactual Evaluation](https://eugeneyan.com/writing/counterfactual-evaluation/))*:

  - **Logged propensities.** You need production's probability of each action: normalized model scores, the frequency of each recommendation in a precomputed table, or impression counts, which Yan prefers as the most direct measure and the best correction for presentation bias. Most public datasets lack these, which helps explain why the method is rare in papers.
  - **Insufficient support.** If the new model takes an action production never took, $\pi_0 = 0$ and the weight is undefined. Give every eligible item a nonzero chance of being shown and sample by it, or show random items on a small slice of traffic.
  - **High variance.** When the two models differ a lot, a few weights explode: one click logged at probability 0.001 and replayed at 0.1 counts 100 times. Keep candidates close to production, **clip** each weight at a maximum (clipped IPS, whose cap is tricky to tune), or **self-normalize** (SNIPS) by dividing by the sum of the weights instead of $n$: $\hat{V}_{\text{SNIPS}} = \sum_i w_i r_i / \sum_i w_i$.

In experiments on synthetic data from a RecSys 2021 tutorial, SNIPS had the lowest error and needed no tuning, though it requires a weight for every logged observation, not only those with a reward. Offline evaluation on logged data is still the place to start. Turn to counterfactual evaluation when offline metrics stop agreeing with A/B results, or whenever you want to simulate an A/B test offline; the method isn't limited to recommenders. *(Yan, [Counterfactual Evaluation](https://eugeneyan.com/writing/counterfactual-evaluation/))*

## 3.7.4 You Are Not a Typical End User

Dogfooding catches obviously bad changes, but engineers are too close to the code and too costly to act as the evaluation set. Test anything near production quality with crowdsourced raters or a live experiment. For qualitative feedback, use UX methods: personas early on, usability testing later. *(Rules of ML #23)*
