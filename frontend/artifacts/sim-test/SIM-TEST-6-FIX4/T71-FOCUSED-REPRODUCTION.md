# T71 focused reproduction

- Manufacturing baseline (pre-FIX4): `fnv1a32:f699cf3e`
- Focused baseline (pre-repair, T63–T74 / 74 manager turns): `fnv1a32:e8475255` (S1 = T71 WRONG_REFERENT only)
- Minimum required history: T63–T74 including T69 unknown Supplier clarification and T70 Capacity continuation
- T71 manager utterance: `The delivery issue.`
- Expected referent: `obj-delivery`
- Expected referent type: OBJECT
- Candidate referents (pre-repair): current subject `obj-capacity`; current Problem Capacity Gap; Advisor already named Delivery; no constructed Delivery focus candidate from CC:1
- Candidate provenance: see `REFERENT-CANDIDATES.md`
- Selected referent before: `obj-capacity` (sticky current subject; CC:1 kind `unknown`)
- Selection reason before: no focus/navigation intent, so CC:5 did not adopt the named Delivery target; locative/Advisor Delivery mention did not write canonical referent
- First divergence: CC:1 `resolveMatch` → `unknownMatch` (bare article+name+issue is not `matchFocusOrOpen`)
- Earliest owner: CC:1 `conversationalIntentResolver.matchBareNamedIssueFocus`
- Repair: treat a bounded bare named issue NP as `focus` with lexical hint (not go-back, not locative `the problem`, not `this/that/other`)
- Focused repaired signature: `fnv1a32:fada8518`
- Result: T71 canonical/conversation/Advisor/Stage = `obj-delivery`; response `Focused on Delivery.`; WRONG_REFERENT gone
