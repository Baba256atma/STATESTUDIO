# Nexora Source Management Architecture

Status: Frozen MVP architecture contract.

Scope: Source Management ownership, data-ingestion navigation, source lifecycle, and legacy source-surface audit.

This document freezes Source Management as the official entry point for operational information entering Nexora. It does not implement connectors, ingestion pipelines, parsing, file processing, AI analysis, or enterprise integrations.

## 1. Canonical Location

Left Navigation entry: Sources.

When selected:

```text
Left Nav -> Sources
Main Right Panel -> Dashboard tab
Dashboard Context -> sources
```

Rules:

- Sources is the permanent first Left Navigation item.
- Sources must never create a third Main Right Panel tab.
- Main Right Panel remains Dashboard and Assistant only.
- Sources updates Dashboard context to `sources`.
- Assistant may discuss sources, but must not become source-management UI.

## 2. Responsibilities

Source Management owns:

- Source registration
- Source configuration
- Source monitoring
- Source health visibility
- Source connection status
- Source metadata visibility

Source Management does not own:

- Scenario generation
- Risk analysis
- Simulation
- War Room decisions
- AI assistant chat
- Direct scene mutation

## 3. Canonical Contracts

The TypeScript source of truth is:

`frontend/app/lib/source-management/sourceManagementContract.ts`

Canonical source type:

```ts
type NexoraSourceType =
  | "csv"
  | "excel"
  | "pdf"
  | "json"
  | "api"
  | "database"
  | "erp"
  | "telemetry";
```

Canonical source status:

```ts
type SourceStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "warning"
  | "error";
```

Canonical source model:

```ts
interface NexoraSource {
  id: string;
  name: string;
  type: NexoraSourceType;
  status: SourceStatus;
  description?: string;
  lastSyncAt?: string;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}
```

Dashboard context includes:

```ts
type DashboardContext =
  | "sources"
  | "overview"
  | "scenario"
  | "risk"
  | "war_room"
  | "timeline"
  | "settings";
```

## 4. Source Health Visibility

Minimum source health visibility:

- status
- last sync
- source type
- source name

Optional visibility:

- records count
- refresh interval
- error message

Refresh logic is not part of this contract.

## 5. Scene Boundary

Canonical flow:

```text
Source
  -> Operational Model
  -> Scene
```

Forbidden flow:

```text
Source
  -> Direct Scene Mutation
```

Source registration and connector activity must not mutate the scene directly. Future D3/D7/D8/D9 work must pass through operational modeling contracts before scene representation changes.

## 6. Brake System

Canonical brake warnings:

- `[SourceManagement][Brake] Unknown source type detected.`
- `[SourceManagement][Brake] Invalid source status detected.`
- `[SourceManagement][Brake] Source context routing failed.`

Unknown source status must normalize to `error`.

Unknown source type currently normalizes to `json` as the safest metadata-preserving fallback and emits a brake warning.

Invalid dashboard context normalizes to `overview` and emits a brake warning.

## 7. Legacy Audit

Existing source-related surfaces identified during the freeze:

- `frontend/app/components/panels/SourceControlPanel.tsx`
  - Classification: legacy decision-intake/analyze UI.
  - Mapping: not canonical Source Management; may later be replaced by Sources dashboard views.
  - Constraint: must not be treated as source registration/config/health UI.

- `frontend/app/lib/connectors/connectorTypes.ts`
  - Classification: D3 connector foundation.
  - Mapping: lower-level connector catalog; Source Management owns source metadata and lifecycle above it.

- `frontend/app/lib/connectors/connectorRegistry.ts`
  - Classification: placeholder connector registry.
  - Mapping: future Source Management may register sources backed by these connectors.

- `frontend/app/lib/connectors/nexoraLiveConnectorRegistry.ts`
  - Classification: disabled live connector catalog.
  - Mapping: future enterprise connectors; not MVP source-management UI.

- `frontend/app/lib/architecture/connectorIngressBoundaries.ts`
  - Classification: connector ingress boundary.
  - Mapping: preserves no-direct-scene-mutation rule and downstream operational-model handoff.

- `frontend/app/screens/homeScreenIngestionDev.ts`
  - Classification: development ingestion helper.
  - Mapping: dev-only experiment; not canonical Source Management.

- `frontend/app/screens/homeScreenMultiSourceIngestionDev.ts`
  - Classification: development multi-source ingestion helper.
  - Mapping: dev-only experiment; not canonical Source Management.

- `frontend/app/screens/homeScreenIngestionSceneBridge.ts`
  - Classification: ingestion-to-scene bridge helper.
  - Mapping: must remain subordinate to the no-direct-scene-mutation contract.

- `backend/app/connectors/*`
  - Classification: backend connector foundation and stubs.
  - Mapping: connector execution layer below Source Management; not a dashboard or navigation contract.

- `docs/data-ingestion-layer.md`
  - Classification: earlier ingestion-layer design.
  - Mapping: compatible with the Source -> Operational Model -> Scene rule, but Source Management is now the canonical MVP navigation and source metadata contract.

## 8. Audit Summary

Source Management is frozen as the first Left Navigation mode and routes only to Dashboard context `sources`. Existing connectors, upload experiments, and ingestion helpers remain implementation surfaces below or beside the contract. They must not create extra Main Right Panel tabs, bypass Dashboard context routing, mutate the scene directly, or become AI assistant UI.
