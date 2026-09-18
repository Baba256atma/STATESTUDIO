# NPA-T NMI:1 — NMI ↔ RMS boundary

RMS Ground Truth and NMI Management Intelligence are different concepts.

Required relationship:

RMS Ground Truth → Gate / canonical Nexora authorities → NMI Unified Management Model → Advisor / VAI / NPS / Stage / Theatre.

- RMS must not write privileged NMI truth (`rmsWritesNmiTruth: false`).
- NMI must not become a simulation engine (`nmiIsSimulationEngine: false`).
- RMS:1 still lists NMI as a deferred RMS capability; NMI:1 is a Nexora composition layer, not RMS:2.
- RMS:2 is not started.
