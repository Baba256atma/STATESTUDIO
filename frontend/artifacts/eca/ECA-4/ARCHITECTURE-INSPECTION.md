# NPA-T ECA:4 — Architecture Inspection

Date: 2026-09-14 (re-inspection for NEW PHASE certification; prior inspection 2026-09-07)

## Stop condition

ECA:4 may be certified only when one read-only information-need judgment consumes certified ECA:1–3; distinguishes ambiguity from information gaps; checks existing authoritative information before asking; plans at most one minimum necessary question or proceeds with uncertainty; never writes business/Stage/Data truth; does not implement ECA:5 answer ingestion; passes focused A–T plus prompt A–P and four multi-turn sequences; passes short live proofs (≤5); and preserves ECA:1–3 plus required quality gates.

## Existing authorities inspected

| Concept | Existing authority | Reuse decision |
| --- | --- | --- |
| Working situation | ECA:1 | Required input |
| Conversational next move | ECA:2 `ASK_CLARIFICATION` / `ASK_FOR_MISSING_INFORMATION` / `SHOW_UNCERTAINTY` | Enrich; do not replace planner |
| Initiative | ECA:3 | May flag missing info; ECA:4 decides *what* to acquire |
| Conversational question ranking | NCA:3 | Do not recreate |
| Reference ambiguity | ECA:1 / ECA:2 clarification | Not an information gap |
| Semantic confirmation | DATA-ADV | Canonical for CAP_AV |
| Session I-don’t-know / defer | NCA:2 + `ecaInformationNeedSession` | No new durable store |
| Decision / Execution | CC:10 / CC:11 | Named only; no writes |

## Chosen ECA:4 boundary (already implemented)

Canonical module: `judgeEcaExecutiveInformationNeed` (`ecaExecutiveInformationNeed.ts`).

- Identity: `NPA-T ECA:4/ExecutiveQuestioningInformationAcquisition`
- `shouldAsk` + `acquisitionAction` + one `question` plan
- UNKNOWN ≠ ASK (`PROCEED_WITH_UNCERTAINTY`, `NO_ACQUISITION_NEEDED`, `DEFER`)
- Frozen no-write boundaries including `writesDataTruth: false`
- No second clarification engine; no ECA:5 answer writer

## Dependency direction

ECA:1 → ECA:2 → ECA:3 → ECA:4.

## Parallel authorities forbidden

Do not recreate NCA:3, DATA-ADV semantic writers, clarification engines, or durable memory under an ECA:4 name.
