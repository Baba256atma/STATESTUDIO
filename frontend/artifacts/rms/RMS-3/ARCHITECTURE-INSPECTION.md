# NPA-T RMS:3 — Architecture Inspection

Inspection date: 2026-09-16.

Stop condition: Operator Agent + Observable Data + existing Data Reality publication only. Do not start RMS:4.

## Inspected

- RMS:1 actor/firewall: Operator, Manager Agent, Nexora, Observer, REAL_MANAGER remain distinguishable. Ground Truth stays in the session WeakMap. Public `observableData` remains empty until a later envelope if Data Reality accepts it; RMS:3 does not fill that public array with Ground Truth.
- RMS:2 Ground Truth/world engine: Northstar Manufacturing and Warehouse Expansion fixtures, deterministic clock/events. `RMS_2_BOUNDARY.startsRms3` remains false (RMS:2 does not auto-start RMS:3). RMS:3 consumes the same sealed world.
- Operator Agent contract: `RMS_OPERATOR_AGENT_CONTRACT` still forbids writing Ground Truth directly to Nexora. Handoff owner remains Data Reality.
- NMI:1 Unified Company / management structure: RMS does not copy canonical entities. Source families are operational identities, not NMI Objects.
- VAI boundaries: world values keep `vaiRoleEngine: false`. Operator does not assign variable analysis roles.
- RDI / Data Reality: canonical path is RDI:1 `adaptNexoraDataSource` + `createNexoraDataRealityHandoff` into P0:1 `NexoraDataRealityFoundation`. RMS:3 adapter id `rdi-adapter:rms-operator` is a source adapter, not a second store.
- DATA-UX / DATA-ADV CSV: RMS:3 does not add a CSV ingestion authority. Publication is API-style sourceType `api`.
- DATA_OBJECT / Data Rail: not used as an RMS-owned store.
- CC:8 Evidence: unused. RMS:3 does not create Evidence.
- Advisor / CC:5: unused. Operator does not converse. Manager Agent conversation is RMS:4.
- Existing CSV import/publication contracts: left as the CSV path. RMS behaves as an external operational API source through the same RDI gate.

## Canonical publication path

Ground Truth (sealed) → Operator permitted view → observation policy → Observable Record(s) → `publishRmsObservableToDataReality` → RDI:1 adapt/handoff → P0:1 Data Reality dataset + fact provenance.

Nexora Knowledge on the RMS session remains empty (`worldId: null`, `facts: []`).

## Consumed vs owned

RMS:3 owns Operator simulation behavior, observation policy, simulated source identities, Observable Records, the simulation-side RDI adapter, and Observer-visible observation history.

Existing Nexora remains authority for Data Reality, semantic confirmation (DATA-ADV:2), Evidence, Objects, NMI, VAI, Advisor, Stage, Decision, Execution, Outcome/Learning.
