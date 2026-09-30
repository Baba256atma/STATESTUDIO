# NPA-T SIM-TEST:8-FIX1 — Current Subject Reassessment Fidelity

## A. Status

NPA-T SIM-TEST:8-FIX1 — CERTIFIED

## B. Root cause

Owning seam: **CC:1** `matchBareNamedIssueFocus` plus **FINAL:6.1** `findObjectMentions` / `resolveRegisteredReference`.

`Is this still a problem?` matched `(.+?) (problem|issue)` because the negative lookahead sat on the first token (`is`), not `this`. The capture became `is this still a`, title-cased to **Is This Still A**, and CC:5 reported no match. Independently, FINAL:6.1 treated the kind noun `problem` as a catalog search and could bind Margin when no current subject existed.

## C. Repair

Minimal production change:

- CC:1: classify deictic current-subject reassessment (`isCurrentSubjectReassessmentUtterance`) and match it as explain/change with empty hints; reject it in `matchBareNamedIssueFocus`.
- FINAL:6.1: treat deictic + reassessment kind nouns as non-names; do not run registered-name recovery on those utterances.
- Composition fidelity: deictic follow-up includes the same CC:1 classifier.

No new authority, store, runtime, router, or RMS/SIM-TEST production branch.

## D. Original replay

ST8-S2-REASSESS: **6 / 6 repaired** (no “Is This Still A”; canonical subject remained Capacity on the classified rows).

Remaining on those Recovery scripts: Advisor may still name Delivery after `Why are deliveries late?` while L1/Stage stay on Capacity. Classified as **downstream / pre-existing SIM-TEST:8 Advisor divergence**, not the FIX1 invented-name root. Not expanded.

## E. Focused tests

| Family | Result |
| --- | --- |
| Reassessment T1–T5, T10 | pass |
| Ambiguity T6 | pass |
| Explicit names T7 | pass |
| Named missing Problem T8 | pass |
| Ground Truth firewall T9 | pass |
| Decision identity T3/T11 | pass |
| Existing deictics T12 | pass |
| Six-row replay | pass (6 journeys) |

## F. Regression

Focused: CC:1 intent tests, subject composition fidelity, FIX18 referent regression, FINAL:6.1 named historical return. **No full SIM-TEST:6/7/8 population re-run.**

## G. Remaining debt

NPS S3 label mismatch (SIM-TEST:6/7/8) unchanged. Downstream Advisor Delivery vs Capacity on Recovery cause-ask unchanged.

## H. Architecture

No second conversation, semantic, referent, subject registry, Manager, Data Reality, Decision, Stage, Advisor, or Object authority.
