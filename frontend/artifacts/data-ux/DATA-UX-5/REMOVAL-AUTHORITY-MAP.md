# DATA-UX:5 Removal Authority Map

| Layer | Owner | Durable? | Source-derived? | Shared? | On confirmed remove | Provenance | Consent |
|---|---|---|---|---|---|---|---|
| Source | RDI:2 store | Session store | n/a | Workspace-scoped | Leaves active list | Historical reference in same store | Yes |
| Snapshot | RDI:1/2 on committed import | With the import | Yes | No | Not current; snapshot id kept on historical ref | Survives as reference | Yes |
| Semantic mappings | DATA-UX:3 on that source | With the import | Yes | No | Do not transfer to a new source | Mapping id retained historically | New source needs new confirmation |
| Observations / dataset | Active Data Reality handoff | While source is active | Yes | Only via one active source | Shell clears active dataset | History not rewritten | Yes |
| Executive objects | Catalog / Manager–Object | Existing objects | Values may be | Objects are shared | Objects remain; current CSV values stop | Not deleted | Yes |
| Evidence / Decision / Execution / Outcome / Learning | Existing executive authorities | Yes | May cite source | Shared | Not revoked or rewritten | Historical citations remain | Separate from data removal |
| DATA_OBJECT / Stage | DATA-UX:1/4 projection | Disposable | Yes | One per source | Projection disappears with store | No current edge | Presentation vs destruction already split |
| Historical reference | Same RDI:2 store | Session, not APP-4 | Yes | No | Inactive; `suppliesCurrentReality=false` | Yes | Created only after confirm |
