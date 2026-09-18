# NPA-T RMS:2 — Simulation clock

Deterministic tick + ISO `simulatedAt` from a fixed epoch (`2026-09-16`) plus one day per tick.

No real-time scheduler. Pause blocks evolution. Replay of the same seed + events yields the same clock and values.
