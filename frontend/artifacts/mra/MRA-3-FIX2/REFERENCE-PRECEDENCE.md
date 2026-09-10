# Reference Precedence (effective after FIX2)

Inspected MRA:2 / MRA:3-FIX1 authorities. This list is the observed effective order after the repair, not a replacement engine.

1. **Exact / morphology named reference** in the current utterance (registered catalog). Explicit `look at Capacity` still selects the Capacity KPI even after a Problems listing.
2. **Weak lexical / typo** (fuzzy same-distance siblings): do not uniquely commit. Rank remaining candidates by **current collection members / presented set / thread**, preferring the last collection kind (Problem vs object/KPI, Scenario vs object).
3. **Active conversational referent** (continuity `activeSubject`, NCA active subject) for pronouns and deictic knowledge requests.
4. **Comparison / collection ordinal** (POST:2 / ECA working context) — unchanged from FIX1.
5. **Current investigation target** when the move is investigation-typed (`this problem` / INVESTIGATE), not for generic `tell me more about that`.
6. **Collection listing** as a presented candidate set for disambiguation, not as the pronoun itself.
7. **Stage focus / click** when the incoming focus differs from the session object on a deictic turn (FIX1 click rule retained).
8. **Broader lexical candidates** only when no stronger typed context exists.

Why this preserves FIX1: ordinal and first-problem SHOW still write collection membership; click still wins deictic when Stage focus changed; mutation writer is untouched; Problems SHOW still uses collection intent for plurals (`problems`, `the problems`).
