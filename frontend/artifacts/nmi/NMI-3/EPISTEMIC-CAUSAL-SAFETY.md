# NPA-T NMI:3 — Epistemic / causal safety

Certainty values CONFIRMED, SUPPORTED, LIKELY, ASSUMED, AMBIGUOUS, UNKNOWN are used only when NMI:1 epistemic status or an explicit VAI/CORE-INT:3 overlay justifies them.

- `UNKNOWN` epistemic → UNKNOWN certainty
- `ASSOCIATION` → UNKNOWN certainty, not a cause
- `MANAGER_ASSERTED` → ASSUMED
- `DECLARED` / `EVIDENCE_REFERENCED` → SUPPORTED
- LIKELY only from VAI association overlay
- CONFIRMED causal communication only when overlay has CORE-INT:3 `causeEstablished` and VAI `EVIDENCE_SUPPORTED`

Causal communication classes:

STRUCTURAL_RELATIONSHIP, ASSOCIATION, ANALYTICAL_INFLUENCE, SUPPORTED_CAUSAL_HYPOTHESIS, CONFIRMED_CAUSAL_RELATIONSHIP, NON_CAUSAL.

NMI never upgrades association → influence → probable cause → confirmed cause by itself. An overlay that claims cause without VAI evidence is `UNSUPPORTED_CAUSAL_LINK`.

Numeric strength is always `null`.
