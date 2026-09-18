# NPA-T RMS:3 — Semantic firewall

Internal Ground Truth variable `availableCapacity` publishes as operational field `CAP_AV`.

Nexora dataset metricKey remains `CAP_AV`. RMS does not map it to “Available Capacity”.

Publication calls existing DATA-ADV:2 `resolveSemanticCandidates` with `confirmationSource: "none"`. Result must require confirmation and must not be AUTHORITATIVE or MANAGER_CONFIRMED.

Simulation knowledge cannot become semantic confirmation.
