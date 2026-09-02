# Source Isolation Contract

1. The confirmed RDI mapping review defines which canonical object domains a CSV claims.
2. Source validation includes every canonical KPI dependency for claimed object domains.
3. Missing required metrics still block when the source claims that KPI domain.
4. KPI definitions for unclaimed object domains do not block the import.
5. A valid source with no canonical KPI claim may commit and project a DATA_OBJECT with zero runtime changes.
6. Zero runtime changes never imply fabricated normal, stable, or available KPI state.
7. Advisor consumes the source-scoped resolved Data Reality snapshot; it does not recompute a broader registry.
8. Source replacement preserves `sourceContextId` and replaces only that workspace/source entry.
9. Other sources and workspaces remain unchanged.
10. Failed validation leaves prior committed truth and manager-confirmed semantic state intact.

