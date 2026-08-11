# Sources

This knowledge base was compiled from several external sources. The source Google Doc had no
bibliography, so the list below is reconstructed from the links it contains and from material that
is directly attributable. Entries are split into **cited in the document** (a link or name appears
in the text) and **identified by content** (no citation in the text, but the material is
unambiguously traceable).

## Cited in the document

| Source | Where it appears |
| --- | --- |
| [DeepLearning.AI](https://www.deeplearning.ai/) | Named in [3.6. Performance Auditing](03-development.md#36-performance-auditing) — the GANs/"guns"/"gangs" mistranscription example |
| Snoek, Larochelle & Adams, [*Practical Bayesian Optimization of Machine Learning Algorithms*](https://arxiv.org/abs/1206.2944) (arXiv:1206.2944) | Linked as `homl.info/134` in [1.3. ML Project Checklist](01-overview.md#13-ml-project-checklist), step vi (hyperparameter tuning) |
| Eugene Yan, [*Writing Docs: Why, What, and How*](https://eugeneyan.com/writing/writing-docs-why-what-how/) | [5. Templates](05-templates.md) — the one-pagers / design docs / after-action reviews passage |
| Eugene Yan, [*What I Love About Scrum for Data Science*](https://eugeneyan.com/writing/what-i-love-about-scrum-for-data-science/#retrospectives-feedback-loop-for-improvement) | Linked from [5. Templates](05-templates.md) on retrospectives |
| AWS Well-Architected, [*Correction of Errors*](https://wa.aws.amazon.com/wat.concept.coe.en.html) | Linked from [5. Templates](05-templates.md) on error reviews |
| [JDHarris007/coe — `CoE.md`](https://github.com/JDHarris007/coe/blob/master/CoE.md) | Linked from [5. Templates](05-templates.md) as a Correction of Errors example |
| TensorFlow (2021) | Inline citation in [2.2.7. Data Pipelines](02-design.md#227-data-pipelines), on TensorFlow Transform and the immaturity of provenance/lineage tooling |

## Identified by content

| Source | Sections it corresponds to |
| --- | --- |
| Andrew Ng / DeepLearning.AI, [*Machine Learning Engineering for Production (MLOps) Specialization*](https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops) (Coursera) | The document's overall spine: the ML project lifecycle (scoping → data → modeling → deployment), both case studies ([speech recognition](01-overview.md#15-case-study-speech-recognition-system), [defect inspection](04-deployment.md#45-case-study-defect-inspection-in-manufacturing)), and most of [2. Design](02-design.md), [3. Development](03-development.md), and [4. Deployment](04-deployment.md) — including human-level performance (HLP), label consistency, data-centric AI, error analysis and prioritization, performance auditing, the degree-of-automation spectrum, shadow/canary/blue-green deployment, and concept vs. data drift |
| Aurélien Géron, *Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow* (O'Reilly) | [1.1. Introduction](01-overview.md#11-introduction) (why ML, types of ML systems, batch vs. online learning, main challenges) and [1.3. ML Project Checklist](01-overview.md#13-ml-project-checklist), which follows the book's eight-step checklist. The `homl.info` short-link in the checklist is the book's own link domain. |
| Eugene Yan (eugeneyan.com) | The remainder of [5. Templates](05-templates.md) — the feasibility assessment → proof of concept → develop for production progression. Written in the same first person as the verified passage above, but no verbatim match to a specific post was confirmed. |

## Notes

- No source is listed here that is not either linked/named in the source document or traceable to it
  by content. Where attribution is inferred rather than stated, it is in the second table.
- Section 5 is written in the first person of its original author (Eugene Yan), not of the
  compiler of this knowledge base.
