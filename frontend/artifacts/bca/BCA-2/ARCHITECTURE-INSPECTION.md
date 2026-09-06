# BCA:2 architecture inspection

## Stop condition

A small extensible registry and pure immutable resolver transform only established semantic meanings into Business/Project concept intelligence; preserve BCA:1 context, upstream ambiguity, provenance, confirmation, and source isolation; represent multi-context and general versus organization-specific knowledge; structurally establish no current reality, Executive Object, status, permission, decision authority, or causality; and pass focused through full funnel plus TypeScript, lint, build, and diff review.

## Existing concept intelligence discovered

Concept vocabulary exists across `NEXORA_DOMAIN_REGISTRY` object/risk templates, RDI mapping targets, object catalogs, KPI definitions, MO Goal/Problem/Risk/Object contracts, and project scheduling/milestone models. Those registries own runtime domain templates, data mappings, entities, metrics, or project execution metadata. None is the authority for the general question “what kind of Business/Project concept does this already-confirmed meaning represent?” Reusing one as BCA truth would incorrectly conflate concept knowledge with a field mapping, current reality, an Executive Object, KPI, Goal, Problem, Risk, or project state.

BCA:2 therefore extends the BCA namespace with a deliberately small general-knowledge registry. It references BCA:1 context and original semantic/source authority rather than copying their state or creating a store.

## Authority boundaries

- DATA-ADV resolves field/term meaning and owns semantic confirmation. BCA:2 accepts only `AUTHORITATIVE` or `MANAGER_CONFIRMED` meaning for promotion.
- BCA:1 resolves where evidence belongs: BUSINESS, PROJECT, HYBRID, or UNKNOWN. BCA:2 qualifies concept families within that context.
- BCA:2 owns only general concept definitions and read-only concept interpretation.
- Data Reality owns current observations. BCA output always says `currentReality: NOT_ESTABLISHED`.
- Object, KPI, Goal, Problem, Risk, Scenario, Decision, Execution, Outcome, Learning, Stage, and causal authorities remain unchanged. BCA output has `executiveObjectId: null` and associations have `causal: false`.
- Manager Context remains descriptive. Managerial relevance is not permission or decision authority; no role personalization is added.

## Handoffs

DATA-ADV → BCA: established semantic ID, confirmed meaning/state, candidates when unresolved, and original source refs. BCA never derives BKL → Backlog itself.

BCA:1 → BCA:2: immutable context kind, confidence, evidence, and source refs. BCA:2 qualifies registry relevance against that context without changing it.

## Semantic meaning versus concept normalization

Registry aliases apply only after DATA-ADV has established a complete meaning. Matching is exact after case/punctuation/percent normalization; there is no substring match. “On-time delivery percentage” may normalize to the canonical On-Time Delivery concept. Raw OTD/BKL/CAP_AV identifiers are never interpreted by BCA:2. Unknown established meanings stay UNKNOWN.

## General knowledge, organization knowledge, and current reality

Registry definitions are GENERAL. An optional organization-specific meaning must arrive already manager-confirmed with its own source ref; the resolver has no writer. Both scopes can coexist. Neither proves that the concept currently exists, is healthy/unhealthy, is a KPI, or is an active Object.

## Multi-context and hybrid behavior

Definitions carry a list of ranked family relevance records rather than a singleton classification. Each record identifies BUSINESS or PROJECT and a GENERAL, CURRENT_OPERATIONS, or PLANNED_PROJECT aspect. BCA:1 context filters relevance when specific and preserves both sides when HYBRID. This prevents current operational capacity from merging with planned project capacity.

## Ambiguity and causality

LIKELY/AMBIGUOUS DATA-ADV inputs produce no canonical concept, families, or associations. Candidate strings and upstream state remain in the immutable ambiguity record. Registry associations use only the BCA:1 non-causal vocabulary and structurally require `causal: false`. No CAUSES relationship exists.

## Determinism and diagnostics

The registry is frozen and the resolver has no I/O or state. Adding a definition does not require a resolver branch. Identical durable context/semantic inputs yield identical deeply frozen output. Developer diagnostics report recognition basis, semantic authority, families, knowledge scopes, evidence, ambiguity, rejected inferences, and `causalInference: NONE`; they are not wired into Advisor copy.
