# FINAL:6.2 / 6.3 Evidence

Corpora unmodified.

| Gate | Previous (FIX1 L4 omnibus) | Repaired |
| --- | --- | --- |
| FINAL:6.2 multi-turn corpus | FAIL: A3:1 unresolved; D1:3 / R1:14 Delivery not Risk | PASS |
| FINAL:6.2 explicit outranks inherited | FAIL: Delivery after Show Risk | PASS |
| FINAL:6.3 clarification corpus | FAIL: G0c/G1c/G3c–G7c Explain that. action=proceed | PASS |

Root cause: shared named-object vs collection collision on singular `risk`, plus stale `resolvedSubjectId` and collection `presentedIds` stealing `that`.

Authority changed: CC:1 collection match, NCA-POST:2 listing/singular risk, FINAL:6.2 continuity update + `unsafeThat`, FINAL:6.3 pending compatibility + named-NLU deictic, CC:2 presented ranking, NCA-POST:1 fuzzy parts.

Regression count vs unmodified 6.2/6.3 assertions: **0**.
