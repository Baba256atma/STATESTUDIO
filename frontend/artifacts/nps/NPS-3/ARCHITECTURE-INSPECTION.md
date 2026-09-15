# NPA-T NPS:3 — Architecture Inspection

Inspection date: 2026-09-15.

NPS:3 composes Evidence/Cause path state. It does not own Evidence, Data Reality, semantics, investigation, or causality.

## Canonical owners

| Concern | Owner | NPS:3 role |
| --- | --- | --- |
| Evidence truth | CC:8 evidence pack + Data Reality observations | Observe items and provenance |
| Data truth | Data Reality / RDI | Observe values; do not write |
| Semantic meaning | DATA-ADV | Unconfirmed fields stay `UNRESOLVED` |
| Investigation | FINAL:5 | Consumed via NPS:2 / investigation thread |
| Causal / contributor reasoning | CORE-INT:3 over CORE-INT:2 / EI:3 | Consume recorded relationships; do not infer root cause |
| Confidence | EI:3 `SemanticConfidence` / CORE-INT:2 presentation confidence | Pass through; never inflate |
| Manager confirmation | ECA:5 / DATA-ADV confirmation | Required before CAP_AV-like fields become evidence |
| Problem ownership | NPS:1 preserved by NPS:2 | NPS:3 refuses cause analysis when UNCERTAIN/CONFLICTED |

## Vocabulary mapping

- Path evidence flags remain NPS:1 `NONE | INSUFFICIENT | PARTIAL | SUFFICIENT`.
- NPS:3 sufficiency for *next reasoning step*: `NONE | INSUFFICIENT | LIMITED | USABLE | STRONG | CONFLICTING`.
- Causal ladder maps CORE-INT semantics (`associated`, `contributor`, recorded `causal`) without independent promotion.
- CORE-INT `rootCause` stays unused unless an existing authority already confirmed a cause (`infersCausality: false`).

## Variable intelligence

Lever / Outcome / Path of Effect / Moderator / Control / Confounder roles are **not** a certified runtime VAI/AVI authority in this slice. NPS:3 records `variableRolesAvailable: false` and only preserves confounders when they already appear in evidence or recorded relationships.

## Promotion rule

NPS cannot raise DATA → EVIDENCE → CONTRIBUTOR → CAUSE by itself. Unresolved semantics are demoted to DATA. Cause/supported-cause labels without `existingCausalAuthority` are demoted to contributor/hypothesis.
