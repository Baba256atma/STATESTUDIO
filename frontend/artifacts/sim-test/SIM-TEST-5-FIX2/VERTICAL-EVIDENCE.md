# SIM-TEST:5-FIX2 — vertical evidence

Reuse of existing `SIM_TEST_SCENARIO_CSV_SOURCES` (ingestion contract), not a new Advisor registry.

| Vertical | Declared source families | Ingested in SIM-TEST:5 INGESTION | Advisor-used at T4 after FIX2 | Unsupported citations |
| --- | --- | --- | --- | --- |
| Manufacturing | ERP, PRODUCTION, INVENTORY, MAINTENANCE | yes | Production.csv for Capacity | none |
| Project | PMO, PROJECT_CONTROL | yes | none (unknown Delivery CSV mapping) | none |
| Logistics | ERP, INVENTORY | yes | none | Production.csv removed (was leftover store, not a logistics source) |
| Service | CRM, HR | yes | none | Production.csv removed (same leftover store) |

Manufacturing Production.csv remains valid. Logistics/Service were not given Production.csv files.

Source type (production-type operations) is not collapsed into a literal Production.csv citation. After isolation, Logistics/Service say evidence is unavailable for Capacity rather than citing ERP.csv as Capacity evidence without an existing mapping. That is UNKNOWN, not fabricated provenance.

Gate/RDI remain canonical. Advisor reads ingested import records, not RMS Ground Truth and not raw Operator fixtures as a bypass. Sequential journey leftover was a store-isolation defect, not Advisor reading Operator files directly.
