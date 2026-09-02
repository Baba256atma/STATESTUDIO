# Authority Map

| Concept | Sole authority | DATA-UX:1 behavior |
|---|---|---|
| CSV bytes/parser/mapping | RDI:2 `csvRealDataVerticalSlice` | Reused, unchanged |
| Source identity | `NexoraDataSource.identity.sourceId` / committed `sourceContextId` | Referenced by stable encoded Data Object ID |
| Source snapshot | RDI:1 `NexoraDataSourceSnapshot` | Referenced, never copied as truth |
| Provenance/lineage | RDI:1 snapshot + handoff `factProvenance` | Projection retains snapshot reference only |
| Data Reality | P0 `NexoraDataRealitySnapshot` | Referenced through handoff dataset ID; never mutated |
| CSV commits | `csvRealDataImportStore` | Reused; no new store |
| Source intelligence | RDI:3 `executiveSourceIntelligence` | Reused for current UI/Advisor |
| Stage business objects | NEX-MVP interaction/catalog + P0:5 projection | Unchanged |
| Presentation decision | DIR:1 semantic Director | Receives a compatible read-only reference; no new Director |
| Theatre projection | DTH existing compatibility architecture | Extended with source-family projection only |
| Scene Intent/Script | DTH:5+ resolvers/composers | Unchanged; no invented intent |
| Advisor/conversation | existing NCA/NXA/CC and Data Reality Advisor bridges | Unchanged; ambiguity remains clarification-owned |
| Evidence | existing evidence/Data Reality observation resolution | CSV is not automatically Evidence |

No parallel CSV, Data Reality, Stage, Director, Advisor, Evidence, provenance, or memory authority was introduced.

