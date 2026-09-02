# DATA-UX:5-FIX1 Architecture Inspection

Date: 2026-08-31

## Expected versus actual

Expected: ASK NEXORA is a conversational entrance into the existing DATA-UX:3 clarification. The next manager utterance that answers that field is interpreted by NCA and written only by CSV semantic / RDI mapping.

Actual before this FIX: ASK NEXORA appended `need.question` and set NCA:2 pending plus a resolver closure. The handoff stopped there as a transcript event. Repeated clicks duplicated the question because the Rail still looked unanswered. `definitionFrom("No.")` could treat leftover text as a meaning. Unrelated questions were classified as answers whenever pending existed (`resolveNcaCsvSemanticReply` defaulted to `answer`).

First divergent layer: NCA CSV adapter + Data Rail ASK NEXORA routing. Not Data Reality, Stage, or a missing second Advisor.

## Authorities

| Question | Owner |
|---|---|
| A. Unresolved CSV meaning | DATA-UX:3 `CsvFieldSemanticUnderstanding` on `CsvColumnMapping` |
| B. Who may confirm | Manager, via existing `applyCsvSemanticClarification` |
| C. Conversational continuity | NCA:2 pending question (`purpose: csv-semantic-clarification`) |
| D. Who writes resolved semantics | `applyCsvSemanticClarification` → mapping review in the import flow; commit remains RDI:2 |
| E. ASK NEXORA before | Posted the question; set pending; did not make the Rail show awaiting; did not classify replies |
| F. Where it stopped | After appending Advisor text. Reply classification, repeat-click UX, reject/ignore, and stale-source close were incomplete |

NCA-POST speech-act classification is reused. No second conversation engine.
