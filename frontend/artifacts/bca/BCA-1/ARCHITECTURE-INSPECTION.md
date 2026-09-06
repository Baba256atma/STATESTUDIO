# BCA:1 architecture inspection

## Stop condition

One immutable, deterministic, read-only context foundation represents BUSINESS, PROJECT, HYBRID, or UNKNOWN; consumes only confirmed authoritative inputs for classification; preserves evidence, provenance, ambiguity, manager confirmation, and source identity; produces only explicitly non-causal contextual relationships; reserves manager-role metadata with no permission or decision authority; mutates no existing authority; and passes focused through full funnel, TypeScript, lint, build, and diff review with zero known relevant failures.

## Authorities inspected and reused

- Domain: `NexoraDomainId`, `NEXORA_DOMAIN_REGISTRY`, domain helpers, and Domain Project snapshots. BCA references domain/project identity; it neither expands nor replaces these authorities.
- Workspace: `WorkspaceId` and optional workspace domain attachment remain workspace-owned.
- DATA-ADV/RDI: CSV mapping `confirmedMeaning`, `confirmationSource`, source context identity, semantic candidate/clarification boundary, and durable store. BCA consumes only confirmed semantic concepts and never writes them.
- Goals and Objects: MO goal/context contracts and existing object/domain catalogs remain authoritative. BCA accepts typed evidence signals; it does not create either.
- Evidence/provenance: existing systems use typed source references and authority identifiers. BCA defines only its narrow cross-authority reference shape because Decision provenance is decision-specific and cannot be repurposed as business-context truth.
- Causality: existing relationship/causal intelligence remains authoritative. BCA relationships carry the invariant `causal: false`.
- Advisor/NCA, Director, Stage, Decision Theatre, Decision, Execution, Outcome, and Learning remain unchanged consumers or downstream authorities.

## Ownership

BCA owns only deterministic contextual interpretation: context kind, contextual known concepts, evidence trace, provenance references, non-causal contextual relevance, uncertainty, and developer diagnostics.

BCA does not own Domain, organization onboarding, project records, manager identity, permissions, Goals, Objects, Data Reality, semantic confirmation, Stage, scenarios, Decisions, Execution, Outcomes, Learning, or causality. It has no store.

DATA-ADV owns field identity/meaning candidates and confirmed semantic meaning. The handoff into BCA is a confirmed semantic concept plus the original authority/source/source-context reference. Candidate/ambiguous/unknown semantic meanings are excluded from BCA classification.

Future Manager Context will own who Nexora is advising and communication adaptation. BCA:1 merely permits a descriptive role attachment. Its contract requires `permissions: null` and `decisionAuthority: null`; role is never authorization.

## Canonical contract

`BusinessProjectContext` contains stable context/workspace identity, kind, optional domain/organization/project/manager attachments, confirmed known concepts, contextual relationships, evidence, categorical confidence, aggregate confirmation state, source references, unresolved context, and projection origin. All returned state is deeply frozen.

Confidence states are `KNOWN`, `MANAGER_CONFIRMED`, `SUPPORTED`, `LIKELY`, `AMBIGUOUS`, and `UNKNOWN`. Confirmation remains the separate `AUTHORITATIVE`, `MANAGER_CONFIRMED`, or `UNCONFIRMED` dimension.

## Evidence and provenance model

Evidence kinds are bounded references to existing authorities: Domain, Organization, Project, Manager Statement, Goal, Object, DATA-ADV confirmed semantic, Data Reality, and Existing Relationship. Each evidence item carries its source authority, source identity, optional source-context identity, and confirmation state. Rebuilding the projection from durable source input is sufficient; there is no hidden session truth.

## Minimal relationship vocabulary

`BELONGS_TO_CONTEXT`, `RELEVANT_TO`, `ASSOCIATED_WITH`, `MEASURE_OF`, `SUPPORTS_UNDERSTANDING_OF`, and `POTENTIALLY_RELATED_TO` are the complete foundation vocabulary. BCA:1 currently emits only `RELEVANT_TO` and `MEASURE_OF`, using a small reusable concept vocabulary. Every relationship is evidence-linked and `causal: false`.

## Deterministic resolution

Explicit confirmed organization context supports BUSINESS. Explicit confirmed project context or PMO domain supports PROJECT. Both support HYBRID. Confirmed domain and DATA-ADV concepts may support classification. Unconfirmed semantic concepts cannot classify or create relationships. With insufficient or conflicting support, UNKNOWN/AMBIGUOUS remains valid. Identical inputs yield identical output.

## Diagnostics

`diagnoseBusinessProjectContext` exposes resolved kind/confidence, evidence and relationship traces, unresolved context, and rejected unsafe inferences. These are developer diagnostics only and are not wired into manager-facing Advisor copy.
