# 5. Templates

Write three types of documents when building/operating a system. The first two help to get alignment and feedback; the last is used to reflect—all three assist with thinking deeply and improving outcomes.

*The document types below are adapted from Eugene Yan, [Writing Docs: Why, What, and How](https://eugeneyan.com/writing/writing-docs-why-what-how/); the first-person voice in the original is his.*

<img src="images/image123.png" alt="" width="620">

**One-pagers:** Used to achieve alignment with business/product stakeholders. Also used as background memos for quarterly/yearly prioritization. In a single page, they should allow readers to quickly understand the problem, expected outcomes, proposed solution, and high-level approach. Extremely useful to reference when you’re deep in the weeds of a project, or encounter scope creep.

**Design docs:** Used to get feedback from fellow scientists and engineers. They help identify design issues early in the process. Furthermore, you can iterate on design docs more rapidly than on systems, especially if said systems are already in production. It usually covers methodology and system design, and includes experiment results and technical benchmarks (if available).

Design docs are more commonly seen in engineering projects; not so much for data science/machine learning. Nonetheless, Yan finds them invaluable for building better ML systems and products.

**After-action reviews:** Used to reflect after shipping a project, or after a major error. A project review covers what went well (and not so well), follow-up actions, and how to do better next time. It’s like a [scrum retrospective](https://eugeneyan.com/writing/what-i-love-about-scrum-for-data-science/#retrospectives-feedback-loop-for-improvement), except with more time to think and written as a document. The knowledge can then be shared with other teams.

An error review (e.g., the system goes down) diagnoses the root cause and identifies follow-up actions to prevent reoccurrence. Nobody is blamed. The intent is to discuss what the team can do better and share the (sometimes painful) lessons with the greater organization. Amazon calls these [Correction of Errors](https://wa.aws.amazon.com/wat.concept.coe.en.html); here’s how it [looks like](https://github.com/JDHarris007/coe/blob/master/CoE.md).

<img src="images/image85.png" alt="" width="600">

A project usually starts with a **feasibility assessment**. With the existing data and technology, can the problem be solved? If so, to what extent? This stage is a quick and dirty investigation, typically time-boxed at 1-2 weeks.

After feasibility comes a **proof of concept** (POC): a prototype *hacked* together to assess whether the solution is technically achievable. Ideally, it also tests the integration points with upstream data providers and downstream consumers. Can we meet the technical constraints (e.g., latency, throughput)? Is model performance satisfactory? This usually takes a month or two.

If all goes well, the next stage is to **develop for production**, also time-boxed. An overly generous timeline can lead to non-essential features being squeezed in and never-ending development—without actually deploying it, no one benefits from it. This usually takes 3-6 months, including infra, job orchestration, testing, monitoring, documentation, etc.
