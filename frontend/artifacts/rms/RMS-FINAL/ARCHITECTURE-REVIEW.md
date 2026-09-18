# RMS:FINAL Architecture Review

RMS:1–10 is one sealed simulation stack. Customer entry is `/executive/watch`. Runtime entry for conversation is production `executeNexoraConversationalExperience`. Data publication uses production RDI → Data Reality. Ground Truth lives in a WeakMap off the public session.

D7 `frontend/app/lib/simulation` remains a separate operational-graph substrate. It is not RMS Ground Truth, Operator, Scenario, or causal authority.

One repair in FINAL: Experiment comparison rows now key Operator-visible fields (`CAP_AV`, `orders_received`, …) instead of sealed Ground Truth keys. That keeps comparison descriptive and non-leaking.

```
Scenario Library RMS:7
        │
        ▼
Ground Truth RMS:2  ← RMS:6 events / RMS:10 simulation actions (Operator-gated)
        │
        ▼
Operator RMS:3 → Observable Data → RDI / Data Reality
        │
        ▼
Real Nexora (CC:5, Stage, Advisor)
        │
   Manager Agent RMS:4  |  Human RMS:9
        │
WATCH RMS:8 presents manager-visible state
EXPERIMENT RMS:10 forks isolated sessions and compares descriptively
Observer RMS:5 inspects the chain read-only
```
