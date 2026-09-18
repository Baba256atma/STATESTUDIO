# NPA-T NMI:8 — Gate Safety

Flow:

Input → Gate (RDI:1) → Canonical authorities → NMI read model → UI / Stage / Advisor

`NMI_LIVE_HOST_CONTRACT.bypassesGate` is false. `feedbackLoop` is false.

There is no canonical state → NMI → canonical state loop.
