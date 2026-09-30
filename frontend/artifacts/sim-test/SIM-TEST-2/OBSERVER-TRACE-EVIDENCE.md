# Observer trace evidence

The INGESTION report emits the required read-only trace vocabulary:

- `GROUND_TRUTH_CHANGED`
- `OPERATOR_OBSERVED`
- `CSV_GENERATED`
- `CSV_UPDATED`
- `INGESTION_STARTED`
- `INGESTION_COMPLETED`
- `DATA_REALITY_UPDATED`
- `NEXORA_OBSERVED`
- `MANAGER_TURN`

Every trace has `observerOnly: true` and `writeAttempted: false`. The Manager checkpoints expose neither sealed Ground Truth nor Observer diagnostics. The browser CSV inspector is explicitly labeled Observer/test visibility and is not part of the Manager conversation input.

The Observer finds the first divergent boundary rather than collapsing failures into a generic Nexora error. The certification aggregate preserved DATA_REALITY, OPERATOR, and ADVISOR owners independently.
