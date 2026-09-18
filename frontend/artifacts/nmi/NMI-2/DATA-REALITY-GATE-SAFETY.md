# NPA-T NMI:2 — Data Reality / Gate safety

Required flow:

External/Internal Input → RDI:1 Gate API → canonical authority / Data Reality → NMI:1 UnifiedManagementModel → NMI:2 Management Map.

The Management Map is read-only. It must not ingest data, confirm semantics, bypass Gate, upgrade evidence, create Data Objects, or infer unsupported business meaning.

If Data Reality / annotation says UNRESOLVED, the map preserves `knownStatus: "UNRESOLVED"`. NMI:2 does not introduce `NmiGate`.
