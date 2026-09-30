# Advisor context trace (T64)

Manager
→ CC:1 intent (`what is the problem here`)
CORRECT after repair: deictic `explain`, no named target “Problem Here”

→ FINAL:6.1 object mentions
CORRECT after repair: generic Problem alias skipped for locative kind

→ FINAL:6.2 continuity
DIVERGES_HERE (pre-FIX): `typed-reference` expectedKind=problem selected `ctx-problem-capacity` via `CONTEXT_TYPED_REFERENCE`
CORRECT after repair: `genericCurrentProblemQuestion` keeps `CONTEXT_ACTIVE_SUBJECT` (`obj-delivery`)

→ NCA:1 reference
DOWNSTREAM of 6.2 contextual objectReference

→ NCA:2 dialogue
DOWNSTREAM: pre-FIX TOPIC_SHIFT onto Capacity Gap because incoming name ≠ Delivery and `isPronounOnlyReferent` missed locative “here”

→ NXA:1 contract
DOWNSTREAM: `referentId` consumed `nextNcaState.activeSubject` (Capacity Gap) even when the executive conversation subject stayed Delivery

→ Advisor response
DOWNSTREAM: named not-found “Problem Here” plus stale Problem grounding

→ Stage / MLEVEL
CORRECT at T64: `obj-delivery`
