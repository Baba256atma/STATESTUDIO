# NCA-POST:1 root cause

## Typo failure
CC:2 and NLU used exact/morphology plus classic Levenshtein distance 1. Transpositions such as `deilvery` → `delivery` are Damerau distance 1 and Levenshtein 2, so they missed the registered Delivery subject.

## Stale `why?`
Failed lookups did not become first-class dialogue state. Short follow-ups bound to the contextual active subject (Risk/Delivery) instead of the unresolved token.

## Journey-blocker interruption
MO:6 process/journey blockers were promoted as critical NCA:5 signals and could prepend onto ordinary `show` turns.

## Internal-language leak
Journey/process copy and architecture tokens could reach the manager because NCA:6 sanitization did not treat process-state language as non-executive, and locked turns skipped the leak strip.
