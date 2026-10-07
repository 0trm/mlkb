# Templates

Write three types of documents when building/operating a system. The first two help to get alignment and feedback; the last is used to reflect, and all three assist with thinking deeply and improving outcomes.

*The document types below are adapted from Eugene Yan, [Writing Docs: Why, What, and How](https://eugeneyan.com/writing/writing-docs-why-what-how/); the first-person voice in the original is his.*

```mermaid
flowchart LR
  Idea[Idea] --> OP([One-pager])
  OP -- align on<br>one-pager --> DD([Design doc])
  DD -- review design doc,<br>then execute --> AAR([After-action<br>review])
```

*Where each document falls on a project timeline (not to scale). Adapted from Eugene Yan, *Writing Docs: Why, What, and How*.*

**One-pagers:** Used to achieve alignment with business/product stakeholders. Also used as background memos for quarterly/yearly prioritization. In a single page, they should allow readers to quickly understand the problem, expected outcomes, proposed solution, and high-level approach. Extremely useful to reference when you’re deep in the weeds of a project, or encounter scope creep.

**Design docs:** Used to get feedback from fellow scientists and engineers. They help identify design issues early in the process. Furthermore, you can iterate on design docs more rapidly than on systems, especially if said systems are already in production. It usually covers methodology and system design, and includes experiment results and technical benchmarks (if available).

Design docs are more commonly seen in engineering projects; not so much for data science/machine learning. Nonetheless, Yan finds them invaluable for building better ML systems and products.

**After-action reviews:** Used to reflect after shipping a project, or after a major error. A project review covers what went well (and not so well), follow-up actions, and how to do better next time. It’s like a [scrum retrospective](https://eugeneyan.com/writing/what-i-love-about-scrum-for-data-science/#retrospectives-feedback-loop-for-improvement), except with more time to think and written as a document. The knowledge can then be shared with other teams.

An error review (e.g., the system goes down) diagnoses the root cause and identifies follow-up actions to prevent reoccurrence. Nobody is blamed. The intent is to discuss what the team can do better and share the (sometimes painful) lessons with the greater organization. Amazon calls these [Correction of Errors](https://aws.amazon.com/blogs/mt/why-you-should-develop-a-correction-of-error-coe/); here’s [what one looks like](https://github.com/JDHarris007/coe/blob/master/CoE.md).

**Where each fits in the lifecycle**

  - **One-pager**: during scoping, before any data work ([2.1 Scoping](design/scoping.md)).
  - **Design doc**: before building, to get feedback on methodology and system design while changes are still cheap ([2.1.6 Project Phases and Timeboxes](design/scoping.md#216-project-phases-and-timeboxes)).
  - **After-action review**: after shipping, or after a production incident ([4 · Deployment](index.md#4--deployment)).
