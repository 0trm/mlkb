# 3.5 Prioritizing Improvements

Deciding where to focus your efforts in a machine learning project requires a strategic approach. Beyond assessing the gap to human-level performance (HLP), consider the prevalence of each data category and other practical factors to maximize impact.

## 3.5.1 Analyzing Data Distributions

The distribution of data across categories significantly influences prioritization. For example, suppose your speech recognition dataset is distributed as follows:

  - Clean speech: 60%
  - Car noise: 4%
  - People noise: 30%
  - Low-bandwidth audio: 6%

| Type | Accuracy | HLP | Gap to HLP | % of data | Max overall gain |
|---|---|---|---|---|---|
| Clean speech | 94% | 95% | 1% | 60% | 0.6% |
| Car noise | 89% | 93% | 4% | 4% | 0.16% |
| People noise | 87% | 89% | 2% | 30% | 0.6% |
| Low bandwidth | 70% | 70% | 0% | 6% | ~0% |

*Maximum overall gain is the gap to HLP times the category's share of the data. Adapted from DeepLearning.AI, MLOps Specialization.*

Improving accuracy on clean speech from 94% to 95% (a 1% gain) across 60% of the data would increase overall system accuracy by 0.6% (1% × 60%). In contrast, improving car noise performance by 4% across 4% of the data yields only a 0.16% overall improvement (4% × 4%).

This analysis highlights that clean speech and people noise, due to their larger share of the dataset, offer greater potential for overall performance gains compared to car noise, despite the latter’s larger gap to HLP.

## 3.5.2 Factors for Prioritization

When deciding which categories to prioritize, evaluate the following:

1.  **Room for Improvement**: Compare current performance to a baseline, such as HLP, to estimate potential gains.
2.  **Category Prevalence**: Assess how frequently a category appears in the dataset. Categories with higher prevalence can yield larger overall improvements.
3.  **Ease of Improvement**: Consider how feasible it is to enhance accuracy in a category, factoring in data availability and algorithmic complexity.
4.  **Category Importance**: Evaluate the practical significance of improving a category. For instance, enhancing speech recognition with car noise may be critical for hands-free map searches while driving, where user safety and convenience are paramount.

No mathematical formula dictates the optimal choice, but weighing these factors enables informed, impactful decisions.

## 3.5.3 Targeted Data Collection and Augmentation

Once you identify priority categories, focus on improving performance by enhancing the data for those categories:

  - **Collect More Data**: If car noise is a priority, gather additional audio samples with car noise. Targeted data collection is more efficient than collecting generic data, which can be time-consuming and costly.
  - **Use Data Augmentation**: Apply techniques to generate synthetic data for the target category, such as simulating car noise in existing audio samples. This can boost performance without extensive data collection.
  - **Improve Label Accuracy and Data Quality**: Clean up the labels and the examples you already have for the target category.

For example, rather than broadly collecting data from low-bandwidth cell phone connections, focus on acquiring or augmenting data specifically for car noise or people noise. This precision ensures resources are used effectively to improve algorithm performance where it matters most.

## 3.5.4 When Performance Plateaus

Signs of a plateau: monthly gains shrink, and experiments start trading one metric against another. At that point *(Rules of ML)*:

  - **Look for qualitatively new information** (#41): After a few quarters without a launch above 1%, stop refining existing signals. Build infrastructure for radically different features, such as the user's history over the last day, week, or year, data from another product, or knowledge-graph entities. Lower your expectations for return on investment accordingly.
  - **Keep ensembles simple** (#40): Each model should be either a base model that takes features or an ensemble that takes only other models' outputs, never both. Use a simple ensembler, prefer calibrated base models, and enforce monotonicity: a higher base score should never lower the ensemble's score.
  - **Don't expect diversity, personalization, or relevance to track popularity** (#42): Clicks, watches, and shares measure popularity, and popularity is hard to beat. Features for personalization or diversity often get less weight than expected. Add them through post-processing, and keep them if long-term objectives improve.
  - **Reuse social signals, not interests, across products** (#43): Models of who your friends are often transfer between products; personalization features often don't. Raw data from one product, or simply knowing a user is active on another product, can still help.
