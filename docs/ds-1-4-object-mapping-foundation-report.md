# DS:1:4 — Object Mapping Foundation Report

Freeze Tag: `[DS:1:4_OBJECT_MAPPING_FOUNDATION]`

## Objective

Create the preview-only bridge between Data Sources and Nexora Objects.

Examples:

- Supplier CSV → Supplier Objects
- Project CSV → Project Objects
- Customer CSV → Customer Objects

## Implementation

Added the object mapping contract and runtime:

- `mapSourceToObjectType()` detects the likely object type from source metadata.
- `previewObjectCreation()` returns an estimated object creation preview from a registry source.

The runtime supports canonical preview object types including Supplier, Project, Customer, Inventory, Production, Revenue, Warehouse, Risk, and a generic Business Object fallback.

## Guardrails

- Preview only.
- No Nexora object creation.
- No scene mutation.
- No topology mutation.
- No routing changes.
- No AI analysis or scenario generation.

Every preview result explicitly returns:

- `previewOnly: true`
- `createsObjects: false`

## Acceptance

- A. Mapping preview: passed. Preview returns estimated object count and sample preview object labels.
- B. Type detection: passed. Supplier, Project, and Customer source names map to their expected object types.
- C. Build pass: passed.

## Verification

- `node --test frontend/app/lib/data-sources/dataSourceRegistryRuntime.test.ts frontend/app/lib/data-sources/dataSourceUploadRuntime.test.ts frontend/app/lib/data-sources/dataSourceManagerRuntime.test.ts frontend/app/lib/data-sources/dataSourceObjectMappingRuntime.test.ts`
- Targeted ESLint on DS:1:4 files
- `npm run build` from `frontend`

