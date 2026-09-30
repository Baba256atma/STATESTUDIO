# Provenance, Gate, and Data Reality evidence

Every CSV version retains:

- scenario and RMS run IDs;
- source type and filename;
- `sim-test.csv.v1` schema version;
- generated simulation tick and simulated timestamp;
- canonical source-context ID;
- originating Operator record IDs;
- `sealedGroundTruthIncluded: false`.

The RDI:2 handoff preserves source ID, observed/imported timestamps, source record and field keys, and an `rdi2:mapping` transformation reference. A committed state contains the resulting Data Reality dataset/snapshot reference. SIM-TEST records publication IDs but never writes Data Reality itself.

Controlled cases:

- Ambiguous header `capacity`: `MAPPING_REQUIRED`; no simulator confirmation and no Data Reality update.
- Missing available capacity: absent from CSV and absent from the Gate handoff.
- Stale Maintenance source: retains its earlier tick/version/content and is labeled stale.
- ERP/Production disagreement: both values remain in their source files; SIM-TEST chooses no winner.
- Delayed available capacity: absent before its release tick and cannot reach Data Reality early.

Manufacturing final Gate outcomes include committed ERP, Production, and Inventory versions. Maintenance remains `MAPPING_REQUIRED` because `machineStatus` has no confirmed production meaning. Logistics Inventory and Service HR remain `NO_ROWS`, truthfully preserving absent Operator observations.
