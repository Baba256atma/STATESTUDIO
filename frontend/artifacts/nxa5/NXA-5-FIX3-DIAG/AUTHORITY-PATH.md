# Authority path and first divergence

Input → CC:1 normalize → CC:1 intent → FINAL:6.1 NLU → overlay if CC:1 unknown → CC:2 reference → NCA/POST collection → Advisor/NXA route → DIR:1 → Stage.

## A

show scenarios → show-scenarios → reveal-scenarios → SHOW_COLLECTION → collection. OK.

exlpain Demand Surge → normalize leaves exlpain → CC:1 **unknown** → POST:1 resolves Demand Surge → NLU **FOCUS** (named object, no EXPLAIN cue) → overlay **focus** → **FIRST DIVERGENCE** → focus-subject → select-interaction-subject → NXA:1 NAVIGATE → Stage focus.

Owner: FINAL:6.1 overlay + missing verb recovery in CC:1 / POST:1 filler list.

## B

show me problems → Problems collection. OK.

which one of prolems is important? → CC:1 unknown (prolems not a CC:1 token fix) → NLU COMPARE (which one) → overlay compare-scenarios → POST:4 **ACTIVE_COLLECTION** Problems, criterion **OVERALL_SIGNIFICANCE** (`important`) → NXA:5 INSUFFICIENT terminal → DIR NO_CHANGE.

First divergence vs productivity: POST:4 criterion choice / NXA:5 terminal branch, not collection binding. Safety path is expected.

## C

show Demand Surge → focus. OK.

show me all goals → CC:1 show-goals (overlay does not replace) → POST:3 GOAL members=[] → empty copy → CC:4 reveal-goals unsupported → DIR NO_CHANGE canonical-collection-empty → Stage preserved.

No safety divergence. Continuation is NEX-EXP:2, unused.
