# NPA-T RMS:3 — Data Reality integration

Adapter: `rdi-adapter:rms-operator`  
Mapper: `mapping:rms-operator-v1`  
Provider: RMS Operator Agent  
sourceType: `api`

Functions reused: `adaptNexoraDataSource`, `createNexoraDataRealityHandoff`.

Destination authority: `P0:1/NexoraDataRealityFoundation`.

Only AVAILABLE numeric observations enter the RDI snapshot. DELAYED / MISSING / STALE / string statuses remain simulation-side Observable Records.

Confidence on provenance: `unverified`. RMS does not receive semantic privileges because the simulator knows Ground Truth.

Public RMS session `observableData` stays empty so Ground Truth cannot ride a parallel RMS data plane into Nexora.
