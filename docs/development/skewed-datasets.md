# 3.6 Skewed Datasets

Skewed datasets, where one class significantly outnumbers another, pose challenges for evaluating machine learning models. Accuracy alone is often misleading in such cases, and alternative metrics like precision, recall, and the F1 score provide a clearer picture of performance.

## 3.6.1 Challenges of Skewed Datasets

In skewed datasets, the majority class dominates, making high accuracy achievable with simplistic models that fail to detect the minority class. Consider these examples:

  - **Manufacturing Smartphones**: If 99.7% of smartphones have no defects (labeled y=0) and only 0.3% are defective (y=1), an algorithm that always predicts "no defect" achieves 99.7% accuracy, despite being ineffective at identifying defects.
  - **Medical Diagnosis**: If 99% of patients don’t have a disease, predicting "no disease" for everyone yields 99% accuracy, yet fails to identify any actual cases.
  - **Wake Word Detection**: In systems detecting wake words (e.g., "Hey Siri"), the wake word is rarely spoken. A typical dataset might have 96.7% negative examples (no wake word) and 3.3% positive examples, making accuracy a poor metric.

In such cases, always predicting the majority class produces high accuracy but misses critical minority class instances, rendering the model practically useless.

## 3.6.2 Using a Confusion Matrix

For skewed datasets, a confusion matrix is a more effective evaluation tool. It organizes predictions against actual labels, with one axis representing ground truth (y=0 or y=1) and the other representing predictions. For a dataset with 1,000 examples (914 negative, 86 positive, i.e., 91.4% negative, 8.6% positive), a confusion matrix reveals how well the model handles both classes.

|  | Actual y=0 | Actual y=1 |
|---|---|---|
| **Predicted y=0** | 905 (TN) | 18 (FN) |
| **Predicted y=1** | 9 (FP) | 68 (TP) |
| **Total** | 914 | 86 |

*Confusion matrix for 1,000 examples: TN true negative, FN false negative, FP false positive, TP true positive. Adapted from DeepLearning.AI, MLOps Specialization.*

## 3.6.3 Precision and Recall

**Precision** and **recall** are key metrics for skewed datasets, offering deeper insights than accuracy:

  - **Precision**: The proportion of positive predictions that are correct.
  - **Recall**: The proportion of actual positive cases correctly identified.

$$
\text{Precision} = \frac{TP}{TP + FP}, \qquad \text{Recall} = \frac{TP}{TP + FN}
$$

| Model | TP | FP | FN | Precision | Recall |
|---|---|---|---|---|---|
| Example above | 68 | 9 | 18 | 68 / (68 + 9) = 88.3% | 68 / (68 + 18) = 79.1% |
| `print("0")` | 0 | 0 | 86 | 0 / (0 + 0), undefined | 0 / (0 + 86) = 0% |

*Precision and recall for the confusion matrix above and for a model that always predicts 0. Adapted from DeepLearning.AI, MLOps Specialization.*

For the example dataset (914 negative, 86 positive), an algorithm that always predicts "negative" achieves:

  - **0% recall**, as it fails to detect any positive examples.
  - **High precision** (if it never predicts positive, precision is undefined or trivially high), but this is meaningless given the low recall.

Low recall flags the algorithm’s failure to identify the minority class, making precision and recall more informative than accuracy.

## 3.6.4 Comparing Models with the F1 Score

When comparing models with different precision and recall values, the F1 score provides a single, balanced metric. The F1 score is the harmonic mean of precision and recall, emphasizing the lower of the two values to ensure both are reasonably high. Mathematically:

$$
F_1 = \frac{2}{\frac{1}{P} + \frac{1}{R}} = \frac{2PR}{P + R}
$$

| Model | Precision (P) | Recall (R) | F1 |
|---|---|---|---|
| Model 1 | 88.3% | 79.1% | 83.4% |
| Model 2 | 97.0% | 7.3% | 13.6% |

*Model 2 has the higher precision, but its low recall drags its F1 far below Model 1's. Adapted from DeepLearning.AI, MLOps Specialization.*

While the F1 score is widely used, you may adjust the weighting of precision and recall based on your application’s needs. For instance, some scenarios may prioritize recall over precision or vice versa.

## 3.6.5 Multi-class Classification with Skewed Data

Skewed datasets are also common in **multi-class classification** problems, such as detecting multiple rare defect types in smartphone manufacturing (e.g., scratches, dents, pit marks, or LCD discoloration). Since each defect type may be rare, accuracy is misleading, as a model could achieve high accuracy by ignoring all defects.

Instead, evaluate **precision and recall for each defect type** individually. For example:

  - **High Recall Preference**: Manufacturing often prioritizes high recall to minimize defective phones reaching customers. Slightly lower precision is tolerable, as human inspectors can verify flagged phones to filter out false positives.
  - **F1 Score for Comparison**: Compute the F1 score for each defect type to obtain a single metric for performance across all classes. This helps benchmark against human-level performance and prioritize which defect type to address next.

| Defect type | Precision | Recall | F1 |
|---|---|---|---|
| Scratch | 82.1% | 99.2% | 89.8% |
| Dent | 92.1% | 99.5% | 95.7% |
| Pit mark | 85.3% | 98.7% | 91.5% |
| Discoloration | 72.1% | 97% | 82.7% |

*Per-class precision, recall and F1 for four phone defect types. Adapted from DeepLearning.AI, MLOps Specialization.*

Using the F1 score avoids the pitfalls of accuracy, which remains high even if the algorithm misses rare defects. It also guides prioritization by highlighting the most impactful defect types to improve.
