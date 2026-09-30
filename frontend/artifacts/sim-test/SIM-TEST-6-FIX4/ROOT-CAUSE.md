# Root cause

**Symptom:** Manufacturing T71 `JOURNEY/WRONG_REFERENT`. Manager says `The delivery issue.` after a lifecycle-rich session (including T64 Delivery locative and T69 unknown Supplier clarification). Canonical subject stays Capacity. Observer expected the named Delivery family.

**First incorrect transition:** CC:1 `resolveMatch` classifies the utterance as `unknown` instead of `focus` with a `delivery` target hint.

**Earliest owner:** CC:1 `conversationalIntentResolver` — existing focus matcher only accepts explicit presentation verbs. Bare `the {name} issue/problem` is a legitimate named Object/Problem move in this corpus.

**Why the wrong candidate was eligible:** Capacity was the legitimate current subject after T70. It remained eligible as default context when no new target was admitted.

**Why it won:** Selection never ranked Delivery vs Capacity. Delivery never entered the intent target set, so CC:5 did not navigate. Advisor could still mention Delivery from 6.1/NXA without writing canonical referent (FIX2 boundary).

**Why long-session history exposed it:** T64 established Delivery as a historical Object; T69–T70 re-centered Capacity. T71 is an explicit named return without a go-back verb. Short sessions that always say `Show Delivery` never hit this CC:1 hole.

**Why the repair belongs at this seam:** Intent kind is the first layer that drops the named target. 6.2 ranking, Advisor, and Stage would only paper over a missing focus intent. No new referent authority.

**Not the root:** T69 clarification residue (pending closed; T71 clar=false); fuzzy matching; Decision/Execution stickiness; Stage writing referent.
