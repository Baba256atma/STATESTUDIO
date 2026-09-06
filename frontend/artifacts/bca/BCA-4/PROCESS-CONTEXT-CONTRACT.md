# BCA:4 process context contract

`resolveBusinessProjectProcessContext` consumes BCA:1 context, BCA:2 concepts, optional BCA:3 relationships, and optional manager-confirmed process placements.

Each `BusinessProjectProcessPlacement` is frozen, read-only, `processInstanceEstablished: false`, `nexoraExecutionEntityId: null`, `nexoraCanonicalExecutionRuntime: "CC:11/CanonicalExecution"`.

Participation types: INPUT_TO, OUTPUT_OF, MEASURE_OF, PERFORMANCE_INDICATOR_FOR, RELEVANT_DURING, USED_IN, MONITORED_IN, CONTROLLED_IN, ASSOCIATED_WITH_PROCESS.

Manager confirmation is consumed, not written.
