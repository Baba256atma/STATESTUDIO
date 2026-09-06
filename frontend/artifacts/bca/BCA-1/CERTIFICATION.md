# BCA:1 certification report

## Architecture inspected

Inspected Domain registry/types/helpers and Domain Project snapshots; workspace contract; DATA-ADV:1/2 context, semantic contract, confirmation writer, RDI mapping/store/restore; MO Goal/Object context; evidence/provenance and causal boundaries; NCA/Advisor; Director/Stage; Decision, Execution, Outcome, and Learning protections; and the test funnel.

## Existing authorities reused

`WorkspaceId` and `NexoraDomainId` are reused directly. Domain/project/organization/goal/object/data/relationship evidence enters with the owning authority and source identity. DATA-ADV confirmed concepts retain their RDI/DATA-ADV source-context reference. No existing authority is copied into a BCA store.

## Files created

- `app/lib/business-context-awareness/businessProjectContextContract.ts`
- `app/lib/business-context-awareness/resolveBusinessProjectContext.ts`
- `app/lib/business-context-awareness/index.ts`
- `app/lib/business-context-awareness/resolveBusinessProjectContext.test.ts`
- `artifacts/bca/BCA-1/ARCHITECTURE-INSPECTION.md`
- `artifacts/bca/BCA-1/CONTEXT-CONTRACT.md`
- `artifacts/bca/BCA-1/TEST-EVIDENCE.md`
- `artifacts/bca/BCA-1/CERTIFICATION.md`

## Files modified

No production authority outside the new BCA foundation was modified for BCA:1. Existing generated funnel diagnostics and ledger files were refreshed by certification. Pre-existing uncommitted DATA-ADV:2 changes were preserved.

## BCA authority boundary

BCA owns only contextual interpretation, evidence/provenance projection, uncertainty, non-causal contextual relationships, and developer diagnostics. It owns no Domain, Goal, Object, Data Reality, semantic truth, Stage, Scenario, Decision, Execution, Outcome, Learning, causality, persistence, or LLM truth.

## DATA-ADV → BCA handoff

BCA accepts only `AUTHORITATIVE` or `MANAGER_CONFIRMED` semantic concepts. The handoff contains concept identity/label plus authority, source, and source-context references. Unconfirmed semantic candidates are excluded from classification and relationship generation.

## Context proofs

- BUSINESS: confirmed manufacturing/company/domain and On-Time Delivery context produced BUSINESS with Operations/Delivery relevance.
- PROJECT: Warehouse Expansion plus completion and cost concepts produced PROJECT with schedule/cost relevance.
- HYBRID: manufacturing business and production-line installation project were both preserved.
- UNKNOWN: unconfirmed BKL/CAP_AV produced UNKNOWN, zero known concepts, and zero contextual relationships.

## Uncertainty and causality proofs

Confidence and confirmation are separate categorical dimensions. Insufficient evidence remains UNKNOWN/AMBIGUOUS. Every produced relationship structurally carries `causal: false`; `CAUSES` is absent from the relationship vocabulary and diagnostics explicitly reject contextual relevance as causal proof.

## Manager Context boundary proof

Finance Manager can be attached as descriptive, source-referenced context. Its contract requires `permissions: null` and `decisionAuthority: null`. No role intelligence, authorization, or approval inference was introduced.

## Source-isolation proof

Two Backlog Level concepts with different source-context IDs produce different context IDs and source reference sets. Neither projection contains the other source.

## Refresh/persistence proof

BCA has no hidden or session state. Rebuilding from serialized durable authoritative inputs yields a deeply equal frozen projection.

## Regression results

Focused BCA: 8/8 passed. Funnel Levels 1, 2, and 3 passed. Level 4 passed all 7 required tasks with no failures, skips, running tasks, or uninspected results.

## TypeScript / build / lint

TypeScript passed with the repository-appropriate 8 GB Node heap. Targeted ESLint passed. Production build and executive smoke passed inside Level 4. `git diff --check` passed.

## Remaining limitations

BCA:1 intentionally has a small contextual vocabulary and no Advisor-facing integration. It does not persist context, learn an ontology, infer permissions, recommend actions, or create causal claims. Unsupported concepts remain UNKNOWN for future phases.

BCA:1 — CERTIFIED
