# NPA-T RMS:3 — Observable Data contract

`RmsObservableRecord` is generic and reusable.

Required fields: recordId, simulationId, runId, sourceFamily, sourceSystemId, domain, tick, simulatedAt, field, value, unit, relatedEntityId, status, observationProvenance.

Firewall fields (fixed):

- `semanticConfirmation: false`
- `confirmedMeaning: null`
- `hiddenGroundTruthKey: null`
- `causalClaim: false`

Statuses: AVAILABLE, DELAYED, MISSING, STALE.

Observable Data is not Nexora Knowledge. Session `nexoraKnowledge` is unchanged by observation or publication.
