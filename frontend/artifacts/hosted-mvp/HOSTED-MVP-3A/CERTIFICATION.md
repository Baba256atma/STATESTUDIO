# NPA-T HOSTED-MVP:3A — CERTIFIED

Sealed by NPA-T HOSTED-MVP:3A-R1.

## Authority

Accepted manager data for a Hosted workspace is stored in the existing Hosted Postgres-compatible database. Browser IndexedDB is not the customer-data authority in Hosted mode. Local mode still uses the browser CSV store.

Mapping is the `mapping_json` column on `hosted_data_source`. That is the existing 3A mapping record. A second mapping table was not added.

## Schema

`hosted_pending_csv`, `hosted_data_source`, and `hosted_observation` are created by the same schema execution that opens `hosted_workspace`. Observations and pending rows are removed with their workspace. Observations are removed with their source.

## Proof

- `hostedManagerData.test.ts` passed, including limits, accept, idempotent replay, discard, expiry, cross-workspace refusal, stale runtime replacement, KPI release, raw-text absence, store reopen, and fail-closed store failure.
- Anonymous `POST` pending returned HTTP 401.
- Browser, User A, Company A `ws_UZ5YCnJqspkHgZ1KvSzrtA`: empty, then `company-cert-3a.csv` accepted, still present after reload and after a new browser context.
- Project A `ws_wPEPWgjYq3aYK7Y0JNOxAA`: Company data absent, `project-cert-3a.csv` accepted, still present after Company removal.
- Manufacturing Demo refused personal CSV upload. Company data was unchanged across the demo transition.
- Direct database inspection after removal: Company observations 0, Project source and value `77` remain, pending rows 0, raw CSV header absent, `demo_workspace` sources 0.
- Hydration mismatch, React hydration, uncaught product, and connection refused counts were 0. First client `data-core-int4-ranked` was `false`.
- TSC_EXIT:0. BUILD_EXIT:0.

## Server process

The current authoritative Hosted server is process 36531. `GET /executive` returns HTTP 200.

Three earlier processes on port 3010 were stopped on purpose so the database could be inspected, then replaced. Those stops are intentional server replacement. They are not crashes, watcher failures, or certification failures. No unexpected server failure was observed. The process-reopen proof used those intentional stops. This remaining-gate run did not restart process 36531.

## Remaining isolation

On process 36531:

- Project A `ws_wPEPWgjYq3aYK7Y0JNOxAA` kept `project-cert-3a.csv` through Manufacturing Demo and Reset Demo.
- User B’s workspace list contained Company B `ws_rYPYpTbxjtfUbp8rtP-0rQ` only. Company A and Project A were absent.
- Company B accepted `company-b-cert.csv` and did not show Company A or Project A files.
- After sign-out and return to User A, the list was Company A and Project A. Project A still showed only `project-cert-3a.csv`.
- Hydration errors, uncaught errors, and connection refused were 0.

Production Postgres placement remains HOSTED-MVP:6. Decision and execution persistence remains HOSTED-MVP:3B.
