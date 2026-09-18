# NPA-T RMS:3 — Operator authority

Operator is the RMS:1 `OPERATOR_AGENT`.

Operator may:

- read a permitted operational slice of sealed Ground Truth
- apply RMS:2 world events (existing RMS:2 rule)
- run deterministic observation
- publish Observable Records through the existing RDI gate

Operator may not:

- represent Nexora intelligence
- make executive decisions
- interpret management meaning for Nexora
- confirm field semantics
- speak through CC:5
- expose hidden causal relationships

Actions are tagged `OPERATIONAL_OBSERVATION` and `PUBLISH_OBSERVABLE_DATA` with `actorKind: OPERATOR_AGENT` and `managerChannelSource: null`.
