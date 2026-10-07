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

## 3.7.4 You Are Not a Typical End User

Dogfooding catches obviously bad changes, but engineers are too close to the code and too costly to act as the evaluation set. Test anything near production quality with crowdsourced raters or a live experiment. For qualitative feedback, use UX methods: personas early on, usability testing later. *(Rules of ML #23)*
