# SIM-TEST:5-FIX2 — evidence provenance

Advisor may cite only Nexora-visible ingested Data Reality. Path: Operator → CSV → Gate/RDI → Data Reality → Advisor. Observer/RMS Ground Truth is not an Advisor source.

Existing owner: DATA-ADV:1 `answerAdvisorDataInquiry` / `objectDataAnswer` over RDI CSV import records. No SIM-TEST Evidence Selector was added.

| Scenario | Turn | Manager question | Canonical subject | Advisor subject | Source requested | Source available (ingested) | Source used | DR version | Claim | Support | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| manufacturing | 4 | What data supports that? | Capacity | Capacity | Capacity evidence | ERP, Production, Inventory, Maintenance | Production.csv | v1 | Production.csv provides accepted Capacity data. | SUPPORTED | PASS — legitimate vertical source |
| logistics | 4 | What data supports that? | Capacity | Capacity | Capacity evidence | ERP, Inventory (no Production) | none | v1 | I don't see an accepted source currently supporting Capacity. | UNKNOWN | PASS — no invented Production.csv |
| service | 4 | What data supports that? | Capacity | Capacity | Capacity evidence | CRM, HR (no Production) | none | v1 | I don't see an accepted source currently supporting Capacity. | UNKNOWN | PASS — no invented Production.csv |
| project | 4 | What data supports that? | Delivery | Delivery | Delivery evidence | PMO, ProjectControl | none mapped as Delivery CSV evidence | v1 | I don't see an accepted source currently supporting Delivery. | UNKNOWN | PASS — no Production.csv |
| manufacturing | 15 | Yes, that's the decision. | Decision | Decision | n/a | Manufacturing CSV v2 | none | v2 | That Decision is already committed. | SUPPORTED (commitment state) | PASS |
| manufacturing | 38 | Teleport… | Capacity | Capacity family | n/a | Manufacturing CSV v3 | none for fiction | v3 | I can't do that from this workspace. | UNKNOWN (unsupported action) | PASS |

CSV evolution preserved on manufacturing: v1 (T4) → v2 (tick 7, T13–T17) → v3 (tick 21, T28+). Freshness ≠ every claim supported.

FAST T4 has empty csvVersions (FAST mode); Advisor still does not cite Production.csv.

Inspector Data/Files on Watch may show Manufacturing Production.csv v1. That inspector audience is not Advisor authority. Harness Advisor citations follow ingested Data Reality after store reset.
