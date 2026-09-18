# NPA-T RMS:2 — Ground Truth schema

Sealed `RmsStructuredGroundTruth`:

- world identity / kind / NMI context kind
- entities (organization, units, processes, resources, assets, products, …)
- typed variables (id, value, unit, tick, entity, source, mutability)
- simulation relationships (`knownToNexora: false`, `confirmedCausalForNexora: false`)
- clock, paused flag
- append-only history (not CC:8 Evidence)
- `facts` projection for RMS:1 compatibility
- `publishedToObservableData: false`, `publishedToNexoraKnowledge: false`
