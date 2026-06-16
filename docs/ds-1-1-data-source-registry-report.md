# DS:1:1 Data Source Registry Foundation Report

Freeze tag: `[DS:1:1_DATA_SOURCE_REGISTRY]`

## Objective

Create the canonical Data Source Registry for Nexora Type-C. Data sources are executive inputs that can later support Objects, Relationships, Risks, Scenarios, and Decision Context.

## Implementation

- Added `frontend/app/lib/data-sources/dataSourceRegistryContract.ts`.
- Added `frontend/app/lib/data-sources/dataSourceRegistryRuntime.ts`.
- Added `frontend/app/lib/data-sources/dataSourceRegistryRuntime.test.ts`.
- Updated the left nav `sources` entry label to `Data Sources` while preserving its existing dashboard context route.

## Registry Model

The registry stores:

- `sourceId`
- `sourceName`
- `sourceType`
- `sourceStatus`
- `createdAt`
- `updatedAt`
- `lastSyncAt`
- `recordCount`

Supported source types:

- `csv`
- `excel`
- `json`
- `manual_entry`
- `future_api_connector`

Runtime APIs:

- `registerDataSource()`
- `removeDataSource()`
- `updateDataSource()`
- `listDataSources()`

## Guardrails

- No object creation.
- No relationship creation.
- No risk derivation.
- No scenario generation.
- No AI analysis.
- Registry persistence only.

## Acceptance

- A. Create source — passed in focused test.
- B. Edit source — passed in focused test.
- C. Delete source — passed in focused test.
- D. Persist source — passed through persistence adapter reload test.
- E. Build pass — `npm --prefix frontend run build` passed.

## Verification

- `node --test frontend/app/lib/data-sources/dataSourceRegistryRuntime.test.ts` — pass, 6 tests.
- `npm --prefix frontend run build` — pass.
- IDE lints for changed files — clean.

