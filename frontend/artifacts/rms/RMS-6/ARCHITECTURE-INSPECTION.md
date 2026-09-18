# NPA-T RMS:6 — Architecture Inspection

Inspection date: 2026-09-17.

Stop: Events/Disturbances only. Do not start RMS:7.

D7 `app/lib/simulation` remains a separate operational-graph substrate, not RMS Ground Truth.

RMS:2 `applyRmsWorldEventsOnCurrentTick` / `advanceRmsWorldClock` are the only Ground Truth mutators. Operator → Observable → RDI remains the only Nexora data path.

Event ≠ Nexora Problem ≠ Nexora Risk.
