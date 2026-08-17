# DM:1–6 — Durable Executive Memory Architecture

Identity: `DM:1-6/DurableExecutiveMemory` · Version `1.0.0` · Namespace `nexora.executive-memory.durable`.

## Authority model

`Runtime State ≠ Session Memory ≠ Durable Executive Memory`.

- Canonical domain Runtimes own current Goal, Problem, Risk, Scenario, Decision, and Execution truth.
- CC:7 and CC:12 own bounded executive-session context and historical observations only.
- APP-4 Executive Memory owns durable historical records, lifecycle, persistence, retrieval, ranking, and citations.
- Advisor consumes current Runtime facts and separately labelled historical memories. Current facts always win.

Durable memory supports the trace `Decision → Reason → Context → Outcome → Learning`. It does not store ordinary conversation transcripts. Promotion requires an explicit executive-memory event with canonical subject references and provenance.

## Persistence and lifecycle

The canonical APP-4 repository now supports its reserved `local_storage` provider. Records survive refresh, new sessions, application restarts, and workspace reopening in the same browser profile. The provider hydrates only during explicit initialization; SSR render has no browser-storage read.

Lifecycle operations use the APP-4 repository: create, controlled update, archive/restore, and supersede. Supersede preserves the replacement and archives the obsolete record with `supersededBy` provenance. Conflicting active historical accounts remain distinct cited evidence; they never override current Runtime truth.

No database or cross-device persistence is claimed in v1.

## Retrieval and Advisor

Retrieval is workspace-isolated, subject-first, bounded to at most 12 results (default 6), and deterministically ranked. Direct subject matches lead, followed by related subjects and Decision/rationale/outcome/learning chain relevance. Archived records are excluded from ordinary contextual retrieval.

Advisor context contains two explicit sections:

1. `currentFacts` from canonical Runtime authorities.
2. `historicalMemories` with memory ID, source, confidence, and provenance.

The boundary marker is `current-facts-override-history`. Advice may use retrieved history, but memory cannot represent what is happening now when a canonical Runtime provides current state.

## Out of scope

Proactive monitoring, notifications, external services, autonomous follow-up, full conversation retention, database persistence, cross-device synchronization, and organizational knowledge distillation are not implemented in this phase.
