# T89 focused reproduction

## Manufacturing signatures

Pre-FIX9: `fnv1a32:39cd74e3`  
Post-FIX9: `fnv1a32:bc1af3ff`

## Focused signatures

T89 focused baseline (post-FIX8 T88 91-turn window containing T89 Advisor finding): `fnv1a32:e1f7764b`  
T89 focused repaired (T84–T93, 93 turns): `fnv1a32:abb9bbdc` (S1=1 at T92 WRONG_REFERENT only)

## Minimum history

T84 What about inventory? → Inventory  
T85 What were we saying about capacity? → Capacity  
T86–T87 Capacity knowledge / Look at that TYPE_AMBIGUITY  
T88 Switch to inventory. → obj-inventory (FIX8)  
T89 The first one.

## Pre-T89 state

canonical subject/referent = `obj-inventory`  
Stage = `obj-inventory`

## T89

| Field | Value |
| --- | --- |
| Utterance | The first one. |
| Intent | CC:1 ordinal `focus` / first |
| Canonical meaning | deictic ordinal; no named Object |
| Subject/referent before | obj-inventory |
| Ordinal detected | yes, index 0 |
| Eligible collections | none (stale PROBLEM lastCollection superseded by T88 named switch) |
| Selected collection | none |
| Expected semantics | ORDINAL_HAS_NO_VALID_COLLECTION |
| Subject/referent after | obj-inventory |
| Advisor input | NCA:2 active Inventory; lastCollection not ordinal-referable |
| Advisor selected | obj-inventory |
| Advisor response | ordered-list clarification (not Capacity Gap) |
| Stage before/after | obj-inventory / persist (no presentation command) |
| First divergence | NCA:2 `interpretNcaDialogueTurn` ordinal against stale `lastCollection` |
| Earliest owner | NCA:2 (collection ordinal lifetime), not NXA:1 |
| Result | REPAIRED_AND_PASS |
